import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView,
	TextInput,
	Dimensions, 
	Share
} from 'react-native';
import { Button, Badge } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Chat from './Chat';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from 'firebase';

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
			.then(({ action, activityType }) => {
				if (Platform.OS === 'ios') {
					action === Share.dismissedAction ? alert('Come on, send a message to invite your friend.') : this.props.creatingGame(num, questionNumber, selectedPlayer, phone, username, photo)
				}
				else {
					this.props.creatingGame(num, questionNumber, selectedPlayer, phone, username, photo)
				}
			})
			.catch((error) => console.log('failed', error));
		}
	}

	renderQuestionButton = () => {
		const { gameKey, chosenQuestionArr } = this.props.game;
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
		const { score, opponent } = this.props.game
		const { uid } = this.props.user
		return (
			<ScrollView
				style={styles.card}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.question}>
					<Text style={{ fontSize: 30 }}>{item.content}</Text>
				</View>
				<View style={styles.user}>
					<Badge
						value={'Your answer is...'}
						textStyle={{ color: '#FFF', fontSize: 20 }}
						containerStyle={{ backgroundColor: '#F5D86B' }}
					/>
				</View>
				<View style={styles.options}>
					<Button
						title={item.choices.option1}
						buttonStyle={styles.option}
						onPress={() => { this.select(1, item.questionNumber) }}
					/>
					<Button
						title={item.choices.option2}
						buttonStyle={styles.option}
						onPress={() => { this.select(2, item.questionNumber) }}
					/>
					<Button
						title={item.choices.option3}
						buttonStyle={styles.option}
						onPress={() => { this.select(3, item.questionNumber) }}
					/>
					<Button
						title={item.choices.option4}
						buttonStyle={styles.option}
						onPress={() => { this.select(4, item.questionNumber) }}
					/>
				</View>
			</ScrollView>
		)
	}

	render() {
		const { score, opponent } = this.props.game
		const { uid } = this.props.user
		const data = this.props.game.chosenQuestionArr;
		return (
			<View style={styles.container}>
				<View style={styles.counter}>
					<Badge
						value={score ? score[uid] : 0}
						textStyle={{ color: '#F7E7B4' }}
						containerStyle={styles.badge}
					/>
					<Badge
						value={score ? score[opponent] : 0}
						textStyle={{ color: '#F7E7B4' }}
						containerStyle={styles.badge}
					/>
				</View>
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
				<View>
					{this.props.game.gameKey ? this.renderQuestionButton() : null}
				</View>
				{this.props.game.gameKey ? <Chat /> : null}
			</View>
		)
	}
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	//global
	container: {
		flex: 1,
		backgroundColor: '#DFE2E7'
	},
	//header
	counter: {
		height: 50,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#83D0CD',
		flexDirection: 'row'
	},
	badge: {
		padding: 10
	},
	//card
	card: {
		flex: 1,
		width: (width * .90),
		margin: (width * .05),
		backgroundColor: '#0D658D',
		padding: 20,
		borderRadius: 20
	},
	question: {
		marginBottom: 10,
		flex: 2,
		alignItems: 'center'
	},
	user: {
		marginBottom: 10,
		justifyContent: 'center'
	},
	options: {
		flex: 4,
		alignItems: 'center'
	},
	option: {
		backgroundColor: '#0099FF',
		width: 250,
		borderRadius: 10,
		margin: 10
	},
	// lower card
	chooseCard: {
		height: 50,
		backgroundColor: '#0D658D',
		flexDirection: 'row',
		margin: 30,
		marginTop: 0,
		marginBottom: 0,
		borderRadius: 10,
		justifyContent: 'space-around',
		alignItems: 'center'

	},
	choose_button: {
		margin: 10,
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 10,
		backgroundColor: '#0099FF'
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