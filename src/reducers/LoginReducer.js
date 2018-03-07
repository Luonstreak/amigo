// RELATIVE
import { EMAIL_INPUT, PASSWORD_INPUT, LOGIN_SUCCESS, LOGIN_FAIL, GAMES_FETCHED } from '../actions/types';

const INITIAL_STATE = {
	email: 'michael@top.com',
	password: 'password',
	user: null,
	games: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EMAIL_INPUT:
			return { ...state, email: action.payload };
		case PASSWORD_INPUT:
			return { ...state, password: action.payload };
		case LOGIN_SUCCESS:
			return { ...state, user: action.payload };
		case LOGIN_FAIL:
			console.log('fail');
			return state
		case GAMES_FETCHED:
			return { ...state, games: action.payload }
		default:
			return state;
	}
};