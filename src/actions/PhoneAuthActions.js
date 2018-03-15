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
		firebase.database().ref(`allUsers/${phoneNumber}`).set(currentUser.uid)
			.then(() => {
				updateDatabase(phoneNumber, currentUser.uid)
				dispatch({ type: PHONE_SAVE });
			});
		};
	};
	


const updateDatabase = (phone, uid) => {
	console.log(phone, uid)
	firebase.database().ref(`userNumbers/${uid}`).set(phone);
	const ref = firebase.database().ref(`pendingGames/${phone}`)
	ref.once('value', snap => {
		const game = snap.val();
		console.log(game)
		if (game) {
			// firebase.database().ref(`score/${}`)
			firebase.database().ref(`users/${uid}`).update(game)
			Actions.main();
		}
		else{
			Actions.main();
		}
	})
}

