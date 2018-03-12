import React, { Component } from 'react';
import {
	View,
	TextInput,
	Text,
	FlatList,
	Keyboard,
	Dimensions,
	DeviceEventEmitter 
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import _ from 'lodash';
import * as actions from '../actions';

class ChatModal extends Component {
	state = {
		input: '',
		messages: []
	};
	

	componentDidMount() {
		const { auxKey } = this.props;
		const ref = firebase.database().ref(`chat/${auxKey}`).on('value', snapshot => {
			const arr = []
			_.forEach(snapshot.val(), item => {
				item['id'] = Math.floor(Math.random() * 1000000)
				arr.unshift(item)
			})
			this.setState({ messages: arr })
		})
	}
	
	_updateInput = (msg) => {
		this.setState({ input: msg })
	}

	_sendMessage = () => {
		const { username } = this.props.username
		const { auxKey } = this.props
		const msg = this.state.input
		if (msg.length > 1) {
			firebase.database().ref(`chat/${auxKey}`).push({ username, msg })
			this.setState({ input: '' })
		}
	}

	_collapseChat = () => {
		this.props.visibleChat(false)
	}

	render() {
		const { username } = this.props.username
		const { container, list, input, title, content } = styles;
		return (
			<View>
				<View style={{
					alignItems: 'flex-end',
					marginRight: width * .02,
				}}>
					<Icon
						name='close-circle'
						type='material-community'
						color='dodgerblue'
						underlayColor='transparent'
						size={32}
						onPress={() => this._collapseChat()}
					/>
				</View>
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
	list: {
		marginLeft: width * 0.05,
		alignItems: 'flex-start',
	},
	input: {
		height: 40,
		padding: 5,
		paddingLeft: 20,
		width: width * 0.8,
		margin: width * 0.05,
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
	return { username: state.username, chat: state.chat };
}
export default connect(mapStateToProps, actions)(ChatModal);
