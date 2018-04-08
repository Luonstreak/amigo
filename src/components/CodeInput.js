// ABSOLUTE
import firebase from 'firebase';
import axios from 'axios';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

// RELATIVE
import * as actions from '../actions';

const ROOT_URL = 'https://us-central1-friend-ec2f8.cloudfunctions.net';

class CodeInput extends Component {
	state = {
		code: ''
	};


	onButtonPress = async () => {
		const uid = firebase.auth().currentUser.uid;
		const code = this.state.code;

		try {
			await axios.post(`${ROOT_URL}/verifyCode`, { uid, code });
			// this.props.userFetch()
			Actions.main();
		} catch (error) {
			console.log(error, 'fuckfuckfuck');
		}
	}

	render() {
		return (
			<View>
				<View>
					<FormLabel>Code</FormLabel>
					<FormInput
						placeholder='Code'
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='done'
						value={this.state.code}
						onChangeText={code => this.setState({ code })}
					/>
				</View>
				<View style={{ marginTop: 20 }}>
					<Button
						title='SUBMIT'
						backgroundColor='#03A9F4'
						onPress={this.onButtonPress.bind(this)}
					/>
				</View>
			</View>
		);
	}
}

export default connect(null, actions)(CodeInput);