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
import registerForNotifications from '../../services/push_notifications';
import Chat from './Chat';

class Dashboard extends Component {

	state = {
		refreshing: false,
		modal: -(height * 0.5)
	}

	componentWillMount() {
		this.props.fetchPlayers()
		this.props.usernameFetch()
		this.props.gameFetch()
		this.props.resetGameKey()
	}

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
	
	
	_renderGame = (game, status, opponent) => {
		this.props.fetchScore(game)
		this.props.renderCard(game, status, opponent)
		this.props.fetchChosenQuestions(game)
	}

	render() {
		const { currentUser } = firebase.auth();
		const { headerStyle, bodyStyle, titleStyle, listStyle, elementStyle } = styles;
		const myTurnList = []
		const theirTurnList = []
		const pendingList = []
		var list = _.forIn(this.props.login.games, (value, key) => {
			value['gameKey'] = key;
			value['opponent'] = currentUser.uid === value.player1 ? value.player2 : value.player1;
			if (value.status === 'pending') {
				pendingList.push(value)
			} else if (value.status === 'waiting') {
				theirTurnList.push(value)
			} else { myTurnList.push(value) }
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
						data={myTurnList}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item, index }) =>
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
									style={{ flex: 1, fontSize: 20, color: '#FFC300' }}
									onPress={(item) => {
										this.setState({ modal: width * 0.05 })
										setTimeout(() => {
											this.setState({ modal: -(height * 0.5) })
										}, 2000);
									}}
								>{`${item.opponent[0]}${item.opponent[1]}`}</Text>
								<Button
									rounded
									backgroundColor={'#FFC300'}
									title={'PLAY'}
									buttonStyle={{ padding: 5, marginRight: -15 }}
									onPress={() => this._renderGame(item.gameKey, item.status)}
								/>
							</View>
						}
					/>
					{/* THEIR TURN */}
					<Text style={[titleStyle, { backgroundColor: '#FA3C4C' }]}>Their Turn</Text>
					<FlatList
						data={theirTurnList}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item, index }) =>
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
									style={{ flex: 1, fontSize: 20, color: '#FA3C4C' }}
									onPress={() => {
										this.setState({ modal: width * 0.05 })
										setTimeout(() => {
											this.setState({ modal: -(height * 0.5) })
										}, 2000);
									}}
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
						data={pendingList}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item, index }) => 
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
								>{`${item.opponent[0]}${item.opponent[1]}`}</Text>
							</View>
						}
					/>
				</ScrollView>
				<View style={{ position: 'absolute', top: this.state.modal}}>
					<Chat />
				</View>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');
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
	return { login: state.login, players: arr }
}

export default connect(mapStateToProps, actions)(Dashboard);
