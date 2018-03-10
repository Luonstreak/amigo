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
		bottomSpace: 10,
		messages: []
	};
	

	componentDidMount() {
		const ref = firebase.database().ref('chat').on('value', snapshot => {
			const list = snapshot.val();
			const arr = []
			_.forEach(list, item => {
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
			bottomSpace: 10
		})
	}
	
	_updateInput = (msg) => {
		this.setState({ input: msg })
	}

	_sendMessage = () => {
		const username = this.props.username.username
		const msg = this.state.input
		if (msg.length > 1) {
			firebase.database().ref('chat').push({ username, msg })
			this.setState({ input: '' })
		}
	}

	render() {
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
						return <Text><Text style={title}>{item.username}: </Text><Text style={content}>{item.msg}</Text></Text>
					}}
				/>
				{/* <Text style={{ backgroundColor: 'transparent', height: 50 }}></Text> */}
				<TextInput
					style={[input, { bottom: this.state.bottomSpace}]}
					value={this.state.input}
					underlineColorAndroid='transparent'
					autoCapitalize='none'
					autoCorrect={false}
					onChangeText={this._updateInput}
					onSubmitEditing={this._sendMessage}
					placeholder="say hi to your peeps..."
				/>
			</View>
		);
	}
}
const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		justifyContent: 'flex-end',
		margin: width * 0.05
	},
	list: {
		alignItems: 'flex-start',
	},
	input: {
		position: 'absolute',
		left: 10,
		width: Dimensions.get('window').width - 20,
		color: '#1D8FE1',
		backgroundColor: '#FFF',
		fontSize: 15,
		height: 40,
		padding: 5,
		paddingLeft: 20,
		borderRadius: 20
	},
	title: {
		fontWeight: 'bold',
		color: '#22E1FF'
	},
	content: {
		color: '#C4C4C4'
	}
}

const mapStateToProps = state => {
	return { username: state.username };
}
export default connect(mapStateToProps, actions)(Chat);
