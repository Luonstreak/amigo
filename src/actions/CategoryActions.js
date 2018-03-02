// ABSOLUTE
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

// RELATIVE
import { QUESTION_CHOSEN } from './types';


export const fetchQuestion = (id) => {
	console.log('fetchQ', id)
	const num = Math.floor(Math.random() * 2) + 1
	console.log(num)
	const ref = firebase.database().ref(`questions/${id}/${id}${num}`);
	return(dispatch) => {
		ref.once('value', snap => {
			console.log(snap.val())
			dispatch({ type: QUESTION_CHOSEN, payload: snap.val()})
		})
	}
}