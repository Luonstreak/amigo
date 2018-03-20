// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	RESET_ERROR,
	USER_FETCH
} from './types';
import _ from 'lodash'

export const userLogin = (email, password) => {
	console.log('hit userLogin', email, password)
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

export const persistentEmailLogin = (user) => {
	return (dispatch) => {
		dispatch({
			type: LOGIN_SUCCESS,
			payload: user
		});
		userFetch(dispatch, user)
		firebase.database().ref(`allPhoneNumbers/${user.uid}`).once('value', snap => {
			snap.val() ? Actions.main() : Actions.phoneAuth()
		})
	}
}

const loginSuccess = (dispatch, user) => {
	console.log('login success')
	userFetch(dispatch,user)
	dispatch({
		type: LOGIN_SUCCESS,
		payload: user
	});
	firebase.database().ref(`allPhoneNumbers/${user.uid}`).once('value', snap => {
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
