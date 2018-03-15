import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements';
import { connect } from 'react-redux';

// RELATIVE
import * as actions from '../actions';

class Username extends Component {
	constructor(props) {
		super(props)

		this.state = {
			usernameValid: true,
			error_1: '',
			error_2: '',
			codeNotConfirmed: '',
		}
	}

	onUsernameInput(text) {
		this.setState({ error_1: '' });
		this.setState({ error_2: '' });
		const newText = String(text).replace(/\s+/g, '');

		this.props.usernameInput(newText);
	}

	onButtonPress() {
		const { username } = this.props.username
		this.props.usernameSave({ username })
	}

	render() {
		return (
			<View>
				<View>
					<FormLabel>USERNAME</FormLabel>
					<FormInput
						placeholder='Please enter your username with no space'
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='next'
						value={this.props.username}
						onChangeText={this.onUsernameInput.bind(this)}
					/>
					<FormValidationMessage>
						{this.state.error_1}
						{this.state.error_2}
					</FormValidationMessage>
				</View>
				<View style={{ marginTop: 20 }}>
					<Button
						title='SAVE'
						backgroundColor='#03A9F4'
						onPress={this.onButtonPress.bind(this)}
					/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = state => {
	return { username: state.username };
};

export default connect(mapStateToProps, actions)(Username);
