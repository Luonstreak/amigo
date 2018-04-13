import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { SAVE_NUMBERS, PLAYERS_FETCH, PLAYER_SELECTED } from './types';

export const playerSelect = (phone, uid, name) => {
	const ref = firebase.database().ref(`questionChoices/${uid}`);
	ref.once('value', snap => {
		if (snap.val() !== null) {
			ref.remove();
		}
	})
	return (dispatch) => {
		dispatch({
			type: PLAYER_SELECTED,
			payload: { phone, name }
		})
		Actions.categories()
	}
}

export const savePhoneNumbers = (numbers) => {
	return (dispatch) => {
		dispatch({ type: SAVE_NUMBERS, payload: numbers })
	}
}