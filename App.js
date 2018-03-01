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
			apiKey: "AIzaSyDNjiMyWFbINDmGrCvpvfXy9WEVlm5ICaA",
			authDomain: "friend-ec2f8.firebaseapp.com",
			databaseURL: "https://friend-ec2f8.firebaseio.com",
			projectId: "friend-ec2f8",
			storageBucket: "friend-ec2f8.appspot.com",
			messagingSenderId: "928170995322"
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

