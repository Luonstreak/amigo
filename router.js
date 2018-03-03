// ABSOLUTE
import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';

// RELATIVE
import Login from './src/components/Login';
import Username from './src/components/Username';
import Dashboard from './src/components/Dashboard';
import PlayerList from './src/components/PlayerList';
import Category from './src/components/Category';
import Game from './src/components/Game';

const RouterComponent = () => {
	return (
		<Router sceneStyle={{ backgroundColor: '#FFF' }}>
			<Scene key='root' hideNavBar>
				<Scene key='auth'>
					<Scene key='login' component={Login} title='True Friends' initial />
				</Scene>
				<Scene key='username'>
					<Scene key='login2' component={Username} title='Enter Your Username' />
				</Scene>
				<Scene key='main' hideNavBar>
					<Scene
						key='dashboard'
						component={Dashboard}
						initial
					/>
					<Scene key='playerList' component={PlayerList} title='Pick a friend' />
					<Scene key='categories' component={Category} title='Pick a Question' />
					<Scene key='game' component={Game} hideNavBar />
				</Scene>
				{/* <Scene key='start'>
					<Scene key='lobby' component={Lobby} title='Lobby Time' />
					<Scene key='game' component={Game} title='Game Time' />
				</Scene> */}
			</Scene>
		</Router>
	);
};

export default RouterComponent;