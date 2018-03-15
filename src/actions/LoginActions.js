// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import {
	EMAIL_INPUT,
	PASSWORD_INPUT,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	GAMES_FETCHED,
	RESET_ERROR
} from './types';
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
			.catch((err) => {
				if (err.code === 'auth/wrong-password') {
					dispatch({
						type: LOGIN_FAIL, payload: 'Wrong Email/Password Combination'
					})
				} else if (err.code === 'auth/user-not-found') {
					dispatch({
						type: LOGIN_FAIL, payload: 'User Not Found'
					})
				} else if (err.code === 'auth/invalid-email') {
					dispatch({
						type: LOGIN_FAIL, payload: 'Invalid Email Format'
					})
				}
			});
	};
};

export const resetError = () => {
	return {
		type: RESET_ERROR
	}
}


export const gameFetch = () => {
	const { currentUser } = firebase.auth()
	const ref  = firebase.database().ref(`users/${currentUser.uid}/games`);
	return (dispatch) => {
		ref.once('value', snap => {
			var games = snap.val()
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
	firebase.database().ref(`userNumbers/${user.uid}`).once('value', snap => {
		snap.val() ? Actions.main() : Actions.phoneAuth()
	})
}

const loginSuccess2 = (dispatch, user) => {
	dispatch({
		type: LOGIN_SUCCESS,
		payload: user
	});
	Actions.username();
}