// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import { EMAIL_INPUT, PASSWORD_INPUT, LOGIN_SUCCESS, LOGIN_FAIL, GAMES_FETCHED } from './types';
import _ from 'lodash'

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

export const gameFetch = () => {
	const { currentUser } = firebase.auth()
	const ref  = firebase.database().ref(`users/${currentUser.uid}/games`);
	return (dispatch) => {
		ref.once('value', snap => {
			var games = snap.val()
			
			// var arr = []
			// _.map(games, item => {
			// 	arr.push({item})
			// })
			// for(var i=0; i<arr.length; i++) {
			// 	const gameRef  = firebase.database().ref(`games/${arr[i]}`);
			// 	await gameRef.once('value', snap => {
			// 		finalArr.push(snap.val())
			// 	})
			// }
			dispatch({
				type: GAMES_FETCHED,
				payload: games

			})
		}) 
	}
}

const loginSuccess1 = (dispatch, user) => {
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