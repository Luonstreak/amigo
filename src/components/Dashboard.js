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
import { Avatar, Button, Card } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import _ from 'lodash';

import * as actions from '../actions';
import registerForNotifications from '../../services/push_notifications';
import ChatModal from './ChatModal';

class Dashboard extends Component {
	state = {
		refreshing: false,
		auxKey: null
	}

	componentWilllMount() {
		this.props.fetchPlayers()
		this.props.gameFetch()
		this.props.usernameFetch()
		this.props.resetGameKey()
	}

	// SPINNER

	_onRefresh = () => {
		this.setState({ refreshing: true });
		setTimeout(() => {
			this.props.gameFetch()
			this.setState({ refreshing: false })
		}, 500);
	}

	// componentDidMount() {
	// 	registerForNotifications();
	// 	Notifications.addListener((notification) => {
	// 		const { data: { text }, origin } = notification;
	// 		if (origin === 'received' && text) {
	// 			Alert.alert(
	// 				'New Push Notification',
	// 				text,
	// 				[{ text: 'Ok' }]
	// 			)
	// 		}
	// 	})
	// }

	// CHAT

	_getChatInfo = (game) => {
		this.setState({ auxKey: game })
		this.props.visibleChat(true)
	}

	_renderChat = () => {
		if (this.props.chat.chatVisible === 'on'){
			return (
				<View style={styles.containerStyle}>
					<ChatModal auxKey={this.state.auxKey}/>
				</View>
			)
		} else { null }
	}

	// PROFILE

	_getProfile = (game) => {
		this.props.getUser(game)
	}
	
	// GAME

	_renderGame = (game, status, opponent) => {
		this.props.fetchScore(game)
		this.props.renderCard(game, status, opponent)
		this.props.fetchChosenQuestions(game)
	}

	render() {
		const { currentUser } = firebase.auth();
		const { containerStyle, headerStyle, bodyStyle, titleStyle, listStyle, elementStyle } = styles;
		const list1 = []
		const list2 = []
		const list3 = []
		var list = _.forIn(this.props.login.games, (value, key) => {
			value['opponent'] = currentUser.uid === value.player1 ? value.player2 : value.player1;
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
						source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }}
						onPress={() => this._getProfile(currentUser.uid)}
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
					{/* MY TURN */}
					<Text style={[titleStyle, { backgroundColor: '#FFC300' }]}>Your Turn</Text>
					<FlatList
						data={list1}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item }) =>
							<View
								style={elementStyle}
							>
								<Avatar
									rounded
									medium
									source={{ uri: item.avatar_url }}
									containerStyle={{ marginRight: 20 }}
									onPress={() => this._getProfile(item.opponent)}
								/>
								<Text
									style={{ flex: 1, fontSize: 20, color: '#FFC300' }}
									onPress={() => this._getChatInfo(item.gameKey)}
								>{`${item.opponent[0]}${item.opponent[1]}`}</Text>
								<Button
									rounded
									backgroundColor={'#FFC300'}
									title={'PLAY'}
									buttonStyle={{ padding: 5 }}
									onPress={() => this._renderGame(
										item.gameKey,
										item.status,
										item.player1 !== currentUser.uid ? item.player1 : item.player2
									)}
								/>
							</View>
						}
					/>
					{/* THEIR TURN */}
					<Text style={[titleStyle, { backgroundColor: '#FA3C4C' }]}>Their Turn</Text>
					<FlatList
						data={list2}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item }) =>
							<View
								style={elementStyle}
							>
								<Avatar
									rounded
									medium
									source={{ uri: item.avatar_url }}
									containerStyle={{ marginRight: 20 }}
									onPress={() => this._getProfile(item.opponent)}
								/>
								<Text
									style={{ flex: 1, fontSize: 20, color: '#FA3C4C' }}
									onPress={() => this._getChatInfo(item.gameKey)}
								>{`${item.opponent[0]}${item.opponent[1]}`}</Text>
								<Button
									rounded
									backgroundColor={'#FA3C4C'}
									title={'NUDGE'}
									buttonStyle={{ padding: 5, marginRight: -15 }}
									onPress={() => alert('you nudged you friend!')}
								/>
							</View>
						}
					/>
					{/* PENDING */}
					<Text style={[titleStyle, { backgroundColor: '#44BEC7' }]}>Pending</Text>
					<FlatList
						data={list3}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item }) => 
							<View
							style={elementStyle}
							>
								<Avatar
									rounded
									medium
									source={{ uri: item.avatar_url }}
									containerStyle={{ marginRight: 20 }}
								/>
								<Text
									style={{ flex: 1, fontSize: 20, color: '#44BEC7' }}
									onPress={() => this._getProfile(item.opponent)}
								>{`${item.opponent[0]}${item.opponent[1]}`}</Text>
							</View>
						}
					/>
				</ScrollView>
				{this._renderChat()}
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	containerStyle: {
		position: 'absolute',
		top: width * 0.05,
		width: width * .9,
		margin: width * .05,
		marginTop: 0,
		paddingTop: 10,
		justifyContent: 'flex-end',
		backgroundColor: '#83D0CD',
		borderRadius: 20
	},
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
		fontSize: 18,
		textAlign: 'center',
		color: '#FFF',
		padding: 5
	},
	listStyle: {
		marginTop: 0,
		marginLeft: 0,
		marginRight: 0,
		borderTopWidth: 0
	},
	elementStyle: {
		width: width,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderBottomWidth: 1,
		borderBottomColor: 'orange'
	}
}

const mapStateToProps = state => {
	const arr = _.map(state.player.players)
	return {
		login: state.login,
		profile: state.profile,
		chat: state.chat,
		players: arr
	}
}

export default connect(mapStateToProps, actions)(Dashboard);
