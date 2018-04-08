import React, { Component } from 'react';
import { 
	ImageBackground,
	Dimensions,
	Text,
	View,
	ScrollView,
	FlatList,
	RefreshControl,
	ActivityIndicator,
	Share,
	TouchableOpacity,
	TouchableHighLight
 } from 'react-native';
import { Notifications } from 'expo';
import { connect } from 'react-redux';
import { Avatar, Button, Card } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import moment from 'moment';
import MaterialInitials from 'react-native-material-initials/native';
import _ from 'lodash';

import * as actions from '../actions';
import registerForNotifications from '../../services/pushNotifications';
import ChatModal from './ChatModal';

class Dashboard extends Component {
	state = {
		refreshing: false,
		auxKey: null,
		opponent: null,
		contacts: null
	}

	componentDidMount() {
		this._onRefresh()
		this.props.friendsFetch(this.props.dash.info.phone)
		this.props.getCategories()
		this.props.resetGameKey()
		registerForNotifications();
		//Contacts Conditional
		if (this.props.dash.contacts) {
			this.setState({ contacts: this.props.dash.contacts })
		}
		else {
			this.showFirstContactAsync();
		}
		//Notifications Conditional
		Notifications.getBadgeNumberAsync().then(badgeNumber => {
			if (badgeNumber !== 0) {
				Notifications.setBadgeNumberAsync(0);
			}
		})
	}

	async showFirstContactAsync() {
		// Ask for permission to query contacts.
		const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
		const contacts = await Expo.Contacts.getContactsAsync({
			fields: [
				Expo.Contacts.PHONE_NUMBERS
			],
			pageSize: 1000,
			pageOffset: 0,
		});
		if (contacts.total > 0) {
			const sorted = _.sortBy(contacts.data, ['name', 'phoneNumbers'], ['asc']);
			this.setState({ contacts: sorted })
			this.props.saveContacts(sorted)
		}
	}
	
	// SPINNER
	_onRefresh = () => {
		this.setState({ refreshing: true });
		setTimeout(() => {
			this.props.userFetch()
			this.setState({ refreshing: false })
			clearTimeout()
		}, 500);
	}

	_getChatInfo = (game, name) => {
		this.setState({ auxKey: game, opponent: name })
		this.props.visibleChat(true)
	}

	_renderChat = () => {
		if (this.props.dash.chatVisible === 'on'){
			return (
				<View style={styles.containerStyle}>
					<ChatModal auxKey={this.state.auxKey} opponent={this.state.opponent}/>
				</View>
			)
		} else { null }
	}

	// PROFILE

	_getProfile = (item) => {
		this.props.friendsFetch(item.opponentPhone)
		Actions.profile({ item })
	}
	
	// GAME

	_renderGame = async (game, status, setScore, opponent) => {
		const { uid } = this.props.login.user
		const { phone, photo, username } = this.props.dash.info
		if (setScore) {
			await firebase.database().ref(`scores/${game}`).set({
			[uid]: 0,
			[opponent]: 0
			})
			await firebase.database().ref(`nudges/${game}`).update({ [uid]: 5 })
			await firebase.database().ref(`users/${uid}/games/${game}`).update({ setScore: false })
			await firebase.database().ref(`users/${uid}/games/${game}`).update({ player2: uid })
			await firebase.database().ref(`users/${opponent}/games/${game}`).update({ player2: uid })
		}
		else {
			this.props.fetchScore(game)
		}
		this.props.startGame(game, status, opponent, phone, photo, username)
		this.props.fetchChosenQuestions(game)
	}

	_addNudge = (opponent, key) => {
		const { uid } = this.props.login.user
		const { username } = this.props.dash.info

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

	_sendReminder = () => {
		var url = 'http://amigoo.com'
		var body = `Remember, I asked you a question on AmigoO? So, come on download the app and let's play!${url}`
			Share.share({
				message: body,
				title: 'AmigoO'
			}, {
				dialogTitle: 'Remind Your Friend About AmigoO',
				tintColor: 'mediumseagreen'
			})
			.then(({ action, activityType }) => {
				console.log('success', activityType)
			})
			.catch((error) => console.log('failed', error));
	}

	_lastPlayed = (data) => {
		var date = moment('201803191102', 'YYYYMMDDHHmm')
		return date.fromNow()
	}

	render() {
		if (!this.props.dash.info || !this.state.contacts) {
			return (
				<ImageBackground source={require('../static/background.png')} style={styles.backgroundImage}>
					<View style= {[styles.container, styles.horizontal]} >
						<ActivityIndicator
							animating={true}
							color= 'mediumseagreen'
							size="large"
						/>
					</View>
				</ImageBackground>
			);
		}
		const { currentUser } = firebase.auth();
		const { info } = this.props.dash
		const { containerStyle, headerStyle, bodyStyle, titleStyle, listStyle, elementStyle } = styles;
		const list1 = [], list2 = [], list3 = [], blockList = [];
		var list = _.forIn(info.games, (value, key) => {
			value['opponent'] = currentUser.uid === value.player1 ? value.player2 : value.player1;
			value['gameKey'] = key;
			if (value.status === 'pending' && !value.blocked) {
				list3.push(value)
			} else if (value.status === 'waiting' && !value.blocked) {
				list2.push(value)
			} else if (value.blocked) {
				blockList.push(value)
			} else { list1.push(value) }
		})
		return (
			<ImageBackground source={require('../static/background.png')} style={styles.backgroundImage}>
				<View style={headerStyle}>
					<Button
						rounded
						backgroundColor={'#FFC300'}
						title={'INVITE FRIENDS'}
						buttonStyle={{ padding: 5 }}
						onPress={() => Actions.contactList({ contacts: this.state.contacts })}
						/>
					<Avatar
						rounded
						medium
						source={{ uri: info.photo }}
						onPress={() => Actions.profile({ current: true })}
					/>
				</View>
				<ScrollView
					style={bodyStyle}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh}
							tintColor={'#EF4846'}
						/>
					}>
					{/* MY TURN */}
					<Text style={[titleStyle, { backgroundColor: '#F7931E' }]}>Your Turn</Text>
					<FlatList
						data={list1}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item }) => {
							console.log('item',item)
							return (
								<View
									style={elementStyle}
								>
									<Avatar
										rounded
										medium
										source={{ uri: item.opponentPhoto }}
										containerStyle={{ marginRight: 20 }}
										onPress={() => this._getProfile(item)}
									/>
									<TouchableOpacity
										style={{ flex: 1 }}
										onPress={() => this._getChatInfo(item.gameKey, item.opponentName)}
									>
										<Text
											style={{ marginTop: 5, fontSize: 20, color: '#FFC300' }}
										>{item.opponentName}</Text>
										<Text
											style={{ flex: 1, fontSize: 10, color: 'gray' }}
										>{this._lastPlayed(item.opponentLastPlayed)}</Text>
									</TouchableOpacity>
									<Button
										rounded
										backgroundColor={'#FFC300'}
										title={'PLAY'}
										buttonStyle={{ padding: 5 }}
										onPress={() => this._renderGame(
											item.gameKey,
											item.status,
											item.setScore,
											item.player1 !== currentUser.uid ? item.player1 : item.player2
										)}
									/>
								</View>
							)}
						}
					/>
					{/* THEIR TURN */}
					<Text style={[titleStyle, { backgroundColor: '#F15A24' }]}>Their Turn</Text>
					<FlatList
						data={list2}
						containerStyle={listStyle}
						keyExtractor={(item, index) => index}
						renderItem={({ item }) => {
							console.log(item)
							return (
								<View
									style={elementStyle}
								>
									<Avatar
										rounded
										medium
										source={{ uri: item.opponentPhoto }}
										containerStyle={{ marginRight: 20 }}
										onPress={() => this._getProfile(item)}
									/>
									<TouchableOpacity
										style={{ flex: 1 }}
										onPress={() => this._getChatInfo(item.gameKey, item.opponentName)}
									>
										<Text
											style={{ marginTop: 5, fontSize: 20, color: '#FFC300' }}
										>{item.opponentName}</Text>
										<Text
											style={{ flex: 1, fontSize: 10, color: 'gray' }}
										>{this._lastPlayed(item.opponentLastPlayed)}</Text>
									</TouchableOpacity>
									<Button
										rounded
										backgroundColor={'#FA3C4C'}
										title={'NUDGE'}
										buttonStyle={{ padding: 5 }}
										onPress={() => this._addNudge(item.player1 !== currentUser.uid ? item.player1 : item.player2, item.gameKey)}
									/>
								</View>
							)}
						}
					/>
					{/* PENDING */}
					<Text style={[titleStyle, {
						backgroundColor: '#ED1C24',
						shadowColor: '#000000',
						shadowOffset: {height: 5},
						shadowOpacity: .3
						}]}>Pending</Text>
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
									source={{ uri: item.opponentPhoto }}
									containerStyle={{ marginRight: 20 }}
									onPress={() => this._getProfile(item)}
								/>
								<Text
									style={{ flex: 1, fontSize: 20, color: '#44BEC7' }}
								>{item.opponentName}</Text>
								<Button
									rounded
									backgroundColor={'#ED1C24'}
									title={'REMIND'}
									buttonStyle={{ padding: 5 }}
									onPress={() => this._sendReminder(item.opponent, item.gameKey)}
								/>
							</View>
						}
					/>
				</ScrollView>
				{this._renderChat()}
			</ImageBackground>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	},
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
		paddingLeft: 0,
		shadowColor: '#000000',
		shadowOffset: { height: 5 },
		shadowOpacity: .5
	},
	//body
	titleStyle: {
		backgroundColor: '#EB3349',
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		color: '#FFF',
		padding: 10
	},
	listStyle: {
		marginTop: 0,
		marginLeft: 0,
		marginRight: 0,
		borderTopWidth: 0
	},
	elementStyle: {
		backgroundColor: '#FFF',
		width,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20
	},
	backgroundImage: {
		flex: 1,
		paddingTop: 20
	}
}

const mapStateToProps = state => {
	return {
		login: state.login,
		profile: state.profile,
		dash: state.dash,
	}
}

export default connect(mapStateToProps, actions)(Dashboard);
