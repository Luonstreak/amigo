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

	// componentDidMount() {
	// 	this.props.fetchPlayers()
	// }

	componentDidMount() {
		this.props.fetchPlayers()
	}

	_keyExtractor = (item, index) => item.id;

	// renderGame = (gameId) => {
	// 	firebase.database().ref(`games/${gameId}`).once(snap => {
	// 		this.
	// 	})
	// }

	render() {
		const list = [
			{
				name: 'Amy Farha',
				key: 'skdjffsdlk',
				avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
				subtitle: 'Vice President'
			},
			{
				name: 'Chris Jackson',
				key: 'skdjffsssd',
				avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
				subtitle: 'Vice Chairman'
			},
			{
				name: 'Perri Elis',
				key: 'djfksll;',
				avatar_url: 'https://i.imgur.com/XUbwQ5E.jpg',
				subtitle: 'Vice Chairman'
			},
			{
				name: 'Curtis Jackson',
				key: 'dksjfkdk',
				avatar_url: 'https://i.imgur.com/jlXXJ.jpg',
				subtitle: 'Vice Chairman'
			},
		];
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
						avatarStyle={{ flex: 1 }}
						source={{ uri: 'https://pbs.twimg.com/profile_images/764466597788614656/bw2IMmNk_400x400.jpg' }}
					/> 
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

export default connect(null, actions)(Dashboard);
