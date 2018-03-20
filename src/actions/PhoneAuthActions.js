// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import {
	PHONE_INPUT,
	PHONE_SAVE
} from './types';

export const phoneInput = (text) => {
	return {
		type: PHONE_INPUT,
		payload: text
	};
};

export const phoneSave = (phoneNumber) => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		firebase.database().ref(`users/${currentUser.uid}`).update({ phone: phoneNumber })
		firebase.database().ref(`allPhoneNumbers/${currentUser.uid}`).set(phoneNumber)
		firebase.database().ref(`allUids/${phoneNumber}`).set(currentUser.uid)
			.then(() => {
				updateDatabase(phoneNumber, currentUser.uid)
				dispatch({ type: PHONE_SAVE, payload: phoneNumber });
			});
		};
	};
	


const updateDatabase = (phone, uid) => {
	const ref = firebase.database().ref(`pendingGames/${phone}`)
	ref.once('value', snap => {
		const game = snap.val();
		if (game) {
			firebase.database().ref(`users/${uid}`).update(game)
			ref.remove();
			Actions.main();
		}
		else{
			Actions.main();
		}
	})
}

