import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Dimensions,
	ImageBackground
} from 'react-native';
import { Button, Badge, Icon, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Actions } from "react-native-router-flux";
import { LinearGradient } from 'expo';

import colors from '../styles/colors';
import Chat from './Chat';
import * as actions from '../actions';

class AskBack extends Component {

	select = (num, questionNumber) => {
		const { gameKey, opponent } = this.props.game
		this.props.saveAnswer(num, questionNumber, opponent, gameKey)
	}

	renderCard = () => {
		const { content, choices, questionNumber } = this.props.prevQ.value
		return (
			<ScrollView
				style={styles.card}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.question}>
					<Text style={{ fontSize: 30 }}>{content}</Text>
				</View>
				<View style={styles.user}>
					<Badge
						value={'Your answer is...'}
						textStyle={{ color: '#FFF', fontSize: 20 }}
						containerStyle={{ backgroundColor: '#F5D86B' }}
					/>
				</View>
				<View style={styles.options}>
					<Button
						title={choices.option1}
						buttonStyle={styles.option}
						onPress={() => { this.select(1, questionNumber) }}
					/>
					<Button
						title={choices.option2}
						buttonStyle={styles.option}
						onPress={() => { this.select(2, questionNumber) }}
					/>
					<Button
						title={choices.option3}
						buttonStyle={styles.option}
						onPress={() => { this.select(3, questionNumber) }}
					/>
					<Button
						title={choices.option4}
						buttonStyle={styles.option}
						onPress={() => { this.select(4, questionNumber) }}
					/>
				</View>
			</ScrollView>
		)
	}

	render() {
		const { score, opponent } = this.props.game
		const { uid } = this.props.user
		const { container, header, badge } = styles;
		const { photo, opponentPhoto } = this.props.dash.info;
		return (
			<ImageBackground
				source={require("../static/background.png")}
				style={container}
			>
				<LinearGradient
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					colors={[colors.darkred, colors.lightred]}
					style={header}
				>
					<View style={badge}>
						<Avatar
							rounded
							small
							source={{ uri: photo }}
						/>
						<Text style={{ color: colors.grey, paddingHorizontal: 20 }}>
							{(score[uid] = 0)}
						</Text>
					</View>

					<Icon
						name="home"
						type="material-community"
						color={colors.lightgrey}
						underlayColor={colors.transparent}
						size={40}
						onPress={() => Actions.popTo("dashboard")}
					/>

					<View style={badge}>
						<Text style={{ color: colors.grey, paddingHorizontal: 20 }}>
							{(score[opponent] = 0)}
						</Text>
						<Icon
							onPress={() => this.setState({ show: !this.state.show })}
							name="ellipsis-v"
							type="font-awesome"
							color={colors.grey}
							underlayColor={colors.transparent}
							containerStyle={{ paddingRight: 10 }}
						/>
						<Avatar
							rounded
							small
							source={{ uri: opponentPhoto }}
						/>
					</View>
				</LinearGradient>
				{this.renderCard()}
				<Chat />
			</ImageBackground>
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
	header: {
		flexDirection: "row",
		padding: 20,
		paddingBottom: 10,
		alignItems: "center",
		justifyContent: "space-between"
	},
	badge: {
		width: 100,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: colors.lightgrey,
		borderRadius: 20
	},
	//card
	card: {
		flex: 1,
		width: width - 40,
		margin: 20,
		backgroundColor: "#FFF",
		padding: 20,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { height: 10, width: 10 },
		shadowOpacity: 1
	},
	question: {
		marginBottom: 20,
		flex: 2,
		alignItems: "center"
	},
	user: {
		marginBottom: 10,
		justifyContent: "center"
	},
	options: {
		flex: 4,
		alignItems: "center"
	},
	option: {
		width: 250,
		margin: 10,
		backgroundColor: colors.lightgrey,
		borderRadius: 25,
	},
});

const mapStateToProps = state => {
	const arr = []
	_.forEach(state.game.lastFive, item => {
		arr.push(item)
	})
	return {
		dash: state.dash,
		game: state.game,
		lastFive: arr,
		user: state.login.user
	}
}

export default connect(mapStateToProps, actions)(AskBack);
