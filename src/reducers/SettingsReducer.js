// RELATIVE
import { FETCH_BLOCKED_USERS, UNBLOCKED_USER, ABUSE_REPORTED } from '../actions/types';

INITIAL_STATE = {
	blockedUsers: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FETCH_BLOCKED_USERS:
			return {...state, blockedUsers: action.payload};
		case UNBLOCKED_USER:
			return state;
		case ABUSE_REPORTED:
			return state
		default:
			return state;
	}
}