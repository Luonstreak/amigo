import { GET_USER } from './types';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

export const getUser = (data) => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		firebase.database().ref(`users/${data}`).on('value', async snap => {
			var obj = {}
			var list = [];
			_.forEach(snap.val().games,(value, key) => {
				var opponent = value.player1 !== currentUser.uid ? value.player1 : value.player2;
				firebase.database().ref(`games/${key}`).on('value', snap => {
					list.push({ name: opponent, rank: snap.numChildren() })
				})
			});
			obj['username'] = snap.val().username;
			obj['games'] = list;
			await dispatch({ type: GET_USER, payload: obj })
			Actions.profile()
		})
	};
};