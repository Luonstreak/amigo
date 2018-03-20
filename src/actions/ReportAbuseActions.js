// ABSOLUTE
import firebase from 'firebase';

// RELATIVE
import { ABUSE_REPORTED } from './types';
import { Actions } from 'react-native-router-flux';

export const reportUser = (gameKey, opponent, uid, reason, name, photo) => {
	if (reason) {
		firebase.database().ref(`abuseReports/${gameKey}/${uid}`).update({
			abuser: opponent,
			reason
		})
	}
	firebase.database().ref(`blockedUsers/${uid}/${gameKey}`).update({  
		opponent,
		name,
		photo
	})
	firebase.database().ref(`users/${opponent}/games/${gameKey}`).update({  
		blocked: true
	})
	firebase.database().ref(`users/${uid}/games/${gameKey}`).update({  
		blocked: true
	})
	return (dispatch) => {
		dispatch({
			type: ABUSE_REPORTED
		})
		Actions.main()
	};
};