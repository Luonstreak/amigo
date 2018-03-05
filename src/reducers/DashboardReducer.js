import { GAMES_FETCHED, NEW_GAME } from '../actions/types';


const INITIAL_STATE = {
	games: null,
	newGame: false
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GAMES_FETCHED:
			return { ...state, games: action.payload }
		case NEW_GAME:
			return { ...state, newGame: true }
		default:
			return state;
	}
};