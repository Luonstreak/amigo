import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView,
	TextInput,
	Dimensions
} from 'react-native';
import { Button, Badge } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Chat from './Chat';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from 'firebase';

import * as actions from '../actions';

class AskBack extends Component {

	select = (num, questionNumber) => {
		const { gameKey, opponent } = this.props.game
		this.props.saveAnswer(num, questionNumber, opponent, gameKey)
	}

	renderCard = () => {
		const { content, choices, questionNumber } = this.props.prevQ.value
		return (
			<ScrollView
				style={styles.card}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.question}>
					<Text style={{ fontSize: 30 }}>{content}</Text>
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
						title={choices.option1}
						buttonStyle={styles.option}
						onPress={() => { this.select(1, questionNumber) }}
					/>
					<Button
						title={choices.option2}
						buttonStyle={styles.option}
						onPress={() => { this.select(2, questionNumber) }}
					/>
					<Button
						title={choices.option3}
						buttonStyle={styles.option}
						onPress={() => { this.select(3, questionNumber) }}
					/>
					<Button
						title={choices.option4}
						buttonStyle={styles.option}
						onPress={() => { this.select(4, questionNumber) }}
					/>
				</View>
			</ScrollView>
		)
	}

	render() {
		const { score, opponent } = this.props.game
		const { uid } = this.props.user
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
				{this.renderCard()}
				<Chat style={styles.chat} />
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
		marginBottom: height * .25,
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
	//footer - chat
	chat: {
		marginTop: 10,
		backgroundColor: '#ADD8E6',
	}
});

const mapStateToProps = state => {
	const arr = []
	_.forEach(state.game.lastFive, item => {
		arr.push(item)
	})
	return {
		game: state.game,
		lastFive: arr,
		user: state.login.user
	}
}

export default connect(mapStateToProps, actions)(AskBack);
