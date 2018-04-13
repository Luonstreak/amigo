import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements';
import { connect } from 'react-redux';

// RELATIVE
import * as actions from '../actions';

class PhoneAuth extends Component {
	
	onPhoneInput(number) {
		this.props.phoneInput(number);
	}
	
	onButtonPress = () => {
		const { phoneNumber } = this.props.phone
		const phone = String(phoneNumber).replace(/[^\d]/g, '');
		this.props.userFetch()
		this.props.phoneSave(phone)
	}

	render() {
		return (
			<View>
				<View>
					<FormLabel>Phone Number</FormLabel>
					<FormInput
						placeholder='010-XXXX-XXXX'
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='next'
						value={this.props.phone.phoneNumber}
						onChangeText={this.onPhoneInput.bind(this)}
					/>
				</View>
				<View style={{ marginTop: 20 }}>
					<Button
						title='SAVE'
						backgroundColor='#03A9F4'
						onPress={() => this.onButtonPress()}
					/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = state => {
	return { phone: state.phone };
};

export default connect(mapStateToProps, actions)(PhoneAuth);
