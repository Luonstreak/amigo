import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, AsyncStorage } from 'react-native';
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
			<View style={{ flex: 1 }}>
				<LinearGradient
					colors={/*['#b224ef', '#e14fad', '#f9d423']*/['#84fab0', '#8fd3f4']}
					style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}
					start={[0.1,0]}
				>
					<Text style={{ color: 'white', fontSize: 26 }}>
						WELCOME TO AMIGOO
					</Text>
				</LinearGradient>
			</View>
		);
	}
}

const mapStateToProps = state => {
	return { login: state.login };
};

export default connect(mapStateToProps, actions)(Splash);