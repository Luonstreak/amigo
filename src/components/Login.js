// ABSOLUTE
import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions, Keyboard, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
// RELATIVE
import * as actions from '../actions';

class Login extends Component {
	state = { keyboard: false, email: '', password: '' }

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ keyboard: true }));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboard: false }));
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	onButtonPress = () => {
		const { email, password } = this.state;
		this.props.userLogin(email, password);
		this.setState({email: ''})
		this.setState({password: ''})
		Keyboard.dismiss;
	}

	loginwithFacebook = () => {
		this.props.fbLogin();
	}

	renderError = () => {
		if(this.props.login.error) {
			return(
				<Text 
					style={{ color: 'tomato', margin: 10 }}
				>{this.props.login.error}</Text>
			)
		} else { return null }
	}
	

	render() {
		return (
			<View style={[styles.card, this.state.keyboard ? { marginTop: height * 0.1 } : { marginTop: height * 0.4 }]}>
				<View>
					<View>
						<TextInput
							style={styles.input}
							placeholderTextColor='rgba(0,91,234,0.5)'
							placeholder='Email'
							underlineColorAndroid='transparent'
							autoCapitalize='none'
							autoCorrect={false}
							returnKeyType='next'
							value={this.state.email}
							onSubmitEditing={event => this.refs.SecondInput.focus()}
							onChangeText={text => this.setState({ email: text })}
						/>
					</View>
					<View>
						<TextInput
							style={styles.input}
							ref='SecondInput'
							placeholderTextColor='rgba(0,91,234,0.5)'
							placeholder='Password'
							underlineColorAndroid='transparent'
							secureTextEntry={true}
							autoCapitalize='none'
							autoCorrect={false}
							returnKeyType='done'
							value={this.state.password}
							onChangeText={text => this.setState({ password: text })}
						/>
					</View>
				</View>
				{this.renderError()}
				<LinearGradient
					start={{ x: 0.0, y: 0.5 }}
					end={{ x: 1.0, y: 0.5 }}
					colors={['#00c6fb', '#005bea']}
					style={styles.button}
				>
					<Button
						buttonStyle={{ backgroundColor: 'transparent' }}
						onPress={this.onButtonPress}
						title='LOGIN'
					/>
				</LinearGradient>
				<View style={styles.container}>
					{/* <View style={styles.button}> */}
						<Button
							title='Not a friendO yet?'
							backgroundColor='transparent'
							textStyle={{ color: 'dodgerblue' }}
							// buttonStyle={{  }}
							onPress={() => {
								// this.props.resetError()
								Actions.register()
							}}
						/>
					{/* </View> */}
					{/* <View style={styles.button}> */}
						<Button
							title='Forgot Password?'
							backgroundColor='transparent'
							textStyle={{ color: 'dodgerblue' }}
							// buttonStyle={{ }}
							onPress={() => {
								this.props.resetError()
								Actions.forgotPassword()
							}}
						/>
					{/* </View> */}
				</View>
				<Button
					rounded
					title='Login with Facebook'
					backgroundColor='#3b5998'
					onPress={this.loginwithFacebook}
				/>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		// flex: 1,
		flexDirection: 'row',
		marginBottom: 20,
		justifyContent: 'center'
	},
	button: {
		marginTop: 20,
		backgroundColor: 'green',
		height: 20
	},
	card: {
		width: (width * .8),
		marginLeft: (width * .1),
		justifyContent: 'center'
	},
	input: {
		color: 'rgb(0,91,234)',
		backgroundColor: 'rgba(0,198,251,0.1)',
		fontSize: 15,
		padding: 15,
		paddingLeft: 30,
		marginTop: 20,
		borderRadius: 50
	},
	button: {
		marginTop: 20,
		borderRadius: 50
	}
}

const mapStateToProps = state => {
	return { login: state.login };
};

export default connect(mapStateToProps, actions)(Login);
