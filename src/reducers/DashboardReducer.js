import {
	USER_FETCH,
	FRIENDS_FETCH,
	RESET_GAME_KEY,
	GET_CATEGORIES,
	CHAT_VISIBLE,
	DECREASE_NUDGE_COUNT,
	SAVE_CONTACTS
} from '../actions/types';

const INITIAL_STATE = {
	info: null,
	friends: null,
	gameKey: null,
	categories: null,
	chatVisible: 'off',
	contact: null,
	chosenQuestionArr: []
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case USER_FETCH:
			return { ...state, info: action.payload };
		case FRIENDS_FETCH:
			return { ...state, friends: action.payload };
		case CHAT_VISIBLE:
			return { ...state, chatVisible: action.payload };
		case GET_CATEGORIES:
			return { ...state, categories: action.payload };
		case RESET_GAME_KEY:
			return { ...state, gameKey: null, chosenQuestionArr: [] }
		case SAVE_CONTACTS:
			return { ...state, contacts: action.payload }
		case DECREASE_NUDGE_COUNT:
			return state
		default:
			return state;
	}
};