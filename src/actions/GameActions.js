import { GAME_CREATED, QUESTION_CHOSEN, FETCH_FIVE } from './types';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

export const renderCard = (game, status) => {
	const ref = firebase.database().ref(`games/${game}`);
	return (dispatch) => {
		ref.limitToLast(5).once('value', async snap => {
			await dispatch({ type: FETCH_FIVE, payload: snap.val() })
			if (status == 'guess') {
				firebase.database.ref(`result/${game}`)
			}
			Actions.game();
		})
	}
};

export const fetchQuestion = (id) => {
	const num = Math.floor(Math.random() * 2) + 1
	const questionRef = id + num
	const ref = firebase.database().ref(`questions/${id}/${id}${num}`);

	return (dispatch) => {
		ref.once('value', async snap => {
			const obj = { questionNumber: snap.key, content: snap.val().content, choices: snap.val().choices }
			await dispatch({ type: QUESTION_CHOSEN, payload: obj })
			Actions.game()
		})
	}
}


export const saveAnswer = (num, questionId, opponent) => {
	const { currentUser } = firebase.auth()
	const choice = `option${num}`
	var pushId = null

	firebase.database().ref(`questions/r/${questionId}`).once('value', snap => {
		const option1 = snap.val().choices.option1
		const option2 = snap.val().choices.option2
		const option3 = snap.val().choices.option3
		const option4 = snap.val().choices.option4
		const content = snap.val().content
		console.log('before game creation')
		pushId = firebase.database().ref('games').push({
			[questionId]: {
				content: content,
				choices: {
					option1: option1,
					option2: option2,
					option3: option3,
					option4: option4
				},
				[currentUser.uid]: choice,
				[opponent]: ""
			}
		})
		const key = pushId.getKey()
		
		firebase.database().ref(`result/${key}`).set({
			[questionId]: {
				content: content,
				choices: {
					option1: option1,
					option2: option2,
					option3: option3,
					option4: option4
				}
			}
		})

		firebase.database().ref(`users/${currentUser.uid}/games/${key}`).once('value', snap => {
			const gameKey = snap.exists()
			if (!gameKey) {
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
			}
			else {
				firebase.database().ref(`users/${currentUser.uid}/games/${key}`).set({
					status: 'guess'
				})
				firebase.database().ref(`users/${opponent}/games/${key}`).set({
					status: 'waiting'
				})
			}
		})
	})
	return (dispatch) => {
		dispatch({ type: GAME_CREATED })
		Actions.dashboard()
	}
}


export const initialGame = () => {
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
}