import firebase from 'firebase';
import { CHAT_VISIBLE } from './types';

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

