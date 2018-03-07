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
	state = {
		color: '#6DC066',
		string: 'RIGHT',
		layer: true,
		chatHeight: 50
	};

	componentWillMount() {
		if (false) {
			this.setState({ color: '#6DC066', string: 'RIGHT' })
		} else {
			this.setState({ color: '#FF4444', string: 'WRONG' })
		}
	}

	renderView = () => {
		if (this.state.layer) {
			return (
				<View style={styles.overlayContainer}>
					<Avatar
						rounded
						xlarge
						avatarStyle={{ marginTop: 300, borderWidth: 10, borderColor: this.state.color }}
						source={{ uri: 'https://pbs.twimg.com/profile_images/764466597788614656/bw2IMmNk_400x400.jpg' }}
					/>
					<View style={styles.message}>
						<Text style={{ fontSize: 30, color: '#F7F7F7' }}>LEGO GOT IT</Text>
						<Text style={{ fontSize: 26, fontWeight: 'bold', color: this.state.color }}>{this.state.string}</Text>
						<Button
							rounded
							title="Continue"
							titleTextColor={'#F7F7F7'}
							backgroundColor={this.state.color}
							buttonStyle={{ width: 200, marginTop: 100 }}
							onPress={() => this.setState({ layer: false })}
						/>
					</View>
				</View>
			)
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
					<ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
						<View style={styles.question}>
							<Text style={{ fontSize: 30 }}>{'Sample Question Conten In Here...'}</Text>
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
					<Chat style={styles.chat} height={this.state.chatHeight} />
				</View>
			)
		}
	}

	render() {
		return this.renderView()
	}

}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	//global
	overlayContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000'
	},
	container: {
		marginTop: 20,
		flex: 1,
		backgroundColor: '#DFE2E7'
	},
	//modal
	message: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
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
	return { game: {status: 'waiting' } };
};

export default connect(mapStateToProps, actions)(Result);