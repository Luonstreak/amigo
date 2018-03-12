// ABSOLUTE
import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';

// RELATIVE
import Login from './src/components/Login';
import Username from './src/components/Username';
import Dashboard from './src/components/Dashboard';
import Contacts from './src/components/Contacts';
import PlayerList from './src/components/PlayerList';
import Modal from './src/components/Modal';
import Result from './src/components/Result';
import Guess from './src/components/Guess';
import GuessResult from './src/components/GuessResult';
import Category from './src/components/Category';
import Question from './src/components/Question';
<<<<<<< HEAD
import AskBack from './src/components/AskBack';
import FacebookLogin from './src/components/FacebookLogin';
=======
import Profile from './src/components/Profile';
>>>>>>> lucio

const RouterComponent = () => {
	return (
		<Router sceneStyle={{ backgroundColor: '#FFF' }}>
			<Scene key='root' hideNavBar>
				<Scene key='auth'>
					<Scene key='login' component={Login} title='True Friends' hideNavBar initial />
				</Scene>
				<Scene key='username'>
					<Scene key='login2' component={Username} title='Enter Your Username' />
				</Scene>
				<Scene key='main'>
					<Scene key='dashboard' component={Dashboard} hideNavBar initial />
					<Scene key='playerList' component={PlayerList} title='Pick a friend' />
					<Scene key='categories' component={Category} />
					<Scene key='question' component={Question} />
					<Scene key='modal' component={Modal} hideNavBar />
					<Scene key='result' component={Result} hideNavBar />
					<Scene key='guess' component={Guess} leftTitle='Dashboard' onLeft={() => {Actions.main()}} />
					<Scene key='guessResult' component={GuessResult} leftTitle='Dashboard' onLeft={() => { Actions.main() }} />
<<<<<<< HEAD
					<Scene key='askBack' component={AskBack} />
=======
					<Scene key='profile' component={Profile} hideNavBar />
>>>>>>> lucio
				</Scene>
			</Scene>
		</Router>
	);
};

export default RouterComponent;