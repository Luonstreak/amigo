import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, ImageBackground, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
import * as actions from '../actions';

class Splash extends Component {
	async componentDidMount() {
		let fbToken = await AsyncStorage.getItem('fbToken');
		if (fbToken) {
			return this.props.fbLogin();
		} 
		else firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				return this.props.persistentEmailLogin(user)
			} else {
				setTimeout(() => {
					return Actions.login()
					clearTimeout();
				}, 1000);
			}
		})
	}
	
	render() {
		return (
			<ImageBackground source={require('../static/background.png')} style={styles.backgroundImage}>
				<Text style={{ color: 'tomato', fontSize: 26 }}>
					WELCOME TO AMIGOO
				</Text>
			</ImageBackground>
		);
	}
}

const styles = {
	backgroundImage: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
}

const mapStateToProps = state => {
	return { login: state.login };
};

export default connect(mapStateToProps, actions)(Splash);