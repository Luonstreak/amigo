// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import { QUESTION_CHOSEN } from './types';


export const fetchQuestionAndCreateGame = (id, player) => {
	const { currentUser } = firebase.auth()
	const num = Math.floor(Math.random() * 2) + 1
	const questionRef = id + num
	const pushId = firebase.database().ref('games').push({
		player1: currentUser.uid,
		player2: player,
		questions: {
			[questionRef]: true
		},
		status: player 
	})
	const key = pushId.getKey()
	firebase.database().ref(`users/${currentUser.uid}/games/${key}`).set({
		status: false,
		opponent: player
	})
	firebase.database().ref(`users/${player}/games/${key}`).set({
		status: true,
		opponent: currentUser.uid
	})
	const ref = firebase.database().ref(`questions/${id}/${id}${num}`);

	return(dispatch) => {
		ref.once('value', snap => {
			dispatch({ type: QUESTION_CHOSEN, payload: snap.val()})
		})
	}
}