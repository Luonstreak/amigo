// RELATIVE
import { PHONE_INPUT, PHONE_SAVE } from '../actions/types';

const INITIAL_STATE = {
	phoneNumber: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PHONE_INPUT:
			return { ...state, phoneNumber: action.payload };
		case PHONE_SAVE:
			return { ...state, phoneNumber: action.payload };
		default:
			return state;
	}
}