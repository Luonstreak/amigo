import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ScrollView,
	FlatList,
	TextInput,
	Dimensions
} from 'react-native';
import { Button, Badge } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Chat from './Chat';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';

class GuessResult extends Component {
	state = {
		chatHeight: 100
	}

	renderColor = (option) => {
		if (this.props.choice === option) {
			return 'green' 
		}
		if (this.props.opponentAnswer === option) {
			return 'red' 
		}
		else { 
			return '#0099FF'
		}
	}

	renderCard = (item) => {
		const { opponent } = this.props.game
		if (this.props.text == 'win') {
			return (
				<ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
				<View style={styles.question}>
					<Text style={{ fontSize: 30 }}>{item.value.content}</Text>
				</View>
				<View style={styles.user}>
					<Badge
						value={'Michael\'s answer was...'}
						textStyle={{ color: '#FFF', fontSize: 20 }}
						containerStyle={{ backgroundColor: '#F5D86B' }}
						/>
					<Badge
						value='You guessed right!'
						textStyle={{ color: 'green', fontSize: 20 }}
						containerStyle={{ backgroundColor: '#F5D86B' }}
						/>
				</View>
				<View style={styles.options}>
					<Button
						title={item.value.choices.option1}
						buttonStyle={[styles.option, {backgroundColor: this.renderColor('option1')}]}
						onPress={() => { this.select(1, item.key, item.value[opponent]) }}
						/>
					<Button
						title={item.value.choices.option2}
						buttonStyle={[styles.option, { backgroundColor: this.renderColor('option2') }]}
						onPress={() => { this.select(2, item.key, item.value[opponent]) }}
						/>
					<Button
						title={item.value.choices.option3}
						buttonStyle={[styles.option, { backgroundColor: this.renderColor('option3') }]}
						onPress={() => { this.select(3, item.key, item.value[opponent]) }}
						/>
					<Button
						title={item.value.choices.option4}
						buttonStyle={[styles.option, { backgroundColor: this.renderColor('option4') }]}
						onPress={() => { this.select(4, item.key, item.value[opponent]) }}
						/>
				</View>
			</ScrollView>
			)
		}
		else {
			return (
				<ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
					<View style={styles.question}>
						<Text style={{ fontSize: 30 }}>{item.value.content}</Text>
					</View>
					<View style={styles.user}>
						<Badge
							value={'Michael\'s answer was...'}
							textStyle={{ color: '#FFF', fontSize: 20 }}
							containerStyle={{ backgroundColor: '#F5D86B' }}
						/>
						<Badge
							value='You guessed wrong!'
							textStyle={{ color: 'red', fontSize: 20 }}
							containerStyle={{ backgroundColor: '#F5D86B' }}
						/>
					</View>
					<View style={styles.options}>
						<Button
							title={item.value.choices.option1}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor('option1') }]}
							onPress={() => { this.select(1, item.key, item.value[opponent]) }}
						/>
						<Button
							title={item.value.choices.option2}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor('option2') }]}
							onPress={() => { this.select(2, item.key, item.value[opponent]) }}
						/>
						<Button
							title={item.value.choices.option3}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor('option3') }]}
							onPress={() => { this.select(3, item.key, item.value[opponent]) }}
						/>
						<Button
							title={item.value.choices.option4}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor('option4') }]}
							onPress={() => { this.select(4, item.key, item.value[opponent]) }}
						/>
					</View>
				</ScrollView>
			)

		}
	}

	render() {
			const data = this.props.lastFive;
			console.log('data', data)
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
				<FlatList
					horizontal
					pagingEnabled={true}
					getItemLayout={(data, index) => ({ length: (width), offset: width * index, index })}
					keyExtractor={(item, index) => item.id}
					initialScrollIndex={data.length - 1}
					showsHorizontalScrollIndicator={false}
					data={data}
					renderItem={({ item }) => this.renderCard(item)}
				/>
				<View style={styles.chooseCard}>
					<Button
						title={'ASK BACK'}
						buttonStyle={styles.choose_button}
						onPress={() => { Actions.dashboard() }}
					/>
					<Button
						title={'NEW QUESTION'}
						buttonStyle={styles.choose_button}
						onPress={() => { Actions.categories() }}
					/>
				</View>
				<Chat style={styles.chat} height={this.state.chatHeight} />
			</View>
		)
	}
}
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	//global
	container: {
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
		flex: 1,
		maxWidth: (width * .90),
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
	const arr = []
	_.forIn(state.game.lastFive, (value, key) => {
		arr.push({ key, value })
	})
	return { lastFive: arr, game: state.game };
};

export default connect(mapStateToProps, actions)(GuessResult);
