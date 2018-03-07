// ABSOLUTE
import { combineReducers } from 'redux';

// RELATIVE
import LoginReducer from './LoginReducer';
import UsernameReducer from './UsernameReducer';
import PlayerListReducer from './PlayerListReducer';
import QuestionReducer from './QuestionReducer';

export default combineReducers({
	login: LoginReducer,
	username: UsernameReducer,
	player: PlayerListReducer,
	game: QuestionReducer
});
