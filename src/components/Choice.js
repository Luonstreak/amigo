import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ScrollView,
	TextInput
} from 'react-native';
import { Button, Badge } from 'react-native-elements';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Choice extends Component {

	render() {
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
					<View style={styles.user_answer}>
						<Text style={{ fontSize: 20 }}>Michael's answer was..</Text>
					</View>
					<View style={styles.options}>
						<Button
							title={this.props.question.selectedQuestion.choices.option1}
							buttonStyle={styles.option}
							onPress={() => { alert('you chose option 1') }}
						/>
						<Button
							title={this.props.question.selectedQuestion.choices.option2}
							buttonStyle={styles.option}
							onPress={() => { alert('you chose option 2') }}
						/>
						<Button
							title={this.props.question.selectedQuestion.choices.option3}
							buttonStyle={[styles.option, { backgroundColor: '#FB0068' }]}
							onPress={() => { alert('you chose option 3') }}
						/>
						<Button
							title={this.props.question.selectedQuestion.choices.option4}
							buttonStyle={[styles.option, { backgroundColor: '#6DC066' }]}
							onPress={() => { alert('you chose option 4') }}
						/>
					</View>

				</ScrollView>
				<View style={styles.choose_card}>
					<Button
						title={'ASK BACK'}
						buttonStyle={styles.choose_button}
						onPress={() => { alert('you asked back') }}
					/>
					<Button
						title={'NEW QUESTION'}
						buttonStyle={styles.choose_button}
						onPress={() => { alert('go to categories') }}
					/>
				</View>
				<View style={styles.chat}>
					<Text>CHAT</Text>
					<TextInput
						value={"hello!"}
						style={styles.input}
						onTextChange={() => alert('chat not available yet!')}
					/>
				</View>
			</View>
		);
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
		marginTop: 20,
		marginBottom: 0,
		padding: 20,
		borderRadius: 10
	},
	header: {
		flex: 2,
		alignItems: 'center'
	},
	user_answer: {
		flex: 1,
		marginTop: 20,
		marginBottom: 20,
		backgroundColor: '#F7E7B4',
		borderRadius: 5
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
	choose_card: {
		height: 50,
		backgroundColor: '#0D658D',
		flexDirection: 'row',
		margin: 30,
		marginTop: 20,
		marginBottom: 20,
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
		height: 100,
		backgroundColor: '#ADD8E6'
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

export default connect(mapStateToProps, actions)(Choice);