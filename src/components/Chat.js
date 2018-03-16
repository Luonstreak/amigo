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
		input: '',
		bottomSpace: width * 0.025,
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
			bottomSpace: e.endCoordinates.height + 10
		})
	}

	_keyboardDidHide = (e) => {
		this.setState({
			bottomSpace: width * 0.025
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
	
	render() {
		const { username } = this.props.dash.info
		const { container, list, input, title, content } = styles;
		return (
			<View style={container}>
				<FlatList
					contentContainerStyle={list}
					inverted
					data={this.state.messages}
					keyExtractor={(item, index) => item.id}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						return (
							<Text>
								<Text 
									style={{
										fontWeight: 'bold',
										color: item.username === username ? '#0099FF' : 'dodgerblue'
									}}
								>{item.username === username ? 'you' : item.username }: </Text>
								<Text style={content}>{item.msg}</Text>
							</Text>
						)
					}}
				/>
				<Text style={{ backgroundColor: 'transparent', height: 60 }}></Text>
				<TextInput
					style={[input, { bottom: this.state.bottomSpace}]}
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
		paddingTop: 10,
		backgroundColor: '#83D0CD',
		borderRadius: 20,
		justifyContent: 'flex-end',
		margin: width * 0.05,
		marginTop: 0,
		maxHeight: height * 0.3,
		width: width * .9
	},
	list: {
		marginLeft: width * 0.05,
		alignItems: 'flex-start',
	},
	input: {
		position: 'absolute',
		left: width * 0.05,
		width: width * 0.8,
		color: '#1D8FE1',
		backgroundColor: '#FFF',
		fontSize: 15,
		height: 40,
		padding: 5,
		paddingLeft: 20,
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
