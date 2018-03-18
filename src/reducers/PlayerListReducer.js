// RELATIVE
import { SAVE_NUMBERS, PLAYER_SELECTED } from '../actions/types';

const INITIAL_STATE = {
	selectedPlayer: null,
	numbers: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PLAYER_SELECTED:
			return { ...state, selectedPlayer: action.payload };
		case SAVE_NUMBERS:
			return { ...state, numbers: action.payload };
		default:
			return state;
	}
};