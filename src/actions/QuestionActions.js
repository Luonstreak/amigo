import { 
	GAME_CREATED, 
	QUESTION_CHOSEN, 
	FETCH_FIVE, 
	FETCH_SCORE, 
	RESET_GAME_KEY, 
	ADDED_ANSWER, 
	GOT_RESULT,
	STATUS_UPDATE,
	FETCH_CHOSEN_QUESTIONS,
	PLAYER_SELECTED,
	FETCHED_OPPONENT_NAME_AND_PHOTO,
	LOADING
} from './types';
import firebase from 'firebase';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';

export const fetchQuestion = (id, num, gameKey, selectedPlayer) => {
	const { currentUser } = firebase.auth()
	return (dispatch) => {
		const ref = firebase.database().ref(`questions/${id}/${id}${num}`);
		ref.once('value', async snap => {
			const obj = {
				questionNumber: snap.key,
				content: snap.val().content,
				choices: snap.val().choices
			}
			if (!gameKey) {
				const opponent = selectedPlayer.phone
				firebase.database().ref(`allUids/${opponent}`).once('value', snapshot => {
					var existingOpponent = snapshot.val()
					if (existingOpponent) {
						firebase.database().ref(`questionChoices/${currentUser.uid}/${opponent}/${id}${num}`).set({
							questionNumber: snap.key,
							content: snap.val().content,
							choices: snap.val().choices
						});
					}
					else {
						firebase.database().ref(`questionChoices/${currentUser.uid}/${opponent}/${id}${num}`).set({
							questionNumber: snap.key,
							content: snap.val().content,
							choices: snap.val().choices
						});
					}
				})
			} else {
				firebase.database().ref(`questionChoices/${gameKey}/${id}${num}`).set({
					questionNumber: snap.key,
					content: snap.val().content,
					choices: snap.val().choices
				});
			}
			await dispatch({ type: QUESTION_CHOSEN, payload: obj })
			Actions.question({ category: id })
		})
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
};

export const startGame = (game, status, opponent, phone, photo, username) => {
	// const ref = firebase.database().ref(`games/${game}`); last merge
	firebase.database().ref(`users/${opponent}/games/${game}`).update({
		opponentName: username,
		opponentPhoto: photo
	})
	firebase.database().ref(`users/${opponent}/phone`).once('value', snap => {
		var opponentPhone = snap.val()
		firebase.database().ref(`users/${opponent}/username`).once('value', snap => {
			firebase.database().ref(`friends/${phone}/${opponentPhone}`).update({ username: snap.val() })
		})
	})
	return (dispatch) => {
		const ref = firebase.database().ref(`games/${game}`);
		dispatchSelectedPlayer(dispatch, opponent)
		ref.limitToLast(5).once('value', async snap => {
			const obj = { five: snap.val(), gameKey: game, opponent }
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

const dispatchSelectedPlayer = (dispatch, opponent) => {
	firebase.database().ref(`allPhoneNumbers/${opponent}`).once('value', snap => {
		dispatch({
			type: PLAYER_SELECTED,
			payload: snap.val()
		})
		firebase.database().ref(`users/${opponent}`).once('value', snap => {
			let obj = {
				opponentName: snap.val().username,
				opponentPhoto: snap.val().photo
			}
			dispatch({
				type: FETCHED_OPPONENT_NAME_AND_PHOTO,
				payload: obj
			})
		})
	})
}

export const fetchChosenQuestions = (gameKey) => {
	const ref = firebase.database().ref(`questionChoices/${gameKey}`)
	return (dispatch) => {
		ref.once('value', async snap => {
			// var snap = snap.exists()
			if (snap.val() !== null) {
				var snapVal = snap.val()
				var arr = Object.values(snapVal)
				await dispatch({
					type: FETCH_CHOSEN_QUESTIONS,
					payload: arr
				})
			}
		})
	}
};

export const saveAnswer = (num, questionId, opponent, gameKey, displayName) => {
	const { currentUser } = firebase.auth()
	const choice = `option${num}`

	firebase.database().ref(`questions/r/${questionId}`).once('value', snap => {
		const option1 = snap.val().choices.option1
		const option2 = snap.val().choices.option2
		const option3 = snap.val().choices.option3
		const option4 = snap.val().choices.option4
		const content = snap.val().content

		pushId = firebase.database().ref(`games/${gameKey}`).push({
			questionNumber: questionId,
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

		const tokenRef = firebase.database().ref(`users/${opponent}/token`);
		tokenRef.once('value', snap => {
			var token = snap.val();
			if (token) {
				var message = `${displayName} asked you: ${content}`
				firebase.database().ref('yourTurn').push({
					from: currentUser.uid,
					expoToken: token,
					body: message
				})
			}
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

export const creatingGame = (num, questionId, selectedPlayer, phone, username, photo) => {
	const opponent = selectedPlayer.phone
	const opponentName = selectedPlayer.name
	const { currentUser } = firebase.auth()
	const choice = `option${num}`
	var pushId = null

	firebase.database().ref(`allUids/${opponent}`).once('value', snap => {
		var existingOpponent = snap.val()
		if (existingOpponent) {
			initialGame(currentUser, choice, questionId, existingOpponent, username, phone, opponentName, null, true)
			firebase.database().ref(`opponents/${phone}`).update({ [opponent]: true })
			firebase.database().ref(`opponents/${opponent}`).update({ [phone]: true })
			firebase.database().ref(`users/${existingOpponent}`).once('value', snap => {
				const opponentInfo = snap.val();
				firebase.database().ref(`friends/${phone}`).update({ 
					[opponent]: {
						username: opponentInfo.username,
						photo: opponentInfo.photo,
						count: 0
					}
				})
				firebase.database().ref(`friends/${opponent}`).update({ 
					[phone]: {
						username: username,
						photo: photo,
						count: 0
					}
				})
			})
		}
		else {
			initialGame(currentUser, choice, questionId, opponent, username, phone, opponentName, photo)
			firebase.database().ref(`opponents/${phone}`).update({ [opponent]: true })
			firebase.database().ref(`opponents/${opponent}`).update({ [phone]: true })
			firebase.database().ref(`friends/${phone}`).update({
				[opponent]: {
					username: selectedPlayer.name,
					photo: 'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/moustache.png?alt=media&token=e2d14111-962b-4527-9a2a-47430b5bc2e5',
					count: 0
				}
			})
			firebase.database().ref(`friends/${opponent}`).update({
				[phone]: {
					username: username,
					photo: photo,
					count: 0
				}
			})
			const ref = firebase.database().ref(`categories/${currentUser.uid}/points`);
			ref.once('value', snap => {
				ref.parent.update({ points: snap.val() + 1 })
			})
		}
	})
		return (dispatch) => {
		dispatch({ type: GAME_CREATED })
		Actions.dashboard()
	}
}

const initialGame = (currentUser, choice, questionId, opponent, username, phone, opponentName, photo, exists) => {

	firebase.database().ref(`questions/r/${questionId}`).once('value', snap => {
		const option1 = snap.val().choices.option1
		const option2 = snap.val().choices.option2
		const option3 = snap.val().choices.option3
		const option4 = snap.val().choices.option4
		const content = snap.val().content

		pushId = firebase.database().ref('games').push()
		const key = pushId.getKey()
		firebase.database().ref(`games/${key}`).push({
			questionNumber: questionId,
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
		firebase.database().ref(`nudges/${key}`).set({
			[currentUser.uid]: 5,
			[opponent]: 5
		})
		firebase.database().ref(`questionChoices/${currentUser.uid}/${opponent}`).remove()
		firebase.database().ref(`usedQuestions/${key}/${questionId}`).set(true)

		firebase.database().ref(`users/${currentUser.uid}/games/${key}`).set({
			player1: currentUser.uid,
			player2: opponent,
			status: 'pending',
			opponentPhone: opponent,
			opponentName: opponentName,
			opponentPhoto: 'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/moustache.png?alt=media&token=e2d14111-962b-4527-9a2a-47430b5bc2e5',
		})
		if (exists) {
			firebase.database().ref(`users/${opponent}/games/${key}`).set({
				player1: currentUser.uid,
				player2: opponent,
				status: 'guess',
				setScore: true
			})
		}
		else {
			firebase.database().ref(`pendingGames/${opponent}/games/${key}`).update({
				player1: currentUser.uid,
				player2: opponent,
				status: 'guess',
				setScore: true,
				opponentPhone: phone,
				opponentName: username,
				opponentPhoto: photo 
			})
		}
	})
}

export const checkAnswers = (num, questionKey, gameKey, opponent, opponentAnswer, item, score, opponentPhone, phone) => {
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
		dispatch({
			type: LOADING
		})
		if (choice === opponentAnswer) {
			const updatedScore = score + 1
			firebase.database().ref(`friends/${phone}/${opponentPhone}`).update({ count: updatedScore })
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
		})
		Actions.guessResult()
	}
}

export const changeStatus = (status, currentUserId, gameKey, opponent) => {
	return (dispatch) => {
		if (status === 'guess') {
			firebase.database().ref(`users/${currentUserId}/games/${gameKey}/status`).set(status)
			dispatch({ type: STATUS_UPDATE })
			Actions.guess()
		}
		if (status === 'guessResult') {
			const opp = firebase.database().ref(`users/${opponent}/games/${gameKey}`)
			opp.update({ opponentLastPlayed: moment().format('YYYYMMDDHHmm')})
			firebase.database().ref(`users/${currentUserId}/games/${gameKey}/status`).set(status)
			dispatch({ type: STATUS_UPDATE })
			Actions.guessResult()
		}
	}
}