import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import firebase from 'firebase';

export default async () => {
		let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

		if (status !== 'granted') {
			return;
		}

		let token = await Notifications.getExpoPushTokenAsync();
		userID = firebase.auth().currentUser.uid;

		firebase.database().ref(`/users/${userID}`).update({ token: token });
}