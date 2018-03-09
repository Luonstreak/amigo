import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TextInput,
	Dimensions
} from 'react-native';
import { Button, Badge, Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import _ from 'lodash';
//relative
import * as actions from '../actions';

class Modal extends Component {

	// componentWillMount() {
	// 	const { gameKey } = this.props.game
	// 	this.props.getResult(gameKey)
	// }
	renderColor = (userAnswer, opponentAnswer, option) => {
		if (userAnswer == option && opponentAnswer !== option) {
			return 'red'
		}
		else if (opponentAnswer == option && userAnswer !== option) {
			return 'green'
		}
		else if (userAnswer == option && opponentAnswer == option) {
			return 'green'
		}
		else {
			return '#0099FF'
		}
	}

	whereToRouteTo = () => {
		const { text, opponentAnswer, choice } = this.props;
		if (text) {
			if (text === 'win') {
				Actions.guessResult({ text, choice })
			} else {
				Actions.guessResult({ text, opponentAnswer, choice })
			}
		} else {
			Actions.result()
		}
	}

	render() {
		const { opponent, result, gameKey } = this.props.game
		const { uid } = this.props.user
		return (
			<View style={styles.container}>
				<Avatar
					rounded
					xlarge
					avatarStyle={{ marginTop: 300, borderWidth: 10, borderColor: result.result ? '#6DC066' : '#FF4444' }}
					source={{ uri: 'https://pbs.twimg.com/profile_images/764466597788614656/bw2IMmNk_400x400.jpg' }}
				/>
				<View style={styles.message}>
					<Text style={{ fontSize: 30, color: result.result ? '#6DC066' : '#FF4444' }}>{opponent} GOT IT</Text>
					<Text style={{ fontSize: 26, fontWeight: 'bold', color: result.result ? '#6DC066' : '#FF4444' }}>{result.result ? 'RIGHT' : 'WRONG'}</Text>
					<Button
						rounded
						title="Continue"
						titleTextColor={'#F7F7F7'}
						backgroundColor={result.result ? '#6DC066' : '#FF4444' }
						buttonStyle={{ width: 200, marginTop: 100 }}
						onPress={() => this.whereToRouteTo()}
					/>
				</View>
			</View>
		)
	}
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	//global
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000'
	},
	message: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	//footer - chat
	chat: {
		height: 50,
		marginTop: (width * .05),
		backgroundColor: '#ADD8E6',
	},
	input: {
		backgroundColor: '#96EAD7',
		margin: width * .05,
		borderRadius: 10,
		padding: 10
	},
});

const mapStateToProps = state => {
	return { game: state.game, user: state.login.user };
};

export default connect(mapStateToProps, actions)(Modal);