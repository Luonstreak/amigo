// RELATIVE
import { 
	EMAIL_INPUT, 
	PASSWORD_INPUT, 
	LOGIN_SUCCESS, 
	LOGIN_FAIL, 
	GAMES_FETCHED, 
	RESET_ERROR,
	REGISTER_SUCCESS 
} from '../actions/types';

const INITIAL_STATE = {
	email: '',
	password: '',
	user: null,
	games: null,
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
		case REGISTER_SUCCESS:
			return { ...state, user: action.payload };
		case LOGIN_FAIL:
			return { ...state, error: action.payload };
		case GAMES_FETCHED:
			return { ...state, games: action.payload };
		case RESET_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
};