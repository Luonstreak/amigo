// ABSOLUTE
import { combineReducers } from 'redux';

// RELATIVE
import LoginReducer from './LoginReducer';
import PhoneAuthReducer from './PhoneAuthReducer';
import DashboardReducer from './DashboardReducer';
import PlayerListReducer from './PlayerListReducer';
import QuestionReducer from './QuestionReducer';
import ReportAbuseReducer from './ReportAbuseReducer';
import SettingsReducer from './SettingsReducer';

export default combineReducers({
	login: LoginReducer,
	phone: PhoneAuthReducer,
	dash: DashboardReducer,
	player: PlayerListReducer,
	game: QuestionReducer,
	abuse: ReportAbuseReducer,
	settings: SettingsReducer
});
