// ABSOLUTE
import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';

// RELATIVE
import Login from './src/components/Login';
import Username from './src/components/Username';
import Dashboard from './src/components/Dashboard';
import Contacts from './src/components/Contacts';
import PlayerList from './src/components/PlayerList';
// import Result from './src/components/Result';
import Category from './src/components/Category';
import Question from './src/components/Question';
import Guess from './src/components/Guess';
import Response from './src/components/Response';

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
					<Scene
						key='dashboard'
						component={Dashboard}
						initial
					/>
					<Scene key='playerList' component={PlayerList} title='Pick a friend' />
					<Scene key='categories' component={Category} title='Pick a Question' />
					<Scene key='question' component={Question} />
					<Scene key='response' component={Response} />
					<Scene key='guess' component={Guess} />
					{/* <Scene key='result' component={Result} /> */}
				</Scene>
			</Scene>
		</Router>
	);
};

export default RouterComponent;