import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, AsyncStorage, Image } from 'react-native';
import firebase from 'firebase';
import { LinearGradient } from 'expo';
import colors from "../styles/colors";
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
				Actions.login();
			}
		})
	}
	
	render() {
		return <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} colors={[colors.red,colors.darkred]} style={styles.background}>
        <Image source={{uri:("https://i.imgur.com/2Zc1U4n.png")}} style={styles.logo} />
				<Text style={styles.title}>AMIGOO</Text>
      </LinearGradient>;
	}
}

const styles = {
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 34,
    color: colors.yellow
  },
  logo: {
    width: 200,
    height: 200
  }
};

const mapStateToProps = state => {
	return { login: state.login };
};

export default connect(mapStateToProps, actions)(Splash);