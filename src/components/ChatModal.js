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

	_sendMessage = (username) => {
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
			<View style={{ height: height * .4 }}>
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
							<View
								style={{
									alignItems: item.username === username ? 'flex-end' : 'flex-start'
								}}
							>
								<View
									style={[{
										backgroundColor: item.username === username ? 'bisque' : 'aquamarine' ,
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
					onSubmitEditing={() => this._sendMessage(username)}
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
		marginRight: width * 0.05
	},
	input: {
		height: 40,
		padding: 5,
		paddingLeft: 20,
		width: width * 0.85,
		margin: width * 0.025,
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
	return { dash: state.dash, chat: state.chat };
}
export default connect(mapStateToProps, actions)(ChatModal);
