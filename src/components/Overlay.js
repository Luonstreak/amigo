import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ScrollView,
	TextInput
} from 'react-native';
import { Button, Badge, Avatar } from 'react-native-elements';

export default class App extends Component {
	state = { color: '#6DC066', string: 'RIGHT' }

	componentWillMount() {
		if (this.props.type === 'win') {
			this.setState({ color: '#6DC066', string: 'RIGHT' })
		}	else {
			this.setState({ color: '#FF4444', string: 'WRONG' })
		}
	}
	
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Avatar
						rounded
						xlarge
						avatarStyle={{ borderWidth: 10, borderColor: this.state.color }}
						source={{ uri: 'https://pbs.twimg.com/profile_images/764466597788614656/bw2IMmNk_400x400.jpg' }}
					/>
				</View>
				<View style={styles.message}>
					<Text style={{ fontSize: 30, color: '#F7F7F7' }}>LEGO GOT IT</Text>
					<Text style={{ fontSize: 26, fontWeight: 'bold', color: this.state.color }}>{this.state.string}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#191919',
		// backgroundColor: 'rgba(25,25,25,0.8)',
		paddingTop: 30
	},
	header: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	message: {
		flex: 1,
		alignItems: 'center',
		paddingLeft: 50,
		paddingRight: 50
	}
});