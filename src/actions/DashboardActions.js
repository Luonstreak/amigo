import {
	USER_FETCH,
	FRIENDS_FETCH,
	RESET_GAME_KEY,
	GET_CATEGORIES, 
	CHAT_VISIBLE,
	DECREASE_NUDGE_COUNT
} from './types';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

export const userFetch = () => {
	const { currentUser } = firebase.auth()
	const ref = firebase.database().ref(`users/${currentUser.uid}`);
	return (dispatch) => {
		ref.once('value', snap => {
			dispatch({
				type: USER_FETCH,
				payload: snap.val()
			})
		})
	}
};

export const friendsFetch = (phone) => {
	const ref = firebase.database().ref(`friends/${phone}`);
	return (dispatch) => {
		ref.once('value', snap => {
			const obj = snap.val()
			var list = _.forEach(snap.val(), (value, key) => {
				value['phone'] = key
			})
			list = _.orderBy(list, ['count', 'name', 'photo', 'phone'], ['desc']);
			dispatch({
				type: FRIENDS_FETCH,
				payload: list
			})
		})
	}
};

export const getCategories = () => {
	const { currentUser } = firebase.auth()
	return (dispatch) => {
		firebase.database().ref(`categories/${currentUser.uid}`).once('value', async snap => {
			await dispatch({ type: GET_CATEGORIES, payload: snap.val() })
		})
	}
};

export const resetGameKey = () => {
	return {
		type: RESET_GAME_KEY
	}
};

export const visibleChat = (data) => {
	if (data) {
		return (dispatch) => {
			dispatch({ type: CHAT_VISIBLE, payload: 'on' })
		}
	}
	return (dispatch) => {
		dispatch({ type: CHAT_VISIBLE, payload: 'off' })
	}
};

export const decreaseNudgeCount = (key, uid, count) => {
	var newNudgeCount = count - 1
	firebase.database().ref(`nudges/${key}`).update({
		[uid]: newNudgeCount
	});
	return async (dispatch) => {
		await dispatch({
			type: DECREASE_NUDGE_COUNT
		})
	}
} 