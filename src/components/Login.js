import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions, Keyboard, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
// RELATIVE
import * as actions from '../actions';
import colors from '../styles/colors';

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
		this.props.userLogin(this.state.email, this.state.password);
		this.setState({email: '', password: ''})
		Keyboard.dismiss;
	}

	loginwithFacebook = () => {
		this.props.fbLogin();
	}

	renderError = () => {
		if(this.props.login.error) {
			return(
				<Text 
					style={{ color: colors.wrong, alignSelf: 'center', marginTop: 10 }}
				>{this.props.login.error}</Text>
			)
		}
	}
	

	render() {
		return (
			<View style={[styles.card, this.state.keyboard ? { marginTop: height * 0.1 } : { marginTop: height * 0.4 }]}>
				<Text style={{
					fontSize: 24, color: colors.darkred, fontWeight: '400'
				}}>LOGIN</Text>
				<View style={{ flexDirection: 'column'}}>
					<TextInput
						style={styles.input}
						placeholderTextColor={colors.darkred}
						placeholder='Email'
						underlineColorAndroid={colors.transparent}
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='next'
						value={this.state.email}
						onSubmitEditing={event => this.refs.SecondInput.focus()}
						onChangeText={text => this.setState({ email: text })}
					/>
					<TextInput
						style={styles.input}
						ref='SecondInput'
						placeholderTextColor={colors.darkred}
						placeholder='Password'
						underlineColorAndroid={colors.transparent}
						secureTextEntry={true}
						autoCapitalize='none'
						autoCorrect={false}
						returnKeyType='done'
						value={this.state.password}
						onChangeText={text => this.setState({ password: text })}
					/>
				</View>
				{this.renderError()}
				<LinearGradient
					start={{ x: 0.0, y: 0.5 }}
					end={{ x: 1.0, y: 0.5 }}
					colors={[colors.darkred, colors.lightred]}
					style={styles.button}
				>
					<Button
						buttonStyle={{ backgroundColor: colors.transparent }}
						onPress={this.onButtonPress}
						title='LOGIN'
					/>
				</LinearGradient>
				<Button
					title='Not a friendO yet?'
					backgroundColor={colors.transparent}
					textStyle={{ color: colors.lightred }}
					onPress={() => {
						Actions.register()
					}}
				/>
				<Button
					title='Forgot Password?'
					backgroundColor={colors.transparent}
					textStyle={{ color: colors.lightred }}
					onPress={() => {
						this.props.resetError()
						Actions.forgotPassword()
					}}
				/>
				<Button
					rounded
					title='Login with Facebook'
					style={styles.button}
					backgroundColor='#3b5998'
					onPress={this.loginwithFacebook}
				/>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');
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
	return { login: state.login };
};

export default connect(mapStateToProps, actions)(Login);
