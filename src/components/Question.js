import React, { Component } from 'react';
import {
	Text,
	View,
	FlatList,
	ScrollView,
	Dimensions, 
	Share,
	ActivityIndicator,
	ImageBackground
} from 'react-native';
import { Button, Badge, Icon, Avatar } from "react-native-elements";
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import _ from 'lodash';

import Chat from './Chat';
import colors from '../styles/colors';
import * as actions from '../actions';

FullHeader = () => {
	const { header, badge } = styles;
	return (
		<LinearGradient
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
			colors={[colors.darkred, colors.lightred]}
			style={header}
		>
			<View style={badge}>
				<Avatar
					rounded
					small
					source={{ uri: photo }}
				/>
				<Text style={{ color: colors.grey, paddingHorizontal: 20 }}>
					0
							</Text>
			</View>

			<Icon
				name="arrow-left"
				type="material-community"
				color={colors.lightgrey}
				underlayColor={colors.transparent}
				size={40}
				onPress={() => Actions.pop()}
			/>
			<Icon
				name="home"
				type="material-community"
				color={colors.lightgrey}
				underlayColor={colors.transparent}
				size={40}
				onPress={() => Actions.popTo("dashboard")}
			/>

			<View style={badge}>
				<Text style={{ color: colors.grey, paddingHorizontal: 20 }}>
					0
							</Text>
				<Icon
					onPress={() => this.setState({ show: !this.state.show })}
					name="ellipsis-v"
					type="font-awesome"
					color={colors.grey}
					underlayColor={colors.transparent}
					containerStyle={{ paddingRight: 10 }}
				/>
				<Avatar
					rounded
					small
					source={{ uri: opponentPhoto }}
				/>
			</View>
		</LinearGradient>
	)
}

SimpleHeader = () => {
	return <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} colors={[colors.darkred, colors.lightred]} style={styles.header}>
      <Icon name="arrow-left" type="material-community" color={colors.lightgrey} underlayColor={colors.transparent} size={40} onPress={() => Actions.pop()} />
      <Icon name="home" type="material-community" color={colors.lightgrey} underlayColor={colors.transparent} size={40} onPress={() => Actions.popTo("dashboard")} />
    </LinearGradient>;
}


class Question extends Component {

	select = (num, questionNumber) => {
		const { selectedPlayer } = this.props.player
		const { gameKey, opponent } = this.props.game
		const { username, photo, phone } = this.props.dash.info
		if (gameKey) {
			this.props.saveAnswer(num, questionNumber, opponent, gameKey, username)
		}
		else {
			var url = 'http://amigo.com'
			var body = `I asked you a question on AmigoO. Download the app and answer it!${url}`
			Share.share({
				message: body,
				title: 'Amigo'
			}, {
				dialogTitle: 'Tell your friend you started a game.',
				tintColor: 'mediumseagreen'
			})
			.then(action => {
				// if (Platform.OS === 'ios') {
				// 	action === Share.dismissedAction ? alert('Come on, send a message to invite your friend.') : this.props.creatingGame(num, questionNumber, selectedPlayer, phone, username, photo)
				// }
				// else {
					this.props.creatingGame(num, questionNumber, selectedPlayer, phone, username, photo)
				// }
			})
			.catch((error) => console.log('failed', error));
		}
	}

	renderQuestionButton = () => {
		const { chosenQuestionArr } = this.props.game;
		if (chosenQuestionArr.length < 3) {
		return (
				<Button
					title={'SHOW NEW QUESTION'}
					rounded
					backgroundColor={'mediumseagreen'}
					onPress={() => {Actions.categories()}}
				/>
			)
		} else {
			return (
				<Button
					title={'ONLY 3 QUESTIONS PER ROUND'}
					rounded
					backgroundColor={'lightgray'}
				/>
			)
		}
	}

	renderCard = (item) => {
		return <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.question}>
            <Text style={{ fontSize: 30 }}>{item.content}</Text>
          </View>
          <View style={styles.user}>
            <Badge value={"Your answer is..."} textStyle={{ color: colors.darkgrey, fontSize: 20 }} containerStyle={{ backgroundColor: colors.lightgrey }} />
          </View>
          <View style={styles.options}>
            <Button title={item.choices.option1} textStyle={{ color: colors.darkgrey, fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(1, item.questionNumber);
              }} />
            <Button title={item.choices.option2} textStyle={{ color: colors.darkgrey, fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(2, item.questionNumber);
              }} />
            <Button title={item.choices.option3} textStyle={{ color: colors.darkgrey, fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(3, item.questionNumber);
              }} />
            <Button title={item.choices.option4} textStyle={{ color: colors.darkgrey, fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(4, item.questionNumber);
              }} />
          </View>
        </ScrollView>
      </View>;
	}

	_renderSpinner = (data) => {
		if (data) {
			return (
				<FlatList
					horizontal
					pagingEnabled={true}
					getItemLayout={(data, index) => ({ length: (width), offset: width * index, index })}
					keyExtractor={(item, index) => item.questionNumber}
					initialScrollIndex={data.length - 1}
					showsHorizontalScrollIndicator={false}
					data={data}
					extraData={this.props.game.chosenQuestionArr}
					renderItem={({ item }) => this.renderCard(item)}
				/>
			)
		} else {
				return (
					<ActivityIndicator
						style={{ flex: 1 }}
						animating={true}
						color='#F7931E'
						size="large"
					/>
				)
		}
	}

	render() {
		const { uid } = this.props.user
		const { photo, opponentPhoto } = this.props.dash.info;
		const { container, header, badge } = styles;
		return (
			<ImageBackground
				source={require("../static/background.png")}
				style={container}
			>
				{this.props.game.gameKey ? <FullHeader/> : <SimpleHeader/>}
				{this._renderSpinner(this.props.game.chosenQuestionArr)}
				<View style={{ margin: 10 }}>
					{this.props.game.gameKey && this.renderQuestionButton()}
				</View>
				{this.props.game.gameKey && <Chat />}
			</ImageBackground>
		)
	}
}

const { width } = Dimensions.get('window');
const styles = {
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-end",
		backgroundColor: colors.lightgrey
	},
  //header
	header: {
		width,
		flexDirection: "row",
		padding: 20,
		paddingBottom: 10,
		alignItems: "center",
		justifyContent: "space-between"
	},
	badge: {
		width: 100,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: colors.lightgrey,
		borderRadius: 20
	},
  //card
	card: {
		flex: 1,
		width: width - 40,
		margin: 20,
		backgroundColor: "#FFF",
		padding: 20,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { height: 3, width: 0 },
		shadowOpacity: 0.2
	},
	question: {
		marginBottom: 10,
		flex: 2,
		alignItems: "center"
	},
	user: {
		marginBottom: 10,
		justifyContent: "center"
	},
	options: {
		flex: 4,
		alignItems: "center"
	},
	option: {
		width: 250,
		margin: 10,
		backgroundColor: colors.lightgrey,
		borderRadius: 25
	},
  // lower card
  chooseCard: {
    height: 50,
    backgroundColor: "#0D658D",
    flexDirection: "row",
    margin: 30,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 10,
    justifyContent: "space-around",
    alignItems: "center"
  },
  choose_button: {
    margin: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    backgroundColor: "#0099FF"
  }
};

const mapStateToProps = state => {
	const arr = []
	_.forEach(state.game.lastFive, item => {
		arr.push(item)
	})
	return { 
		game: state.game, 
		phone: state.phone, 
		player: state.player, 
		lastFive: arr, 
		user: state.login.user,
		dash: state.dash
	}
}

export default connect(mapStateToProps, actions)(Question);