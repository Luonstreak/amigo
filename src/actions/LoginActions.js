// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import {
	EMAIL_INPUT,
	PASSWORD_INPUT,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	RESET_ERROR,
	USER_FETCH
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
			.then(user => loginSuccess(dispatch, user))
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

const loginSuccess = (dispatch, user) => {
	userFetch(dispatch,user)
	dispatch({
		type: LOGIN_SUCCESS,
		payload: user
	});
	firebase.database().ref(`userNumbers/${user.uid}`).once('value', snap => {
		snap.val() ? Actions.main() : Actions.phoneAuth()
	})
}

const userFetch = (dispatch, user) => {
	const ref = firebase.database().ref(`users/${user.uid}`);
		ref.once('value', snap => {
			dispatch({
				type: USER_FETCH,
				payload: snap.val()
			})
		})
};

export const resetError = () => {
	return {
		type: RESET_ERROR
	}
};
