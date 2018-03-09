import React, {Component,} from 'react';
import {
    View,
    Text,
    BackHandler,
    ToastAndroid,
} from 'react-native';

class BackButtonDemo extends Component {
    componentDidMount() {
			BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
			BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
			return true;
    }

    render() {
			return (
				<View>
					<Text>Back button example</Text>
				</View>
			);
    }
}

module.exports = BackButtonDemo;