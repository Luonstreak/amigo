// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import {
	REGISTER_SUCCESS,
	LOGIN_FAIL,
	USER_FETCH
} from './types';

export const userRegister = (email, password, username) => {
	return (dispatch) => {
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(user => {
			registerSuccess(dispatch, user, username, password);
		})
		.catch((err) => {
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

const registerSuccess = (dispatch, user, username, password) => {
	
	const pics = [
		'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/DRAGON.png?alt=media&token=903c5ad7-3bf3-4476-bf88-629703662ba3',
		'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/GODZ.png?alt=media&token=97543b34-bbb2-4662-9db2-90cd1badf35a',
		'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/MONKEY.png?alt=media&token=40b032fa-0405-4f20-a689-bd9a9966acd1',
		'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/MONSTER.png?alt=media&token=0ac84ade-e765-450b-b360-5673ea4fac70',
		'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/PUMP.png?alt=media&token=6929f688-1838-4998-bb1d-cb0b736dc246',
		'https://firebasestorage.googleapis.com/v0/b/friend-ec2f8.appspot.com/o/ROBOT.png?alt=media&token=90390298-3ac0-44bf-b1a9-3f08277e6547'
	];
	var selected = pics[Math.floor(Math.random() * 6)]
	
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
		password,
		photo: selected 
	})
	dispatch({ type: REGISTER_SUCCESS, payload: user });
	Actions.phoneAuth();
}

