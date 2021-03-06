import React, { Component } from 'react';
import {
	ImageBackground,
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView,
	Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import firebase from 'firebase';
import _ from 'lodash';
import IconBadge from 'react-native-icon-badge';
import { LinearGradient } from 'expo';

import * as actions from '../actions';
import colors from '../styles/colors';

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
			if(el.value <= this.props.points){
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
						firebase.database().ref(`questionChoices/${uid}/${selectedPlayer.phone}`).once('value', snap => {
							if (snap.numChildren() >= 3) {
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

	renderItem = (item, index) => {
		const colors = ['#F15A24', '#FBB03B', '#FCEE21', '#D9E021', '#8CC63F']
		const { gameKey } = this.props.game;
		const { categories } = this.props
		const diff = item.value - this.props.points
		
		if (item.value > this.props.points) {
			return (
				<IconBadge
					MainElement={
						<Button
							title={this.state.names[item.key]}
							buttonStyle={[styles.option, {backgroundColor: colors[index]}]}
							onPress={() => alert(`Invite ${diff} more friends to unlock this category`)}
						/>
					}
					BadgeElement={
						<Icon
							name='lock'
							size={20}
							color='gray'
						/>
					}
					IconBadgeStyle={
						{
							right: 5,
							top: -10,
							width: 30,
							height: 30,
							borderRadius: 50,
							backgroundColor: 'white',
							borderWidth: 1,
							borderColor: colors[index],
						}
					}
				/>
			)
		} else {
			return (
				<Button
				title={this.state.names[item.key]}
				buttonStyle={[styles.option, {backgroundColor: colors[index]}]}
				onPress={() => { this._checkUsedQuestion(item.key, gameKey)}}
				/>
			)
		}	
	}

	render() {
		const { gameKey } = this.props.game
		const arr = this.props.categories
		return (
			<ImageBackground source={require('../static/background.png')} style={styles.container}>
				<LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} colors={[colors.darkred, colors.lightred]} style={styles.header}>
					<Icon name="arrow-left" type="material-community" color={colors.lightgrey} underlayColor={colors.transparent} size={35} onPress={() => Actions.pop()} />
					<Icon name="home" type="material-community" color={colors.lightgrey} underlayColor={colors.transparent} size={35} onPress={() => Actions.popTo("dashboard")} />
					<View style={{ width: 40 }}></View>
				</LinearGradient>
				<View style={styles.title}>
					<Text style={{
						fontSize: 24, color: colors.darkred, fontWeight: 'bold'
					}}>CATEGORIES</Text>
				</View>
				<ScrollView
					style={styles.card}
					showsVerticalScrollIndicator={false}
				>
					<Button
						title={'Random'}
						buttonStyle={[styles.option, { backgroundColor: '#ED1C24' }]}
						onPress={() => { this._checkUsedQuestion('r', gameKey) }}
					/>
					<FlatList
						// contentContainerStyle={styles.list}
						keyExtractor={(item, index) => item.key}
						data={arr}
						renderItem={({ item, index }) => this.renderItem(item, index)}
					/>
				</ScrollView>
			</ImageBackground>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		flex: 1
	},
	title: {
		width,
		paddingVertical: 20,
		alignItems: 'center'
	},
	card: {
		margin: 20,
		padding: 20,
		backgroundColor: colors.transparent
	},
	header: {
		width,
		flexDirection: "row",
		paddingTop: 20,
		paddingBottom: 10,
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "space-between"
	},
	option: {
		shadowColor: colors.black,
		shadowOffset: { height: 2.5 },
		shadowOpacity: .5,
		borderRadius: 5,
		marginBottom: 20
	}
};

const mapStateToProps = state => {
	const arr = []
	var points = null
	_.forIn(state.dash.categories, (value, key) => {
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
