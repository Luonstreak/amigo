// ABSOLUTE
import { combineReducers } from 'redux';

// RELATIVE
import LoginReducer from './LoginReducer';
import UsernameReducer from './UsernameReducer';
import PlayerListReducer from './PlayerListReducer';
import CategoryReducer from './CategoryReducer';
import DashboardReducer from './DashboardReducer';

export default combineReducers({
	login: LoginReducer,
	username: UsernameReducer,
	player: PlayerListReducer,
	question: CategoryReducer,
	dash: DashboardReducer
});
