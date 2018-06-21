// ABSOLUTE
import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
// RELATIVE
import colors from '../styles/colors';
import * as actions from '../actions';

class Register extends Component {
		state = { 
			keyboard: false,
			error: '',
			email: '', 
			password: '',
			username: ''
		}

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ keyboard: true }));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboard: false }));
		// AsyncStorage.removeItem('fbToken');
		// this.props.fbLogin();
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	handleRegistration = () => {
		const { email, password, username } = this.state;
		this.setState({ error: null });
		username && password && email ? this.props.userRegister(email, password, username) : this.setState(
			{ error: "All fields must be filled out." }
		);
		Keyboard.dismiss;
	}

	renderError = () => {
		if(this.props.login.error){ return <Text
				style={{ color: 'tomato', alignSelf: 'center', marginTop: 10 }}
			>{this.props.login.error}</Text>
		}
	}

	renderStateError = () => {
		if(this.state.error){ return <Text
				style={{ color: 'tomato', alignSelf: 'center', marginTop: 10 }}
		>{this.state.error}</Text>}
	}

	render() {
		return (
			<View style={[styles.card, this.state.keyboard ? { marginTop: height * 0.1 } : { marginTop: height * 0.4 }]}>
				<Text style={{fontSize: 24, color: colors.darkred, fontWeight: '400'}}>REGISTER</Text>
				<View style={{ flexDirection: 'column' }}>
					<TextInput
						style={styles.input}
						placeholderTextColor={colors.darkred}
						placeholder='Email'
						underlineColorAndroid='transparent'
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='next'
						value={this.state.email}
						onSubmitEditing={event => this.refs.SecondInput.focus()}
						onChangeText={text => this.setState({ email: text, error: '' })}
					/>
					<TextInput
						style={styles.input}
						ref='SecondInput'
						placeholderTextColor={colors.darkred}
						placeholder='Password'
						underlineColorAndroid='transparent'
						secureTextEntry={true}
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='done'
						value={this.state.password}
						onSubmitEditing={() => this.refs.ThirdInput.focus()}
						onChangeText={text => this.setState({ password: text, error: '' })}
					/>
					<TextInput
						style={styles.input}
						ref='ThirdInput'
						placeholderTextColor={colors.darkred}
						placeholder='Username'
						underlineColorAndroid='transparent'
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='done'
						value={this.state.username}
						onChangeText={text => this.setState({ username: text, error: '' })}
					/>
				</View>
				{this.renderStateError()}
				{this.renderError()}
				<LinearGradient
					start={{ x: 0.0, y: 0.5 }}
					end={{ x: 1.0, y: 0.5 }}
					colors={[colors.darkred, colors.red]}
					style={styles.button}
				>
					<Button
						buttonStyle={{ backgroundColor: 'transparent' }}
						onPress={() => this.handleRegistration()}
						title='REGISTER'
					/>
				</LinearGradient>
				<Button
					title='friendO already?'
					backgroundColor='transparent'
					textStyle={{ color: '#F7931E' }}
					buttonStyle={{ marginBottom: 20 }}
					onPress={() => {
						// this.props.resetError()
						Actions.pop()
					}}
				/>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	card: {
		width: (width * .8),
		marginLeft: (width * .1),
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
}

const mapStateToProps = state => {
	return { login: state.login };
};

export default connect(mapStateToProps, actions)(Register);
