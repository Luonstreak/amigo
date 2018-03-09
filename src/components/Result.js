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
import Chat from './Chat';
import * as actions from '../actions';

class Result extends Component {

	renderColor = (userAnswer, opponentAnswer, option) => {
		if (userAnswer == option && opponentAnswer !== option) {
			return 'mediumseagreen'
		}
		else if (opponentAnswer == option && userAnswer !== option) {
			return 'tomato'
		}
		else if (userAnswer == option && opponentAnswer == option) {
			return 'mediumseagreen'
		}
		else {
			return '#0099FF'
		}
	}

	render() {
		const { opponent, result, gameKey, score } = this.props.game
		const { uid } = this.props.user
		return (
			<View style={styles.container}>
				<View style={styles.counter}>
					<Badge
						value={score ? score[uid] : 0}
						textStyle={{ color: '#F7E7B4' }}
						containerStyle={styles.badge}
					/>
					<Badge
						value={score ? score[opponent] : 0}
						textStyle={{ color: '#F7E7B4' }}
						containerStyle={styles.badge}
					/>
				</View>
				<ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
					<View style={styles.question}>
						<Text style={{ fontSize: 30 }}>{result.content}</Text>
					</View>
					<View style={styles.user}>
						<Badge
							value={`${opponent}'s answer was...`}
							textStyle={{ color: '#FFF', fontSize: 20 }}
							containerStyle={{ backgroundColor: '#F5D86B' }}
						/>
					</View>
					<View style={styles.options}>
						<Button
							title={result.choices.option1}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(result[uid], result[opponent], 'option1') }]}
						/>
						<Button
							title={result.choices.option2}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(result[uid], result[opponent], 'option2') }]}
						/>
						<Button
							title={result.choices.option3}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(result[uid], result[opponent], 'option3') }]}
						/>
						<Button
							title={result.choices.option4}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(result[uid], result[opponent], 'option4') }]}
						/>
					</View>
				</ScrollView>
				<Button
					rounded
					title="Continue"
					titleTextColor={'#F7F7F7'}
					backgroundColor={'#6DC066'}
					buttonStyle={{ width: 200, marginTop: 100 }}
					onPress={() => this.props.changeStatus('guess', uid, gameKey)}
				/>
				<Chat style={styles.chat} />
			</View>
		)
	}
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	//global
	container: {
		marginTop: 20,
		flex: 1,
		backgroundColor: '#DFE2E7'
	},
	//header
	counter: {
		height: 50,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#83D0CD',
		flexDirection: 'row'
	},
	badge: {
		padding: 10
	},
	//card
	card: {
		width: (width * .9),
		margin: (width * .05),
		backgroundColor: '#0D658D',
		padding: 20,
		borderRadius: 20
	},
	question: {
		marginBottom: 10,
		flex: 2,
		alignItems: 'center'
	},
	user: {
		marginBottom: 10,
		justifyContent: 'center'
	},
	options: {
		flex: 4,
		alignItems: 'center'
	},
	option: {
		backgroundColor: '#0099FF',
		width: 250,
		borderRadius: 10,
		margin: 10
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

export default connect(mapStateToProps, actions)(Result);