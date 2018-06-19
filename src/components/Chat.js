import React, { Component } from 'react';
import {
	View,
	TextInput,
	Text,
	FlatList,
	Keyboard,
	Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import _ from 'lodash';
import { LinearGradient } from 'expo';
import colors from '../styles/colors';
import * as actions from '../actions';

class Chat extends Component {
	state = {
		height: this.props.height || 200,
		bottomSpace: width * .025,
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
		height: e.endCoordinates.height + 60,
		bottomSpace: e.endCoordinates.height + 10
	})
}

_keyboardDidHide = (e) => {
	this.setState({
		height: this.state.height,
		bottomSpace: 0
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
	return (
		<LinearGradient
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
			colors={[colors.darkred, colors.lightred]}
			style={[styles.container, { height: this.state.height }]}
		>
			<FlatList
				inverted
				data={this.state.messages}
				keyExtractor={(item, index) => item.id}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => {
					return (
						<View
							style={{
								alignItems: item.username === username ? 'flex-end' : 'flex-start',
							}}
						>
							<View
								style={{
									paddingVertical: 5,
									paddingHorizontal: 10,
									margin: 2,
									borderRadius: 25,
									backgroundColor: 'rgba(255,255,255,0.25)',
									borderBottomLeftRadius: item.username === username ? 25 : 0,
									borderBottomRightRadius: item.username === username ? 0 : 25,
								}}
							>
								<Text style={{ color: '#FFF', fontSize: 20 }}>{item.msg}</Text>
							</View>
						</View>
					)
				}}
			/>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
				<Text>{this.props.opponent}</Text>
				<Text>You</Text>
			</View>
			<TextInput
				style={[styles.input, { marginBottom: this.state.bottomSpace }]}
				value={this.state.input}
				underlineColorAndroid='transparent'
				autoCapitalize='none'
				autoCorrect={false}
				onChangeText={this._updateInput}
				onSubmitEditing={() => this._sendMessage(username)}
				placeholder="say hi to your peeps..."
			/>
		</LinearGradient>
	)}
}

const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		justifyContent: 'flex-end',
	},
	input: {
		height: 40,
		paddingVertical: 5,
		paddingHorizontal: 20,
		color: '#FFF',
		backgroundColor: 'rgba(255,255,255,0.5)',
		fontSize: 15,
		borderRadius: 25
	}
}

const mapStateToProps = state => {
	return { login: state.login, dash: state.dash, game: state.game };
}
export default connect(mapStateToProps, actions)(Chat);
