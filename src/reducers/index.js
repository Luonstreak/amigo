// ABSOLUTE
import { combineReducers } from 'redux';

// RELATIVE
import LoginReducer from './LoginReducer';
import UsernameReducer from './UsernameReducer';
import PlayerListReducer from './PlayerListReducer';
import GameReducer from './GameReducer';

export default combineReducers({
	login: LoginReducer,
	username: UsernameReducer,
	player: PlayerListReducer,
	game: GameReducer
});
