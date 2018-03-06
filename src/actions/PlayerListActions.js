// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import { PLAYERS_FETCH, PLAYER_SELECTED } from './types';

export const fetchPlayers = () => {
	const ref = firebase.database().ref('users')
	return (dispatch) => {
		ref.once('value', snap => {
			dispatch({ type: PLAYERS_FETCH, payload: snap.val() })
		})
	}
}

export const playerSelect = (player) => {
	const { currentUser } = firebase.auth()
	const ref  = firebase.database().ref(`opponentList/${currentUser.uid}`);
	return async (dispatch) => {

	await ref.once('value').then(snap => {
		var opponent = snap.exists()

		if (opponent) {
			console.log('opponent exists')
		}
		else { 
				dispatch({
					type: PLAYER_SELECTED,
					payload: player
				})
			}
		})
	}
}