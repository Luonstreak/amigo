// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import { EMAIL_INPUT, PASSWORD_INPUT, LOGIN_SUCCESS, LOGIN_FAIL, GAMES_FETCHED } from './types';

export const emailInput = (text) => {
	return {
		type: EMAIL_INPUT,
		payload: text
	};
};

export const passwordInput = (text) => {
	return {
		type: PASSWORD_INPUT,
		payload: text
	}
};

export const userLogin = ({ email, password }) => {
	return (dispatch) => {
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(user => loginSuccess1(dispatch, user))
			.catch(() => {
				firebase.auth().createUserWithEmailAndPassword(email, password)
					.then(user => loginSuccess2(dispatch, user))
					.catch(() => loginFail(dispatch));
			});
	};
};

const gameFetch = (dispatch, user) => {
	const ref  = firebase.database().ref(`users/${user.uid}/games`);
	// return (dispatch) => {
		ref.once('value', snap => {
			var games = snap.val()
			console.log(games)
			
			// var arr = Object.keys(games)
			// console.log(arr)
			// for(var i=0; i<arr.length; i++) {
			// 	const gameRef  = firebase.database().ref(`games/${arr[i]}`);
			// 	console.log(i)
			// 	await gameRef.once('value', snap => {
			// 		console.log(snap.val())
			// 		finalArr.push(snap.val())
			// 	})
			// }
			dispatch({
				type: GAMES_FETCHED,
				payload: games

			})
		}) 
	// }
}

const loginSuccess1 = (dispatch, user) => {
	gameFetch(dispatch, user)
	console.log(user.uid)
	dispatch({
		type: LOGIN_SUCCESS,
		payload: user
	});
	Actions.main();
}

const loginSuccess2 = (dispatch, user) => {
	dispatch({
		type: LOGIN_SUCCESS,
		payload: user
	});
	Actions.username();
}

const loginFail = (dispatch) => {
	dispatch({
		type: LOGIN_FAIL,
	})
}