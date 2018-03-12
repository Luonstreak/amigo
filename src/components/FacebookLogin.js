// ABSOLUTE
import React, { Component } from 'react';
import { Text, View, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

// RELATIVE
import * as actions from '../actions';

class FacebookLogin extends Component {
	componentDidMount() {
		// this.props.fbLogin();
		// AsyncStorage.removeItem('fbToken');
	}

	loginwithFacebook = () => {
		this.props.fbLogin();
	}

	render() {
		return (
			<View style={{ marginTop: 50 }}>
				<Text>Welcome to amigoO!</Text>
				<Button
					title='Login with Facebook'
					backgroundColor='#3b5998'
					onPress={this.loginwithFacebook}
				/>
			</View>
		)
	}
}

export default connect(null, actions)(FacebookLogin);