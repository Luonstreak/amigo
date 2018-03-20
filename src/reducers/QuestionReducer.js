import { 
	GAME_CREATED,
	QUESTION_CHOSEN,
	FETCH_FIVE,
	FETCH_SCORE,
	ADDED_ANSWER,
	GOT_RESULT,
	STATUS_UPDATE,
	FETCH_CHOSEN_QUESTIONS,
	LOADING 
} from '../actions/types';

const INITIAL_STATE = {
	lastFive: null,
	gameKey: null,
	result: null,
	opponent: null,
	score: null,
	chosenQuestionArr: [],
	loading: false
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case QUESTION_CHOSEN:
			return { ...state, chosenQuestionArr: [...state.chosenQuestionArr, action.payload] }
		case GOT_RESULT:
			return { ...state, result: action.payload }
		case LOADING:
			return { ...state, loading: true }
		case FETCH_SCORE:
			return { ...state, score: action.payload }
		case FETCH_FIVE:
			return { ...state, lastFive: action.payload.five, gameKey: action.payload.gameKey, opponent: action.payload.opponent }
		case FETCH_CHOSEN_QUESTIONS:
			return { ...state, chosenQuestionArr: action.payload }
		case GAME_CREATED:
			return state
		case ADDED_ANSWER:
			return { ...state, lastFive: action.payload, loading: false }
		case STATUS_UPDATE:
			return state		
		default:
			return state;
		}
};