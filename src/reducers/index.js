// ABSOLUTE
import { combineReducers } from 'redux';

// RELATIVE
import LoginReducer from './LoginReducer';
import UsernameReducer from './UsernameReducer';
import PhoneAuthReducer from './PhoneAuthReducer';
import PlayerListReducer from './PlayerListReducer';
import QuestionReducer from './QuestionReducer';
import ChatReducer from './ChatReducer';
import ProfileReducer from './ProfileReducer';

export default combineReducers({
	login: LoginReducer,
	username: UsernameReducer,
	phone: PhoneAuthReducer,
	player: PlayerListReducer,
	game: QuestionReducer,
	chat: ChatReducer,
	profile: ProfileReducer
});
