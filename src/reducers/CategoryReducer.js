import { QUESTION_CHOSEN } from '../actions/types';
import { Actions } from 'react-native-router-flux';


const INITIAL_STATE = {
	selectedQuestion: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case QUESTION_CHOSEN:
			return { ...state, selectedQuestion: action.payload }
		default:
			return state;
	}
};