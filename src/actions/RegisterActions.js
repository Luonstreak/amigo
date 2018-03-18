// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import {
	USERNAME_INPUT,
	REGISTER_SUCCESS,
	LOGIN_FAIL,
	USER_FETCH
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
			else if (err.code === 'auth/email-already-in-use') {
				dispatch({
					type: LOGIN_FAIL, payload: 'The email address is already in use by another account.'
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

const registerSuccess = (dispatch, user, username) => {
	firebase.database().ref(`categories/${user.uid}`).update({
		points: 0,
		a: 0,
		b: 0,
		c: 0,
		d: 5,
		e: 3
	})
	firebase.database().ref(`users/${user.uid}`).update({ 
		username,
		photo: 'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/moustache.png?alt=media&token=e2d14111-962b-4527-9a2a-47430b5bc2e5' 
	})
	dispatch({ type: REGISTER_SUCCESS, payload: user });
	Actions.phoneAuth();
}

