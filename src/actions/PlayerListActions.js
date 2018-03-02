// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import { PLAYERS_FETCH, PLAYER_SELECTED } from './types';

export const fetchPlayers = () => {
	console.log('in actions')
	const ref = firebase.database().ref('users')
	return (dispatch) => {
		ref.once('value', snap => {
			console.log(snap.val())
			dispatch({ type: PLAYERS_FETCH, payload: snap.val() })
		})
	}
}

export const playerSelect = (player) => {
	return {
		type: PLAYER_SELECTED,
		payload: player
	}
}