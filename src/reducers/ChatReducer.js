import { CHAT_VISIBLE } from '../actions/types';
const INITIAL_STATE = {
	chatVisible: 'off'
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHAT_VISIBLE:
			return { ...state, chatVisible: action.payload };
		default:
			return state;
	}
};