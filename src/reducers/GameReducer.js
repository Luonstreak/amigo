import { QUESTION_CHOSEN, GAME_CREATED, FETCH_FIVE } from '../actions/types';
import { Actions } from 'react-native-router-flux';


const INITIAL_STATE = {
	selectedQuestion: null,
	lastFive: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case QUESTION_CHOSEN:
			return { ...state, selectedQuestion: action.payload }
		case GAME_CREATED:
			return state
		case FETCH_FIVE:
			return { ...state, lastFive: action.payload }
		default:
			return state;
		}
};