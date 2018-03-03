import { GAMES_FETCHED} from '../actions/types';


const INITIAL_STATE = {
	games: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GAMES_FETCHED:
			return { ...state, games: action.payload }
		default:
			return state;
	}
};