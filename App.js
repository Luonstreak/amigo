import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reducers from './src/reducers';
import Router from './router';

export default class App extends React.Component {
	
	componentWillMount() {
		const config = {
			apiKey: "AIzaSyDhsME9QEyPei2DVk5jwdyo7xcqGx3VKwM",
			authDomain: "amigo-mio.firebaseapp.com",
			databaseURL: "https://amigo-mio.firebaseio.com",
			projectId: "amigo-mio",
			storageBucket: "amigo-mio.appspot.com",
			messagingSenderId: "426353750740"
		};
		firebase.initializeApp(config);
	}
	

  render() {
		const composeEnhancers = composeWithDevTools;
		const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(ReduxThunk)));

    return (
			<Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

