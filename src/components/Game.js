import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ScrollView,
	TextInput,
} from 'react-native';
import { Button, Badge } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Chat from './Chat';
import Overlay from './Overlay';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Game extends Component {

	state  = {
		chatHeight: 100,
		chooseCardVisible: false,
		layer: 'overlay'
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ layer: 'game' })
		}, 2000);
	}
	

	renderChoice = () => {
		if (this.state.chooseCardVisible) {
			return (
				<View style={styles.chooseCard}>
					<Button
						title={'ASK BACK'}
						buttonStyle={styles.choose_button}
						onPress={() => { Actions.dashboard() }}
					/>
					<Button
						title={'NEW QUESTION'}
						buttonStyle={styles.choose_button}
						onPress={() => { Actions.categories()}}
					/>
				</View>
			)
		} 
		return null
	}

	renderLayer = () => {
		if (this.state.layer === 'overlay') {
			return <Overlay type={'loose'}/>
		} else {
			return (
				<View style={styles.container}>
					<View style={styles.counter}>
						<Badge
							value={'user 1'}
							textStyle={{ color: '#F7E7B4' }}
							containerStyle={styles.badge}
						/>
						<Badge
							value={'user 2'}
							textStyle={{ color: '#F7E7B4' }}
							containerStyle={styles.badge}
						/>
					</View>
					<ScrollView
						style={styles.card}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.header}>
							<Text style={{ fontSize: 30 }}>{this.props.question.selectedQuestion.content}</Text>
						</View>
						<View style={styles.user}>
							<Badge
								value={'Michael\'s answer was...'}
								textStyle={{ color: '#FFF', fontSize: 20 }}
								containerStyle={{ backgroundColor: '#F5D86B' }}
							/>
						</View>
						<View style={styles.options}>
							<Button
								title={this.props.question.selectedQuestion.choices.option1}
								buttonStyle={styles.option}
							/>
							<Button
								title={this.props.question.selectedQuestion.choices.option2}
								buttonStyle={styles.option}
							/>
							<Button
								title={this.props.question.selectedQuestion.choices.option3}
								buttonStyle={[styles.option, { backgroundColor: '#FB0068' }]}
							/>
							<Button
								title={this.props.question.selectedQuestion.choices.option4}
								buttonStyle={[styles.option, { backgroundColor: '#6DC066' }]}
								onPress={() => {

									this.setState({ chatHeight: this.state.chatHeight === 50 ? 100 : 50, chooseCardVisible: !this.state.chooseCardVisible })
								}}
							/>
						</View>

					</ScrollView>
					{this.renderChoice()}
					<Chat style={styles.chat} height={this.state.chatHeight} />
				</View>
			);
		}
	}

	render() {
		return this.renderLayer()
	}
}

const styles = StyleSheet.create({
	//global
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#DFE2E7',
		paddingTop: 30
	},
	//overlay
	overlay: {
		position: 'absolute'
	},
	//header
	counter: {
		height: 50,
		justifyContent: 'space-between',
		paddingLeft: 30,
		paddingRight: 30,
		alignItems: 'center',
		backgroundColor: '#83D0CD',
		flexDirection: 'row'
	},
	badge: {
		padding: 10
	},
	//card
	card: {
		flex: 6,
		backgroundColor: '#0D658D',
		margin: 30,
		marginBottom: 10,
		padding: 20,
		borderRadius: 20
	},
	header: {
		flex: 2,
		alignItems: 'center'
	},
	user: {
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
	// lower card
	chooseCard: {
		height: 50,
		backgroundColor: '#0D658D',
		flexDirection: 'row',
		margin: 30,
		marginTop: 0,
		marginBottom: 0,
		borderRadius: 10,
		justifyContent: 'space-around',
		alignItems: 'center'

	},
	choose_button: {
		margin: 10,
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 10,
		backgroundColor: '#0099FF'
	},
	//footer - chat
	chat: {
		marginTop: 10,
		backgroundColor: '#ADD8E6',
	},
	input: {
		backgroundColor: '#96EAD7',
		margin: 10,
		borderRadius: 10,
		padding: 10
	},
});

const mapStateToProps = state => {
	console.log(state.question)
	return { question: state.question }
}

export default connect(mapStateToProps, actions)(Game);