import { 
	QUESTION_CHOSEN, 
	GAME_CREATED, 
	FETCH_FIVE, 
	RESET_GAME_KEY, 
	ADDED_ANSWER,
	GOT_RESULT,
	STATUS_UPDATE 
} from '../actions/types';
import { Actions } from 'react-native-router-flux';


const INITIAL_STATE = {
	selectedQuestion: null,
	lastFive: null,
	gameKey: null,
	opponent: null,
	result: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case QUESTION_CHOSEN:
			return { ...state, selectedQuestion: action.payload }
		case GAME_CREATED:
			return state
		case ADDED_ANSWER:
			return state
		case STATUS_UPDATE:
			return state
		case GOT_RESULT:
			return { ...state, result: action.payload }
		case FETCH_FIVE:
			return { ...state, lastFive: action.payload.five, gameKey: action.payload.gameKey, opponent: action.payload.opponent }
		case RESET_GAME_KEY:
			return { ...state, gameKey: null }
		default:
			return state;
		}
};