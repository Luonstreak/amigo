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
		bottomSpace: width * .025
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
	return (
		<View style={[styles.container, { height: this.state.height }]}>
			<FlatList
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
		</View>
	);
}
}
const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		backgroundColor: '#83D0CD',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 10,
		paddingLeft: width * .05,
		paddingRight: width * .05,
		justifyContent: 'flex-end',
	},
	input: {
		height: 40,
		padding: 5,
		paddingLeft: 20,
		marginTop: 5,
		color: '#1D8FE1',
		backgroundColor: '#FFF',
		fontSize: 15,
		borderRadius: 20
	}
}

const mapStateToProps = state => {
	return { login: state.login, dash: state.dash, game: state.game };
}
export default connect(mapStateToProps, actions)(Chat);
