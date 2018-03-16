// RELATIVE
import { 
	EMAIL_INPUT, 
	PASSWORD_INPUT, 
	LOGIN_SUCCESS, 
	LOGIN_FAIL,  
	RESET_ERROR,
	USERNAME_INPUT,
	REGISTER_SUCCESS 
} from '../actions/types';

const INITIAL_STATE = {
	email: 'michael@top.com',
	password: 'password',
	user: null,
	username: '',
	error: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EMAIL_INPUT:
			return { ...state, email: action.payload, error: null };
		case PASSWORD_INPUT:
			return { ...state, password: action.payload, error: null };
		case LOGIN_SUCCESS:
			return { ...state, user: action.payload };
		case USERNAME_INPUT:
			return { ...state, username: action.payload };
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