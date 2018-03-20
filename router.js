// ABSOLUTE
import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';

// RELATIVE
import Login from './src/components/Login';
import Register from './src/components/Register';
import ForgotPassword from './src/components/ForgotPassword';
import PhoneAuth from './src/components/PhoneAuth';
import CodeInput from './src/components/CodeInput';
import Dashboard from './src/components/Dashboard';
import ContactList from './src/components/ContactList';
import Modal from './src/components/Modal';
import Result from './src/components/Result';
import Guess from './src/components/Guess';
import GuessResult from './src/components/GuessResult';
import Category from './src/components/Category';
import Question from './src/components/Question';
import AskBack from './src/components/AskBack';
import Profile from './src/components/Profile';
import Settings from './src/components/Settings';
import Splash from './src/components/Splash';
import ReportAbuse from './src/components/ReportAbuse';
import BlockedUsers from './src/components/BlockedUsers';

const RouterComponent = () => {
	return (
		<Router sceneStyle={{ backgroundColor: '#FFF' }}>
			<Scene key='root' hideNavBar>
				<Scene key='auth'>
					<Scene key='splash' component={Splash} title='True Friends' hideNavBar initial />
					<Scene key='login' component={Login} title='True Friends Login' hideNavBar />
					<Scene key='register' component={Register} title='True Friends Register' hideNavBar />
					<Scene key='forgotPassword' component={ForgotPassword} hideNavBar />
				</Scene>
				<Scene key='phoneAuth'>
					<Scene key='phoneInput' component={PhoneAuth} title='Enter Your Phone Number' hideNavBar initial />
					{/* <Scene key='codeInput' component={CodeInput} title='Enter Your Code' /> */}
				</Scene>
				<Scene key='main'>
					<Scene key='dashboard' component={Dashboard} hideNavBar initial />
					<Scene key='contactList' component={ContactList} title='Pick a friend' />
					<Scene key='categories' component={Category} />
					<Scene key='question' component={Question} />
					<Scene key='modal' component={Modal} hideNavBar />
					<Scene key='result' component={Result} hideNavBar />
					<Scene key='guess' component={Guess} leftTitle='Dashboard' onLeft={() => {Actions.main()}} />
					<Scene key='guessResult' component={GuessResult} leftTitle='Dashboard' onLeft={() => { Actions.main() }} />
					<Scene key='reportAbuse' component={ReportAbuse} onLeft={() => { Actions.pop() }} title='Choose a Reason'/>
					<Scene key='askBack' component={AskBack} />
					<Scene key='profile' component={Profile} hideNavBar />
					<Scene key='settings' component={Settings} title='SETTINGS' />
					<Scene key='blockedUsers' component={BlockedUsers} onLeft={() => { Actions.pop() }} title='Blocked Users' />
				</Scene>
			</Scene>
		</Router>
	);
};

export default RouterComponent;