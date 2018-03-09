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

export const playerSelect = (player) => {
	return (dispatch) => {
		dispatch({
			type: PLAYER_SELECTED,
			payload: player
		})
		Actions.categories()
	}
}