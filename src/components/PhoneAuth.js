import React, { Component } from 'react';
import { Text, TextInput, View, Dimensions } from "react-native";
import { LinearGradient } from "expo";
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import colors from "../styles/colors";
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
			<View style={styles.card}>
				<Text style={{
					fontSize: 24, color: colors.darkred, fontWeight: '400'
				}}>PHONE VERIFICATION</Text>
				<TextInput
						style={styles.input}
						placeholder='Enter your phone number'
						placeholderTextColor={colors.darkred}
						keyboardType='numeric'
						underlineColorAndroid={colors.transparent}
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='next'
						value={this.props.phone.phoneNumber}
						onChangeText={this.onPhoneInput.bind(this)}
						onSubmitEditing={() => this.refs.SecondInput.focus()}
					/>
				<LinearGradient
					start={{ x: 0.0, y: 0.5 }}
					end={{ x: 1.0, y: 0.5 }}
					colors={[colors.darkred, colors.lightred]}
					style={styles.button}
				>
					<Button
						title='SAVE'
						backgroundColor={colors.transparent}
						onPress={() => this.submitPhone()}
					/>
				</LinearGradient>
			</View>
		);
	}
}

const { height, width } = Dimensions.get("window");
const styles = {
	card: {
		width: width * 0.8,
		marginLeft: width * 0.1,
		alignItems: 'center'
	},
	input: {
		width: width * .8,
		color: colors.darkred,
		backgroundColor: colors.lightyellow,
		fontSize: 15,
		paddingHorizontal: 25,
		paddingVertical: 15,
		marginVertical: 10,
		borderRadius: 50
	},
	button: {
		width: width * .8,
		marginVertical: 10,
		borderRadius: 50
	}
};

const mapStateToProps = state => {
	return { phone: state.phone };
};

export default connect(mapStateToProps, actions)(PhoneAuth);
