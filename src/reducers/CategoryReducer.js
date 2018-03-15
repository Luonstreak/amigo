// RELATIVE
import { GET_CATEGORIES } from '../actions/types';

const INITIAL_STATE = {
	categories: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_CATEGORIES:
			return { ...state, categories: action.payload };
		default:
			return state;
	}
}