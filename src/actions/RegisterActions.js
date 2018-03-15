// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import {
	USERNAME_INPUT,
	REGISTER_SUCCESS,
	USERNAME_FETCH,
} from './types';

export const usernameInput = (text) => {
	return {
		type: USERNAME_INPUT,
		payload: text
	};
};

export const userRegister = (email, password, username) => {
	return (dispatch) => {
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(user => registerSuccess(dispatch, user, username))
			.catch((err) => {
				console.log(err)
				if (err.code === 'auth/weak-password') {
					dispatch({
						type: LOGIN_FAIL, payload: 'The password must be 6 characters long or more.'
					})
				} 
				else if (err.code === 'auth/invalid-email') {
					dispatch({
						type: LOGIN_FAIL, payload: 'Invalid Email Format'
					})
				}
			})
	}
};

export const usernameFetch = () => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		firebase.database().ref(`users/${currentUser.uid}/username`)
			.once('value', snap => {
				dispatch({ type: USERNAME_FETCH, payload: snap.val() });
			});	
	};
};

const registerSuccess = (dispatch, user, username) => {
	console.log('hit register Success', user, username)
	firebase.database().ref(`users/${user.uid}`).update({ username })
	dispatch({ type: REGISTER_SUCCESS, payload: user });
	Actions.phoneAuth();
}
