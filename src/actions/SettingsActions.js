// ABSOLUTE
import firebase from 'firebase';

// RELATIVE
import { FETCH_BLOCKED_USERS, UNBLOCKED_USER } from './types';
import { Actions } from 'react-native-router-flux';

export const fetchBlockedUsers = (uid) => {
	return (dispatch) => {
		firebase.database().ref(`blockedUsers/${uid}`).once('value', snap => {
			dispatch({
				type: FETCH_BLOCKED_USERS,
				payload: snap.val()
			})
			Actions.blockedUsers()
		})
	}
};

export const unblockUser = (uid, opponent, gameKey) => {
	return (dispatch) => {
		firebase.database().ref(`blockedUsers/${uid}/${gameKey}`).remove()

		firebase.database().ref(`users/${opponent}/games/${gameKey}`).update({
			blocked: false
		})
		firebase.database().ref(`users/${uid}/games/${gameKey}`).update({
			blocked: false
		})
			dispatch({
				type: UNBLOCKED_USER
			})
			Actions.main()
	}
}