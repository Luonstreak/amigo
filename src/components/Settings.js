import React, { Component } from 'react';
import { ScrollView, AsyncStorage, Text, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

class Settings extends Component {
	render() {
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
					title="REPORT ABUSE"
					onPress={() => {alert('dsfsd')}}
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

export default Settings;
