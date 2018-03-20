import React, { Component } from 'react';
import { ScrollView, AsyncStorage, Text, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Settings extends Component {
	render() {
		const { uid } = this.props.login
		return (
			<ScrollView>
				<Button
					title="UPDATE EMAIL"
					onPress={() => {alert('dsfsd')}}
				/>
				<Button
					title="CHANGE PASSWORD"
					onPress={() => {alert('dsfsd')}}
				/>
				<Button
					title="BLOCKED USERS"
					onPress={() => {this.props.fetchBlockedUsers(uid)}}
				/>
				<Button
					title="LOG OUT"
					onPress={ async () => {
						let fbToken = await AsyncStorage.getItem('fbToken');
						if (fbToken) {
							AsyncStorage.removeItem('fbToken');
						} 
						firebase.auth().signOut()
						.then(() => {
							alert('Sign out complete');
							Actions.login()
						})
						.catch((error) => {
							alert('Sign Out Error');
						});
					}}
				/>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return {
		login: state.login.user
	}
}

export default connect(mapStateToProps, actions)(Settings);
