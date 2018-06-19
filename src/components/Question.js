import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView,
	Dimensions, 
	Share,
	ActivityIndicator,
	ImageBackground
} from 'react-native';
import { Button, Badge, Icon } from "react-native-elements";
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
import Chat from './Chat';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';

class Question extends Component {

	select = (num, questionNumber) => {
		const { selectedPlayer } = this.props.player
		const { gameKey, opponent } = this.props.game
		const { username, photo, phone } = this.props.dash.info
		if (gameKey) {
			this.props.saveAnswer(num, questionNumber, opponent, gameKey, username)
		}
		else {
			var url = 'http://amigoo.com'
			var body = `I asked you a question on AmigoO. Download the app and answer it!${url}`
			Share.share({
				message: body,
				title: 'AmigoO'
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
		return <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={["#DBDBDB", "rgba(255,255,255,.2)"]} style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.question}>
            <Text style={{ fontSize: 30 }}>{item.content}</Text>
          </View>
          <View style={styles.user}>
            <Badge value={"Your answer is..."} textStyle={{ color: "#FFF", fontSize: 20 }} containerStyle={{ backgroundColor: "#F15A24" }} />
          </View>
          <View style={styles.options}>
            <Button title={item.choices.option1} textStyle={{ color: '#555', fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(1, item.questionNumber);
              }} />
            <Button title={item.choices.option2} textStyle={{ color: '#555', fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(2, item.questionNumber);
              }} />
            <Button title={item.choices.option3} textStyle={{ color: '#555', fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(3, item.questionNumber);
              }} />
            <Button title={item.choices.option4} textStyle={{ color: '#555', fontSize: 20 }} buttonStyle={styles.option} onPress={() => {
                this.select(4, item.questionNumber);
              }} />
          </View>
        </ScrollView>
      </LinearGradient>;
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
		const { score, opponent } = this.props.game
		const { uid } = this.props.user
		return (
			<ImageBackground
				source={require("../static/background.png")}
				style={{ flex: 1 }}
			>
				<View style={styles.counter}>
					<Badge
						value={score ? score[uid] : 0}
						textStyle={{ color: '#F7E7B4' }}
						containerStyle={styles.badge}
					/>
					<Icon
						name="home"
						type="material-community"
						color="#FFC300"
						underlayColor="transparent"
						size={40}
						onPress={() => Actions.popTo("dashboard")}
					/>
					<Badge
						value={score ? score[opponent] : 0}
						textStyle={{ color: '#F7E7B4' }}
						containerStyle={styles.badge}
					/>
				</View>
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
const styles = StyleSheet.create({
  //header
  counter: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: -10,
    backgroundColor: "#FFF",
    flexDirection: "row"
  },
  badge: {
    padding: 10
  },
  //card
  card: {
    flex: 1,
    width: width * 0.9,
    margin: width * 0.05,
    marginBottom: 0,
    padding: 20,
    borderRadius: 20
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
		marginTop: 10,
    flex: 4,
    alignItems: "center"
  },
  option: {
    width: 250,
    height: 50,
		margin: 10,
    borderRadius: 50,
		backgroundColor: '#DBDBDB'
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
});

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