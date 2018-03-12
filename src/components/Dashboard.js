import React, { Component } from 'react';
import { 
	Dimensions,
	Text,
	View,
	ScrollView,
	FlatList,
	RefreshControl
 } from 'react-native';
import { Notifications } from 'expo';
import { connect } from 'react-redux';
import { Avatar, Button, Card, List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import _ from 'lodash';

import * as actions from '../actions';
import registerForNotifications from '../../services/push_notifications'

class Dashboard extends Component {

	state = {
		refreshing: false
	}

	componentWillMount() {
		this.props.fetchPlayers()
		this.props.usernameFetch()
		this.props.gameFetch()
		this.props.resetGameKey()
		registerForNotifications();
	}

	_onRefresh = () => {
		this.setState({ refreshing: true });
		setTimeout(() => {
			this.props.gameFetch()
			this.setState({ refreshing: false })
		}, 500);
	}

	componentDidMount() {
	}
	
	
	_renderGame = (game, status, opponent) => {
		this.props.fetchScore(game)
		this.props.renderCard(game, status, opponent)
		this.props.fetchChosenQuestions(game)
	}
	_addNudge = (opponent, key) => {
		console.log(opponent)
		const { uid } = this.props.login.user
		const { username } = this.props.username

		const ref = firebase.database().ref(`nudges/${key}/${uid}`);
		ref.once('value', snap => {
			var count = snap.val();
			if (count === 0 ) {
				alert('Sorry, you have no more nudges left for this game.')
			}
			else {
				const tokenRef = firebase.database().ref(`users/${opponent}/token`);
				tokenRef.once('value', async snap => {
					var token  = snap.val();
					if (token) {
						alert(`You have ${count - 1} nudge(s) left for this game.`)
						var message = `${username} nudged you! Play them back!`
						await firebase.database().ref('nudge').push({
							from: uid,
							expoToken: token,
							body: message
						})
						this.props.decreaseNudgeCount(key, uid, count)
					}
					else {
						alert('Tell your friend to turn on their notifications!')
					}
				})
			}
		})
	}

	render() {
		const { currentUser } = firebase.auth();
		const { headerStyle, bodyStyle, titleStyle, listStyle } = styles;
		const list1 = []
		const list2 = []
		const list3 = []
		var list = _.forIn(this.props.login.games, (value, key) => {
			value['gameKey'] = key;
			if (value.status === 'pending') {
				list3.push(value)
			} else if (value.status === 'waiting') {
				list2.push(value)
			} else { list1.push(value) }
		})
		return (
			<View style={{ flex: 1, marginTop: 20 }}>
				<View style={headerStyle}>
					<Button
						rounded
						backgroundColor={'#FFC300'}
						title={'INVITE FRIENDS'}
						buttonStyle={{ padding: 5 }}
						onPress={() => Actions.playerList()}
					/>
					<Avatar
						rounded
						medium
						avatarStyle={{ borderWidth: 1, borderColor: '#FFC300' }}
						// source={{ uri: !currentUser.photoURL ? null :currentUser.photoURL }}
					/>
				</View>
				<ScrollView
					style={bodyStyle}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh}
							tintColor={'#FFC300'}
						/>
					}>
					{/* YOUR TURN */}
					<Text style={[titleStyle, { backgroundColor: '#FFC300' }]}>Your Turn</Text>
					<List containerStyle={listStyle}>
						{list1.map((l, i) => (
							<ListItem
								roundAvatar
								hideChevron
								avatar={{ uri: l.avatar_url }}
								key={i}
								title={l.player1 !== currentUser.uid ? l.player1 : l.player2}
								titleStyle={{ marginLeft: 20, color: '#FFC300'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
								badge={{ element: 
									<Button 
										rounded
										backgroundColor={'#FFC300'}
										title={'PLAY'}
										buttonStyle={{ padding: 5 }}
										onPress={() => this._renderGame(l.gameKey, l.status, l.player1 !== currentUser.uid ? l.player1 : l.player2)}
									/>
								}}
								/>
							))}
					</List>
					{/* MY TURN */}
					<Text style={[titleStyle, { backgroundColor: '#FA3C4C' }]}>Their Turn</Text>
					<List containerStyle={listStyle}>
						{list2.map((l, i) => (
							<ListItem
								roundAvatar
								hideChevron
								avatar={{ uri: l.avatar_url }}
								key={i}
								title={l.player1 !== currentUser.uid ? l.player1 : l.player2}
								titleStyle={{ marginLeft: 20, color: '#FA3C4C'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
								badge={{
									element:
										<Button
											rounded
											backgroundColor={'#FA3C4C'}
											title={'NUDGE'}
											buttonStyle={{ padding: 5 }}
											onPress={() => this._addNudge(l.player1 !== currentUser.uid ? l.player1 : l.player2, l.gameKey)}
										/>
								}}
							/>
						))}
					</List>
					{/* PENDING */}
					<Text style={[titleStyle, { backgroundColor: '#44BEC7' }]}>Pending</Text>
					<List containerStyle={listStyle}>
						{list3.map((l, i) => (
							<ListItem
								roundAvatar
								hideChevron
								avatar={{ uri: l.avatar_url }}
								key={i}
								title={l.player1 !== currentUser.uid ? l.player1 : l.player2}
								titleStyle={{ marginLeft: 20, color: '#44BEC7'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
							/>
						))}
					</List>
					

				</ScrollView>
			</View>
		);
	}
}

const styles = {
	//header
	headerStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		paddingLeft: 0
	},
	//body
	titleStyle: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#FFF',
		padding: 2.5
	},
	listStyle: {
		marginTop: 0,
		marginLeft: 0,
		marginRight: 0,
		borderTopWidth: 0

	}
}

const mapStateToProps = state => {
	const arr = _.map(state.player.players)
	return { login: state.login, username: state.username, players: arr }
}

export default connect(mapStateToProps, actions)(Dashboard);
