// RELATIVE
import { ABUSE_REPORTED } from '../actions/types';
 
INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ABUSE_REPORTED:
			return state
		default:
			return state;
	}
}