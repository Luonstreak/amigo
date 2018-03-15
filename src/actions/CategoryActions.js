import firebase from 'firebase';
import { GET_CATEGORIES } from './types';

export const getCategories = () => {
	const { currentUser } = firebase.auth()
	return (dispatch) => {
		firebase.database().ref(`categories/${currentUser.uid}`).once('value', async snap => {
			await dispatch({ type: GET_CATEGORIES, payload: snap.val() })
			console.log('new points', snap.val())
		})
	}
};