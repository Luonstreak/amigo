import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';
import firebase from 'firebase';
import {
	LOGIN_SUCCESS,
	LOGIN_FAIL
} from './types';
import { Actions } from 'react-native-router-flux';

export const fbLogin = () => {
	return async (dispatch) => {
		let fbToken = await AsyncStorage.getItem('fbToken');

		if (fbToken) {
			console.log('asyncstorage token returns true')
			persistantFbLogin(dispatch, fbToken)
		} else {
			console.log('asyncstorage token returns false')
			executeFbLogin(dispatch);
		}
	}
}

const executeFbLogin = async dispatch => {
	let { type, token } = await Facebook.logInWithReadPermissionsAsync('2063362863907866', { permissions: ['public_profile', 'user_friends'] });

	if (type === 'cancel') {
		return dispatch({ type: LOGIN_FAIL });
	}

	const credential = firebase.auth.FacebookAuthProvider.credential(token);

	try {
		firebase.auth().signInWithCredential(credential)
			.then(user => loginSuccess(dispatch, user));
	}
	catch (error) {
		console.log('firebase auth has failed');
	}
	await AsyncStorage.setItem('fbToken', token);
}

persistantFbLogin = async (dispatch, token) => {
	const response = await fetch(
		`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large),friends`
	);
	const userInfo = await response.json();
	const credential = firebase.auth.FacebookAuthProvider.credential(token);

	try {
		firebase.auth().signInWithCredential(credential)
			.then(user => loginSuccess2(dispatch, user, userInfo));
	}
	catch (error) {
		console.log('firebase auth has failed');
	}
}

const loginSuccess = (dispatch, user) => {
	firebase.database().ref(`users/${user.uid}`).update({
		username: user.displayName, 
		photo: user.photoURL
	})
	firebase.database().ref(`categories/${user.uid}`).update({
		points: 0,
		a: 0,
		b: 0,
		c: 0,
		d: 5,
		e: 3
	})
	dispatch({
		type: LOGIN_SUCCESS,
		payload: user
	});
	Actions.phoneAuth();
}

const loginSuccess2 = (dispatch, user, userInfo) => {
	firebase.database().ref(`users/${user.uid}`).update({
		username: userInfo.name,
		photo: userInfo.picture.data.url
	})
	user.updateProfile({
		displayName: userInfo.name,
		photoURL: userInfo.picture.data.url
	}).then(() => {
		dispatch({
		 type: LOGIN_SUCCESS,
		 payload: user
	 });
	 Actions.main();
	}).catch((error) => {
		console.log(error)
	});
}