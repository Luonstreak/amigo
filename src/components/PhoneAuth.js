import React, { Component } from 'react';
import { TextInput, View } from 'react-native';
import { LinearGradient } from "expo";
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

// RELATIVE
import * as actions from '../actions';

class PhoneAuth extends Component {
	
	onPhoneInput(number) {
		this.props.phoneInput(number);
	}
	
	submitPhone = () => {
		const { phoneNumber } = this.props.phone
		const phone = String(phoneNumber).replace(/[^\d]/g, '');
		this.props.userFetch()
		this.props.phoneSave(phone)
	}

	render() {
		return (
			<View>
				<View style={{ marginTop: 20, marginLeft: '10%' }}>
					<TextInput
							style={styles.input}
							placeholder='Enter your phone number'
							keyboardType='numeric'
							underlineColorAndroid='transparent'
							autoCapitalize='none'
							autoCorrect={false}
							returnKeyType='next'
							value={this.props.phone.phoneNumber}
							onChangeText={this.onPhoneInput.bind(this)}
							onSubmitEditing={event => this.refs.SecondInput.focus()}
						/>
					<LinearGradient
						start={{ x: 0.0, y: 0.5 }}
						end={{ x: 1.0, y: 0.5 }}
						colors={['#00c6fb', '#005bea']}
						style={styles.button}
					>
						<Button
							title='SAVE'
							backgroundColor='transparent'
							onPress={() => this.submitPhone()}
						/>
					</LinearGradient>
				</View>
			</View>
		);
	}
}

const styles = {
  input: {
    color: "rgb(0,91,234)",
    backgroundColor: "rgba(0,198,251,0.1)",
    fontSize: 15,
    padding: 15,
    paddingLeft: 30,
    width: "90%",
    marginTop: 20,
    borderRadius: 50
  },
  button: {
		marginTop: 20,
		borderRadius: 50,
    width: "90%"
  }
};

const mapStateToProps = state => {
	return { phone: state.phone };
};

export default connect(mapStateToProps, actions)(PhoneAuth);
