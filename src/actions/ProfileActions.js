import { GET_USER } from './types';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

export const getUser = (data) => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		firebase.database().ref(`users/${data}`).on('value', async snapshot => {
			var obj = {}, list = [], friends = 0, top = [], rest = [];
			_.forEach(snapshot.val().games, async (value, key) => {
				friends += 1
				var opponent = value.player1 !== currentUser.uid ? value.player1 : value.player2;
				await firebase.database().ref(`users/${opponent}`)
					.on('value', userSnap => {
						opponent = userSnap.val().username
						obj['photo'] = userSnap.val().photo
					})
				firebase.database().ref(`games/${key}`)
				.on('value', rankSnap => list.push({ opponent, rank: rankSnap.numChildren()}))
			})
			obj['username'] = snapshot.val().username;
			obj['games'] = list;
			obj['friends'] = friends;
			await dispatch({ type: GET_USER, payload: obj })
			Actions.profile()
		})
	};
};