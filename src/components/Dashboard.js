import React, { Component } from 'react';
import { Dimensions, Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Button, Card, List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import * as actions from '../actions';

class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.props.fetchPlayers()
		this.props.usernameFetch()
	}	

	render() {
		// const games = this.props.dash.games
		return (
			<View style={{ marginTop: 20, justifyContent: 'center' }}>
				<View style={styles.header}>
					<Button
						title='Invite Friends'
						rounded
						buttonStyle={{ padding: 10 }}
						backgroundColor={'#FFC300'}
						onPress={() => Actions.playerList()}
					/>
					<Avatar
						medium
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
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text style={styles.title}>Your Turn!</Text>
					<List containerStyle={styles.list}>
						{
							list.map((l, i) => (
								<ListItem
									roundAvatar
									hideChevron
									avatar={{ uri: l.avatar_url }}
									key={i}
									title={l.name}
									titleStyle={{ color: '#0084FF' }}
									containerStyle={{ paddingLeft: 10 }}
									badge={{ element:
										<Button
											title='PLAY'
											rounded
											textStyle={{ color: '#FFF' }}
											buttonStyle={{ justifyContent: 'center', padding: 5 }}
											backgroundColor={'#0084FF'}
											onPress={() => Actions.game()}
										/>
									}}
								/>
							))
						}
					</List>
				</ScrollView>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	//header
	header: {
		marginTop: 10,
		marginBottom: 10,
		paddingRight: 10,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
	//body
	title: {
		padding: 2.5,
		paddingLeft: 20,
		color: '#FFF',
		backgroundColor: '#FA3C4C',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 18
	},
	list: {
		marginTop: 0,
		borderTopWidth: 0,
		borderBottomWidth: 0,
	}
}

const mapStateToProps = state => {
	return { dash: state.dash }
}

export default connect(null, actions)(Dashboard);
