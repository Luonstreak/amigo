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
import Overlay from './Overlay';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';

class Guess extends Component {

	state = {
		chatHeight: 100
	}

	renderCard = (item) => {
		return (
			<ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
				<View style={styles.question}>
					<Text style={{ fontSize: 30 }}>{'Sample question, sample question, sample question'}</Text>
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
						title={'option1'}
						buttonStyle={styles.option}
						onPress={() => alert('option1')}
					/>
					<Button
						title={'option2'}
						buttonStyle={styles.option}
						onPress={() => alert('option2')}
					/>
					<Button
						title={'option3'}
						buttonStyle={styles.option}
						onPress={() => alert('option3')}
					/>
					<Button
						title={'option4'}
						buttonStyle={styles.option}
						onPress={() => alert('option4')}
					// onPress={() => {
					// 	this.setState({ chatHeight: this.state.chatHeight === 50 ? 100 : 50, chooseCardVisible: !this.state.chooseCardVisible })
					// }}
					/>
				</View>
			</ScrollView>
			)
		}

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
				<FlatList
					horizontal
					pagingEnabled={true}
					getItemLayout={(data, index) => ({ length: (width), offset: width * index, index })}
					keyExtractor={(item, index) => item.id}
					initialScrollIndex={4}
					showsHorizontalScrollIndicator={false}
					data={[{}, {}, {}, {}, {}]}
					renderItem={({ item }) => this.renderCard(item)}
				/>
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
		backgroundColor: '#DFE2E7',
		paddingTop: 30
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

export default connect(null, actions)(Guess);