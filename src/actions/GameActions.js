import { GAME_CREATED, QUESTION_CHOSEN } from './types';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

export const fetchQuestion = (id) => {
	const num = Math.floor(Math.random() * 2) + 1
	const questionRef = id + num
	console.log(questionRef)
	console.log(num)
	const ref = firebase.database().ref(`questions/${id}/${id}${num}`);

	return (dispatch) => {
		ref.once('value', async snap => {
			const obj = { questionNumber: snap.key, content: snap.val().content, choices: snap.val().choices }
			console.log(obj)
			await dispatch({ type: QUESTION_CHOSEN, payload: obj })
			Actions.game()
		})
	}
}


export const saveAnswer = (num, questionId, opponent) => {
	const { currentUser } = firebase.auth()
	const choice = `option${num}`

	const pushId = firebase.database().ref('games').push({
		[questionId]: {
			[currentUser.uid]: choice,
			[opponent]: ""
		}
	})
	const key = pushId.getKey()
	firebase.database().ref(`users/${currentUser.uid}/games/${key}`).set({
		player1: currentUser.uid,
		player2: opponent,
		status: 'pending'
	})
	firebase.database().ref(`users/${opponent}/games/${key}`).set({
		player1: currentUser.uid,
		player2: opponent,
		status: 'guess'
	})
	return (dispatch) => {
		dispatch({ type: GAME_CREATED })
		console.log('this is the gameActions')
		Actions.dashboard()
	}
}