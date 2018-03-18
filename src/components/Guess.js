import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ScrollView,
	FlatList,
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

class Guess extends Component {

	renderColor = (userAnswer, opponentAnswer, option) => {
		if (userAnswer === opponentAnswer) {
			if (option === userAnswer) { return 'mediumseagreen' }
			else if (option === opponentAnswer) { return 'mediumseagreen' }
			else { return '#0099FF' }
		} else {
			if (option === userAnswer) { return 'tomato' }
			else if (option === opponentAnswer) { return 'mediumseagreen' }
			else { return '#0099FF' }
		}
	}

	select = (num, questionKey, opponentAnswer, item, uid) => {
		const { gameKey, opponent, score } = this.props.game
		const { selectedPlayer } = this.props.player
		const { phone } = this.props.dash.info
		const newScore = score ? score[uid] : 0
		this.props.checkAnswers(num, questionKey, gameKey, opponent, opponentAnswer, item, newScore, selectedPlayer, phone)
		this.props.changeStatus('guessResult', uid, gameKey)
	}

	renderCard = (item, index, length) => {
		const { opponent } = this.props.game
		const { uid } = this.props.user
		const isLast = (index !== length - 1) ? true : false;
		var who
		if (length % 2 === 0) {
			who = index % 2 === 0 ? ['your opponent', 'your'] : ['you', 'your opponent\'s'];
		} else {
			who = index % 2 === 1 ? ['your opponent', 'your'] : ['you', 'your opponent\'s'];
		}

		return (
			<ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
				<View style={styles.question}>
					<Text style={{ fontSize: 30 }}>{item.value.content}</Text>
				</View>
				{ index === length - 1 ? (
				<View style={styles.user}>
					<Badge
						value={'your opponent\'s answer was..'}
						textStyle={{ color: '#FFF', fontSize: 20 }}
						containerStyle={{ backgroundColor: '#F5D86B' }}
					/>
				</View>) : (
				<View style={styles.user}>
					<Badge
						value={item.value[uid] == item.value[opponent] ? `${who[0]} guessed right!` : `${who[0]} guessed wrong!`}
						textStyle={{ color: item.value[uid] == item.value[opponent] ? 'mediumseagreen' : 'tomato', fontSize: 20 }}
						containerStyle={{ backgroundColor: 'transparent' }}
					/>
					<Badge
						value={who[1] + ' answer was..'}
						textStyle={{ color: '#FFF', fontSize: 20 }}
						containerStyle={{ backgroundColor: '#F5D86B' }}
					/>
				</View>)}
				<View style={styles.options}>
					<Button
						title={item.value.choices.option1}
						buttonStyle={[styles.option, isLast ? { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], 'option1') } : null]}
						onPress={() => { isLast ? null : this.select(1, item.key, item.value[opponent], item, uid) }}
					/>
					<Button
						title={item.value.choices.option2}
						buttonStyle={[styles.option, isLast ? { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], 'option2') } : null]}
						onPress={() => { isLast ? null : this.select(2, item.key, item.value[opponent], item, uid) }}
					/>
					<Button
						title={item.value.choices.option3}
						buttonStyle={[styles.option, isLast ? { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], 'option3') } : null]}
						onPress={() => { isLast ? null : this.select(3, item.key, item.value[opponent], item, uid) }}
					/>
					<Button
						title={item.value.choices.option4}
						buttonStyle={[styles.option, isLast ? { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], 'option4') } : null]}
						onPress={() => { isLast ? null : this.select(4, item.key, item.value[opponent], item, uid) }}
					// onPress={() => {
					// 	this.setState({ chatHeight: this.state.chatHeight === 50 ? 100 : 50, chooseCardVisible: !this.state.chooseCardVisible })
					// }}
					/>
				</View>
			</ScrollView>
		)
	}

	render() {
		const data = this.props.lastFive;
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
				<FlatList
					horizontal
					pagingEnabled={true}
					getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
					keyExtractor={(item, index) => item.key}
					initialScrollIndex={data.length - 1}
					showsHorizontalScrollIndicator={false}
					data={data}
					renderItem={({ item, index }) => this.renderCard(item, index, data.length)}
				/>
				<Chat />
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
	_.forIn(state.game.lastFive, (value, key) => {
		arr.push({ key, value })
	})
	return { 
		lastFive: arr, 
		game: state.game, 
		user: state.login.user, 
		player: state.player, 
		dash: state.dash 
	};
};

export default connect(mapStateToProps, actions)(Guess);
