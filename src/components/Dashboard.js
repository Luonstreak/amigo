import React, { Component } from 'react';
import { Dimensions, Text, View, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Button, Card, List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import _ from 'lodash';

import * as actions from '../actions';

class Dashboard extends Component {

	componentWillMount(){
		this.props.fetchPlayers()
		this.props.usernameFetch()
		this.props.gameFetch()
		this.props.resetGameKey()
	}

	_renderGame = (game, status, opponent) => {
		this.props.renderCard(game, status, opponent)
	}

	render() {
		const { currentUser } = firebase.auth();
		const { headerStyle, bodyStyle, titleStyle, listStyle } = styles;
		const list1 = []
		const list2 = []
		const list3 = []
		var list = _.forIn(this.props.login.games, (value, key) => {
			value['gameKey'] = key;
			if (value.status === 'pending') {
				list3.push(value)
			} else if (value.status === 'waiting') {
				list2.push(value)
			} else { list1.push(value) }
		})
		return (
			<View style={{ marginTop: 20 }}>
				<View style={headerStyle}>
					<Button
						rounded
						backgroundColor={'#FFC300'}
						title={'INVITE FRIENDS'}
						buttonStyle={{ padding: 5 }}
						onPress={() => Actions.playerList()}
					/>
					<Avatar
						rounded
						medium
						avatarStyle={{ borderWidth: 1, borderColor: '#FFC300' }}
						source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }}
					/>
				</View>
				<ScrollView style={bodyStyle}>
					{/* YOUR TURN */}
					<Text style={[titleStyle, { backgroundColor: '#FFC300' }]}>Your Turn</Text>
					<List containerStyle={listStyle}>
						{list1.map((l, i) => (
							<ListItem
								roundAvatar
								hideChevron
								avatar={{ uri: l.avatar_url }}
								key={i}
								title={l.player1 !== currentUser.uid ? l.player1 : l.player2}
								titleStyle={{ marginLeft: 20, color: '#FFC300'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
								badge={{ element: 
									<Button 
										rounded
										backgroundColor={'#FFC300'}
										title={'PLAY'}
										buttonStyle={{ padding: 5 }}
										onPress={() => this._renderGame(l.gameKey, l.status, l.player1 !== currentUser.uid ? l.player1 : l.player2)}
									/>
								}}
								/>
							))}
					</List>
					{/* MY TURN */}
					<Text style={[titleStyle, { backgroundColor: '#FA3C4C' }]}>Their Turn</Text>
					<List containerStyle={listStyle}>
						{list2.map((l, i) => (
							<ListItem
								roundAvatar
								hideChevron
								avatar={{ uri: l.avatar_url }}
								key={i}
								title={l.player1 !== currentUser.uid ? l.player1 : l.player2}
								titleStyle={{ marginLeft: 20, color: '#FA3C4C'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
								badge={{
									element:
										<Button
											rounded
											backgroundColor={'#FA3C4C'}
											title={'NUDGE'}
											buttonStyle={{ padding: 5 }}
											onPress={() => this._renderGame(l.gameKey, l.status)}
										/>
								}}
							/>
						))}
					</List>
					{/* PENDING */}
					<Text style={[titleStyle, { backgroundColor: '#44BEC7' }]}>Pending</Text>
					<List containerStyle={listStyle}>
						{list3.map((l, i) => (
							<ListItem
								roundAvatar
								hideChevron
								avatar={{ uri: l.avatar_url }}
								key={i}
								title={l.player1 !== currentUser.uid ? l.player1 : l.player2}
								titleStyle={{ marginLeft: 20, color: '#44BEC7'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
							/>
						))}
					</List>
					

				</ScrollView>
			</View>
		);
	}
}

const styles = {
	//header
	headerStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		paddingLeft: 0
	},
	//body
	titleStyle: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#FFF',
		padding: 2.5
	},
	listStyle: {
		marginTop: 0,
		marginLeft: 0,
		marginRight: 0,
		borderTopWidth: 0

	}
}

const mapStateToProps = state => {
	const arr = _.map(state.player.players)
	return { login: state.login, players: arr }
}

export default connect(mapStateToProps, actions)(Dashboard);
