import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView,
	TextInput
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';

import * as actions from '../actions';

class Category extends Component {
	state = {
		categories: [
			{ id: 'r', category: 'random' },
			{ id: 'a', category: 'me in 10 years' },
			{ id: 'b', category: 'TV' },
			{ id: 'c', category: 'Dirty' },
			{ id: 'd', category: 'Dating' },
			{ id: 'e', category: 'my personality' },
		]
	}

	_keyExtractor = (item, index) => item.id;

	_checkUsedQuestion = (identification, gameKey) => {
		var id = identification;
		if (id === 'r') {
			var arr = ['a', 'b', 'c', 'd', 'e']
			var randNum = Math.floor(Math.random() * arr.length);
			id = arr[randNum]
		}
		const { uid } = this.props.user;
		firebase.database().ref(`questionChoices/${gameKey}`).once('value', snap => {
			if (snap.numChildren() >= 3) {		
				Actions.question({ category: id })
			}
			else {
				firebase.database().ref(`questions/${id}`).once('value', snap => {
					const children = snap.numChildren();
					const num = Math.floor(Math.random() * children) + 1;
					if (gameKey) {
						firebase.database().ref(`usedQuestions/${gameKey}`).once('value', snap => {
							var question = snap.child(`${id}${num}`).exists();
							if (question) {
								return this._checkUsedQuestion(id, gameKey);
							}
							else {
								firebase.database().ref(`questionChoices/${gameKey}`).once('value', snap => {
									var choice = snap.child(`${id}${num}`).exists();
									if (choice) {
										return this._checkUsedQuestion(id, gameKey);
									}
									else {
										// firebase.database().ref(`questionChoices/${gameKey}/${id}${num}`).set(true);
										this.props.fetchQuestion(id, num, gameKey);
									}
								})
							}
						})
					}
					else {
						const { selectedPlayer } = this.props.player
						firebase.database().ref(`questionChoices/${uid}/${selectedPlayer}`).once('value', snap => {
							if (snap.numChildren() >= 3) {
								console.log('more than 3 in undefined')
								Actions.question({ category: id })
							}
							else {
								this.props.fetchQuestion(id, num, null, selectedPlayer);
							}
						})
					}
				})
			}
		})
	}

	renderItem = ({ item }) => {
		const { gameKey } = this.props.game;
		return (
			<Button
				title={item.category}
				buttonStyle={styles.option}
				onPress={() => { this._checkUsedQuestion(item.id, gameKey)}}
			/>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView
					style={styles.card}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<Text style={{ fontSize: 20 }}>Categories</Text>
					</View>
					<FlatList
						contentContainerStyle={styles.list}
						keyExtractor={this._keyExtractor}
						data={this.state.categories}
						renderItem={this.renderItem}
					/>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	//global
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#DFE2E7'
	},
	//card
	card: {
		backgroundColor: '#0D658D',
		margin: 30,
		padding: 20,
		borderRadius: 20
	},
	header: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20
	},
	list: {
		justifyContent: 'center',
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
		height: 100,
		backgroundColor: '#ADD8E6'
	},
	input: {
		backgroundColor: '#96EAD7',
		margin: 10,
		borderRadius: 10,
		padding: 10
	},
});

const mapStateToProps = state => {
	return { game: state.game, player: state.player, user: state.login.user }
}

export default connect(mapStateToProps, actions)(Category)
