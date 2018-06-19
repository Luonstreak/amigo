// RELATIVE
import { PLAYER_SELECTED, FETCHED_OPPONENT_NAME_AND_PHOTO, SAVE_NUMBERS } from '../actions/types';

const INITIAL_STATE = {
	selectedPlayer: null,
	info: null,
	numbers: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PLAYER_SELECTED:
			return { ...state, selectedPlayer: action.payload };
		case FETCHED_OPPONENT_NAME_AND_PHOTO:
			return { ...state, info: action.payload };
		case SAVE_NUMBERS:
			return { ...state, numbers: action.payload };
		default:
			return state;
	}
};