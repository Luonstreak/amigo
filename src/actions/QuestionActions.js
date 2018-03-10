import { 
	GAME_CREATED, 
	QUESTION_CHOSEN, 
	FETCH_FIVE, 
	FETCH_SCORE, 
	RESET_GAME_KEY, 
	ADDED_ANSWER, 
	GOT_RESULT,
	STATUS_UPDATE 
} from './types';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

export const renderCard = (game, status, opponent) => {
	const ref = firebase.database().ref(`games/${game}`);
	return (dispatch) => {
		ref.limitToLast(5).once('value', async snap => {
			const obj = { five: snap.val(), gameKey: game, opponent: opponent }
	
			await dispatch({ type: FETCH_FIVE, payload: obj })
			if (status == 'result') {
				firebase.database().ref(`result/${game}`).once('value', async snap => {
					await dispatch({ type: GOT_RESULT, payload: snap.val() })
					Actions.modal()
				})
			}
			else if (status == 'guess') {
				Actions.guess()

			} 
			else if (status == 'guessResult') {
				Actions.guessResult()
			} 
			// Actions.question();
		})
	}
};

export const fetchQuestion = (id, num) => {
	console.log(id, num, 'in fetchQuestion');
	return (dispatch) => {
		const ref = firebase.database().ref(`questions/${id}/${id}${num}`);
		ref.once('value', async snap => {
			const obj = {
				questionNumber: snap.key,
				content: snap.val().content,
				choices: snap.val().choices
			}
			await dispatch({ type: QUESTION_CHOSEN, payload: obj })
			Actions.question({ category: id })
		})
	}
}


export const saveAnswer = (num, questionId, opponent, gameKey) => {
	const { currentUser } = firebase.auth()
	const choice = `option${num}`

	firebase.database().ref(`questions/r/${questionId}`).once('value', snap => {
		const option1 = snap.val().choices.option1
		const option2 = snap.val().choices.option2
		const option3 = snap.val().choices.option3
		const option4 = snap.val().choices.option4
		const content = snap.val().content

		pushId = firebase.database().ref(`games/${gameKey}`).push({
				content: content,
				choices: {
					option1: option1,
					option2: option2,
					option3: option3,
					option4: option4
				},
				[currentUser.uid]: choice,
				[opponent]: ""
			})

		firebase.database().ref(`questionChoices/${gameKey}`).remove()

		firebase.database().ref(`usedQuestions/${gameKey}/${questionId}`).set(true)

		firebase.database().ref(`users/${currentUser.uid}/games/${gameKey}`).update({
			status: 'waiting'
		})

		firebase.database().ref(`users/${opponent}/games/${gameKey}`).update({
			status: 'result'
		})
	})

	return (dispatch) => {
		dispatch({ type: GAME_CREATED })
		Actions.dashboard()
	}
}

export const creatingGame = (num, questionId, opponent) => {
	const { currentUser } = firebase.auth()
	const choice = `option${num}`
	var pushId = null

	firebase.database().ref(`opponents/${currentUser.uid}`).set({[opponent]: true})
	firebase.database().ref(`opponents/${opponent}`).set({[currentUser.uid]: true})

	firebase.database().ref(`questions/r/${questionId}`).once('value', snap => {
		const option1 = snap.val().choices.option1
		const option2 = snap.val().choices.option2
		const option3 = snap.val().choices.option3
		const option4 = snap.val().choices.option4
		const content = snap.val().content

		pushId = firebase.database().ref('games').push()
		const key = pushId.getKey()
		firebase.database().ref(`games/${key}`).push({
			content: content,
			choices: {
				option1: option1,
				option2: option2,
				option3: option3,
				option4: option4
			},
			[currentUser.uid]: choice,
			[opponent]: ""

		})
		firebase.database().ref(`scores/${key}`).set({
			[currentUser.uid]: 0,
			[opponent]: 0
		})
			
		firebase.database().ref(`usedQuestions/${key}/${questionId}`).set(true)

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
	})

	return (dispatch) => {
		dispatch({ type: GAME_CREATED })

		Actions.dashboard()
	}
}

export const resetGameKey = () => {
	return {
		type: RESET_GAME_KEY
	}
}

export const checkAnswers = (num, questionKey, gameKey, opponent, opponentAnswer, item, score) => {
	const { currentUser } = firebase.auth();
	const choice = `option${num}`
	firebase.database().ref(`games/${gameKey}/${questionKey}/${currentUser.uid}`).set(choice);
	
	const option1 = item.value.choices.option1
	const option2 = item.value.choices.option2
	const option3 = item.value.choices.option3
	const option4 = item.value.choices.option4
	const content = item.value.content
	
	firebase.database().ref(`result/${gameKey}`).set({
		content: content,
		choices: {
			option1: option1,
			option2: option2,
			option3: option3,
			option4: option4
		},
		[currentUser.uid]: choice,
		[opponent]: opponentAnswer,
		result: choice === opponentAnswer ? true : false
	})
	
	return async (dispatch) => {
		if (choice === opponentAnswer) {
			const updatedScore = score + 1
			firebase.database().ref(`scores/${gameKey}`).update({
				[currentUser.uid]: updatedScore
			})
			const ref = firebase.database().ref(`scores/${gameKey}`)
				ref.once('value', async snap => {
					await dispatch({
						type: FETCH_SCORE,
						payload: snap.val()
					})
				})		
		}
	
		const ref = firebase.database().ref(`games/${gameKey}`);
		ref.limitToLast(5).once('value', async snap => {
			await dispatch({ type: ADDED_ANSWER, payload: snap.val() })
			Actions.guessResult()
		})
	}
}

export const changeStatus = (status, currentUserId, gameKey) => {
	return (dispatch) => {
		if (status === 'guess') {
			firebase.database().ref(`users/${currentUserId}/games/${gameKey}/status`).set(status)
			dispatch({ type: STATUS_UPDATE })
			Actions.guess()
		}
		if (status === 'guessResult') {
			firebase.database().ref(`users/${currentUserId}/games/${gameKey}/status`).set(status)
			dispatch({ type: STATUS_UPDATE })
			Actions.guessResult()
		}
	}
}

export const fetchScore = (gameKey, uid) => {
	const ref = firebase.database().ref(`scores/${gameKey}`)
	return (dispatch) => {
		ref.once('value', snap => {
			dispatch({
				type: FETCH_SCORE,
				payload: snap.val()
			})
		})
	}
}