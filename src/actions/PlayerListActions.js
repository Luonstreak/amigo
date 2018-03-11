// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import { PLAYERS_FETCH, PLAYER_SELECTED, FAIL_SELECT } from './types';

export const fetchPlayers = () => {
	const ref = firebase.database().ref('users')
	return (dispatch) => {
		ref.once('value', snap => {
			dispatch({ type: PLAYERS_FETCH, payload: snap.val() })
		})
	}
}

export const playerSelect = (player, uid) => {
	const ref = firebase.database().ref(`questionChoices/${uid}/${player}`);
	ref.once('value', snap => {
		if (snap.val() !== null) {
			ref.remove();
		}
	})
	return (dispatch) => {
		dispatch({
			type: PLAYER_SELECTED,
			payload: player
		})
		Actions.categories()
	}
}