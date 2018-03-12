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
		const user = firebase.auth().currentUser;
		let fbToken = await AsyncStorage.getItem('fbToken');

		if (fbToken) {
			console.log('asyncstorage token returns true')
			return loginSuccess(dispatch, user)
		} else {
			console.log('asyncstorage token returns false')
			executeFbLogin(dispatch);
		}
	}
}

const executeFbLogin = async dispatch => {
	let { type, token } = await Facebook.logInWithReadPermissionsAsync('2063362863907866', { permissions: ['public_profile', 'user_friends'] });
	// console.log({ type, token });

	if (type === 'cancel') {
		return dispatch({ type: LOGIN_FAIL });
	}

	const response = await fetch(
		`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large),friends`
	);
	const userInfo = await response.json();
	console.log(userInfo);
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

const loginSuccess = (dispatch, user) => {
	dispatch({
		type: LOGIN_SUCCESS,
		payload: user
	});
	Actions.main();
}