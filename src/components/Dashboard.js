import React, { Component } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Button, Card } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import * as actions from '../actions';

class Dashboard extends Component {
		
	componentDidMount() {
		this.props.fetchPlayers()
		this.props.usernameFetch()
		console.log('in the dashboard')
	}

	render() {
		// const games = this.props.dash.games
		return (
			<View style={styles.wrapper}>
				<View style={styles.section1}>
					<Button
						rounded
						backgroundColor='green'
						title='Play Game'
						onPress={() => {Actions.playerList(),  this.props.createGame()}}
				/>
					<Avatar
						large
						rounded
						source={{ uri: 'https://www.acspri.org.au/sites/acspri.org.au/files/profile-placeholder.png' }}
					// onPress={this._pickImage} 
					/>
				</View>
			
				<View style={styles.mainSection}>
					<Card
						title='Your Turn'
						style={styles.card}
					>
						<Text style={{ marginBottom: 10 }}>
							The idea with React Native Elements is more about component structure than actual design.
						</Text>
						<Button
							icon={{ name: 'code' }}
							backgroundColor='#03A9F4'
							buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
							title='Play' />
					</Card>
					<Card
						title='Their Turn'
						style={styles.card}
					>
						<Text style={{ marginBottom: 10 }}>
							The idea with React Native Elements is more about component structure than actual design.
						</Text>
						<Button
							icon={{ name: 'code' }}
							backgroundColor='#03A9F4'
							buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
							title='Nudge' />
					</Card>
					<Card
						title='Pending'
						style={styles.card}
					>
						<Text style={{ marginBottom: 10 }}>
							The idea with React Native Elements is more about component structure than actual design.
						</Text>
						<Button
							icon={{ name: 'code' }}
							backgroundColor='#03A9F4'
							buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
							title='Remind' />
					</Card>
				</View>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	section1: {
		// position: 'relative',
		bottom: 30,
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		marginTop: 80,
		// flex: 1, 
		flexDirection: 'row'
	},
	wrapper: {
		width: (width * .8),
		marginLeft: (width * .1),
		justifyContent: 'center'
	},
	mainSection: {
		flexDirection: 'column'
	},
	card: {
		flexDirection: 'row'
	}
}

const mapStateToProps = state => {
	return { dash: state.dash }
}

export default connect(mapStateToProps, actions)(Dashboard);
