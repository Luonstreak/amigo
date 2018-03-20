import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TextInput,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import { Button, Badge, Avatar, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import _ from 'lodash';
//relative
import Chat from './Chat';
import * as actions from '../actions';
import { transparent } from 'material-ui/styles/colors';
import firebase from 'firebase';

class Result extends Component {
	state = {
		show: false
	}

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

	_renderMenu = () => {
		const { uid } = this.props.login;
		const { opponent, gameKey } = this.props.game
		const { info } = this.props.player
		if (this.state.show) {
			return (
				<View style={{ position: 'absolute', top: 40, right: 5, borderRadius: 10, backgroundColor: '#e6e6fa' }}>
					<Button
						title={'Block User'}
						onPress={() => { this.props.reportUser(gameKey, opponent, uid, null, info.opponentName, info.opponentPhoto), this.setState({ show: false }) }}
						buttonStyle={styles.chooseButton}
					/>
					<Button
						title={'Report Abuse'}
						onPress={() => { Actions.reportAbuse( info.opponentName, info.opponentPhoto ), this.setState({ show: false }) }}
						buttonStyle={styles.chooseButton}
					/>
				</View>
			)
		}
		else { return null }
	}

	render() {
		if (!this.props.player) {
			return (
				<ActivityIndicator
					animating={true}
					style={[styles.container, styles.horizontal]}
					size="large"
				/>
			);
		}
		const { gameKey, score, opponent, result } = this.props.game
		const { uid } = this.props.login
		const { info } = this.props.player
		return (
			<View style={styles.container}>
				<TouchableOpacity
					activeOpacity={1}
					onPressOut={() => this.setState({ show: false })}
				>
					<View style={styles.counter}>
						<View style={styles.badges}>
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
						<Icon
							onPress={() => !this.state.show ? this.setState({ show: true }) : this.setState({ show: false })}
							name='ellipsis-v'
							type='font-awesome'
							underlayColor={transparent}
							color='black'
							containerStyle={{ marginLeft: 50, width: 20 }}
						/>
					</View>
					<ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
						<View style={styles.question}>
							<Text style={{ fontSize: 30 }}>{result.content}</Text>
						</View>
						<View style={styles.user}>
							<Badge
								value={`${info.opponentName}'s answer was...`}
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
						buttonStyle={{ justifyContent: 'center', width: width * 0.8, margin: width * 0.1 }}
						onPress={() => this.props.changeStatus('guess', uid, gameKey)}
					/>
					<Chat />
				</TouchableOpacity>
				{this._renderMenu()}
			</View>
		)
	}
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	//global
	container: {
		marginTop: 40,
		flex: 1,
		backgroundColor: '#DFE2E7'
	},
	//header
	counter: {
		height: 40,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#0D658D',
		flexDirection: 'row'
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	},
	badge: {
		padding: 10,
		marginLeft: 25,
	},
	badges: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
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
	chooseButton: {
		margin: 10,
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 10,
		backgroundColor: '#0099FF'
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
	console.log(state.player)
	return { game: state.game, login: state.login.user, player: state.player };
};

export default connect(mapStateToProps, actions)(Result);