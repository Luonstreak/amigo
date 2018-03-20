// ABSOLUTE
import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
// RELATIVE
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

	onButtonPress = () => {
		const { email, password, username } = this.state;
		username.length > 1 ? this.props.userRegister(email, password, username)
		: this.setState({ error: 'All fields must be filled out.' });
		Keyboard.dismiss;
	}

	renderError = () => {
		this.props.login.error ? 
			<Text
				style={{ color: 'tomato', margin: 10 }}
			>{this.props.login.error}</Text>
		: null
	}
	renderStateError = () => {
		this.state.error ?
			<Text
				style={{ color: 'tomato', margin: 10 }}
			>{this.state.error}</Text>
		: null
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
							onChangeText={text => this.setState({ email: text, error: '' })}
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
							onSubmitEditing={event => this.refs.ThirdInput.focus()}
							onChangeText={text => this.setState({ password: text, error: '' })}
						/>
					</View>
					<View>
						<TextInput
							style={styles.input}
							ref='ThirdInput'
							placeholderTextColor='rgba(0,91,234,0.5)'
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
				</View>
				<LinearGradient
					start={{ x: 0.0, y: 0.5 }}
					end={{ x: 1.0, y: 0.5 }}
					colors={['#00c6fb', '#005bea']}
					style={styles.button}
				>
					<Button
						buttonStyle={{ backgroundColor: 'transparent' }}
						onPress={this.onButtonPress}
						title='REGISTER'
					/>
				</LinearGradient>
				<Button
					title='friendO already?'
					backgroundColor='transparent'
					textStyle={{ color: 'dodgerblue' }}
					buttonStyle={{ marginBottom: 20 }}
					onPress={() => {
						this.props.resetError()
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

export default connect(mapStateToProps, actions)(Register);
