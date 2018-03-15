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
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import firebase from 'firebase';
import _ from 'lodash';
import IconBadge from 'react-native-icon-badge';

import * as actions from '../actions';

class Category extends Component {

	state = {
		names: {
			r: 'random',
			a: 'me in 10 years',
			b: 'TV',
			c: 'Dirty',
			d: 'Dating',
			e: 'my personality'
		},
		openCategories: []
	}

	_checkUsedQuestion = (identification, gameKey) => {
		var id = identification;
		var arr = this.props.categories
		var newArr = []
		arr.map(el => {
			if (el.value <= this.props.points){
				newArr.push(el.key)
			}
		})
		if (id === 'r') {
			var randNum = Math.floor(Math.random() * newArr.length);
			id = newArr[randNum]
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

	renderItem = (item) => {
		const { gameKey } = this.props.game;
		const { categories } = this.props
		const diff = item.value - this.props.points
		
		if (item.value > this.props.points) {
			return (
				<IconBadge
					MainElement={
						<Button
							title={this.state.names[item.key]}
							buttonStyle={styles.option}
							onPress={() => alert(`Invite ${diff} more friends to unlock this category`)}
						/>
					}
					BadgeElement={
						<Icon
							name='lock'
							size={20}
							color='black'
						/>
					}
					IconBadgeStyle={
						{
							right: 5,
							top: -10,
							width: 30,
							height: 30,
							borderRadius: 50,
							backgroundColor: 'white'
						}
					}
				/>
			)
		} else {
			return (
				<Button
				title={this.state.names[item.key]}
				buttonStyle={styles.option}
				onPress={() => { this._checkUsedQuestion(item.key, gameKey)}}
				/>
			)
		}	
	}

	render() {
		const { gameKey } = this.props.game
		const arr = this.props.categories
		return (
			<View style={styles.container}>
				<ScrollView
					style={styles.card}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<Text style={{ fontSize: 20 }}>Categories</Text>
					</View>
					<Button
						title={'Random'}
						buttonStyle={styles.option}
						onPress={() => { this._checkUsedQuestion('r', gameKey) }}
					/>
					<FlatList
						contentContainerStyle={styles.list}
						keyExtractor={(item, index) => item.key}
						data={arr}
						renderItem={({ item }) => this.renderItem(item)}
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
		marginBottom: 20
	},
	// footer - chat
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
	const arr = []
	var points = null
	_.forIn(state.categories.categories, (value, key) => {
		if(key === 'points'){
			points = value
		} else {
			arr.push({ key, value })
		}
	})
	return {
		game: state.game,
		player: state.player,
		user: state.login.user,
		categories: arr,
		points
	}
}

export default connect(mapStateToProps, actions)(Category)
