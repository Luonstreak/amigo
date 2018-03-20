import React, { Component } from 'react';
import {
	View,
	TextInput,
	Text,
	ScrollView,
	FlatList,
	Keyboard,
	Dimensions,
	DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import _ from 'lodash';
import { LinearGradient } from 'expo';
import * as actions from '../actions';

class Chat extends Component {
	state = {
		tall: height * .2,
		space: width * .025,
		input: '',
		messages: []
	};
	

	componentDidMount() {
		const { gameKey } = this.props.game
		const ref = firebase.database().ref(`chat/${gameKey}`).on('value', snapshot => {
			const arr = []
			_.forEach(snapshot.val(), item => {
				item['id'] = Math.floor(Math.random() * 1000000)
				arr.unshift(item)
			})
			this.setState({ messages: arr })
		})
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove()
		this.keyboardDidHideListener.remove()
	}

	_keyboardDidShow = (e) => {
		this.setState({
			tall: height * .4,
			space: e.endCoordinates.height + 10
		})
	}

	_keyboardDidHide = (e) => {
		this.setState({
			tall: height * .2,
			space: width * .025
		})
	}
	
	_updateInput = (msg) => {
		this.setState({ input: msg })
	}

	_sendMessage = (username) => {
		const { uid } = this.props.login.user
		const { gameKey, opponent } = this.props.game
		const msg = this.state.input
		if (msg.length > 1) {
			const tokenRef = firebase.database().ref(`users/${opponent}/token`);
			tokenRef.once('value', async snap => {
				var token = snap.val();
				if (token) {
					var message = `${username} said: "${msg}"`
					await firebase.database().ref('chatPush').push({
						from: uid,
						expoToken: token,
						body: message
					})
				}
			})
			firebase.database().ref(`chat/${gameKey}`).push({ username, msg })
			this.setState({ input: '' })
		}
	}

	_messageStyle = (opp, usr) => {
		if (opp === usr) {
			return ({
				backgroundColor: 'bisque',
				borderBottomRightRadius: 0
			})
		} else {
			return ({
				backgroundColor: 'aquamarine',
				borderBottomLeftRadius: 0,
			})
		}
	}
	
	render() {
		const { username } = this.props.dash.info
		const { container, list, input, title, content } = styles;
		return (
			<View style={[container, { bottom: this.state.space, height: this.state.tall }]}>
				<FlatList
					contentContainerStyle={list}
					inverted
					data={this.state.messages}
					keyExtractor={(item, index) => item.id}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						return (
							<View
								style={{
									alignItems: item.username === username ? 'flex-end' : 'flex-start'
								}}
							>
								<View
									style={[{
										backgroundColor: item.username === username ? 'bisque' : 'aquamarine',
										padding: 2.5,
										paddingLeft: 10,
										paddingRight: 10,
										margin: 2.5,
										borderRadius: 10,
									}, this._messageStyle(item.username, username)]}
								>
									<Text style={{ color: 'gray' }}>{item.msg}</Text>
								</View>
							</View>
						)
					}}
				/>
				<View style={[list, { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }]}>
					<Text>{this.props.opponent}</Text>
					<Text>You</Text>
				</View>
				<TextInput
					style={input}
					value={this.state.input}
					underlineColorAndroid='transparent'
					autoCapitalize='none'
					autoCorrect={false}
					onChangeText={this._updateInput}
					onSubmitEditing={this._sendMessage(username)}
					placeholder="say hi to your peeps..."
				/>
			</View>
		);
	}
}
const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		position: 'absolute',
		left: width * .05,
		paddingTop: 10,
		backgroundColor: '#83D0CD',
		borderRadius: 20,
		justifyContent: 'flex-end',
		width: width * .9
	},
	list: {
		marginTop: 5,
		marginLeft: width * 0.05,
		marginRight: width * 0.05
	},
	input: {
		height: 40,
		padding: 5,
		paddingLeft: 20,
		width: width * 0.85,
		margin: width * 0.025,
		marginTop: 5,
		color: '#1D8FE1',
		backgroundColor: '#FFF',
		fontSize: 15,
		borderRadius: 20
	},
	content: {
		color: '#666'
	}
}

const mapStateToProps = state => {
	return { login: state.login, dash: state.dash, game: state.game };
}
export default connect(mapStateToProps, actions)(Chat);
