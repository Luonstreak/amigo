// RELATIVE
import {
	LOGIN_SUCCESS, 
	LOGIN_FAIL,  
	RESET_ERROR,
	REGISTER_SUCCESS 
} from '../actions/types';

const INITIAL_STATE = {
	user: null,
	username: '',
	error: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case LOGIN_SUCCESS:
			return { ...state, user: action.payload };
		case REGISTER_SUCCESS:
			return { ...state, user: action.payload };
		case LOGIN_FAIL:
			return { ...state, error: action.payload };
		case RESET_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
};