// RELATIVE
import { FETCH_BLOCKED_USERS, UNBLOCKED_USER } from '../actions/types';

INITIAL_STATE = {
	blockedUsers: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FETCH_BLOCKED_USERS:
			return {...state, blockedUsers: action.payload};
		case UNBLOCKED_USER:
			return state;
		default:
			return state;
	}
}