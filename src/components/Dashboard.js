import React, { Component } from 'react';
import { Dimensions, Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Button, Card, List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import * as actions from '../actions';

class Dashboard extends Component {

	componentWillMount(){
		this.props.fetchPlayers()
		this.props.usernameFetch()
	}

	render() {
		// const games = this.props.dash.games
		const { headerStyle, bodyStyle, titleStyle, listStyle } = styles;
		const list1 = [{ name: 'test_1' }, { name: 'test_2' }, { name: 'test_3' }, { name: 'test_4' }, { name: 'test_5' }]
		const list2 = [{ name: 'test_6' }, { name: 'test_7' }, { name: 'test_8' }]
		const list3 = [{ name: 'test_9' }]
		return (
			<View style={{ marginTop: 20 }}>		
				<View style={headerStyle}>
					<Button
						rounded
						backgroundColor={'#FFC300'}
						title={'INVITE FRIENDS'}
						buttonStyle={{ padding: 5 }}
						onPress={() => Actions.contacts()}
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
								title={l.name}
								titleStyle={{ marginLeft: 20, color: '#FFC300'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
								badge={{ element: 
									<Button 
										rounded
										backgroundColor={'#FFC300'}
										title={'PLAY'}
										buttonStyle={{ padding: 5 }}
										onPress={() => Actions.game()}
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
								title={l.name}
								titleStyle={{ marginLeft: 20, color: '#FA3C4C'}}
								containerStyle={{ paddingLeft: 0, paddingRight: 0, borderBottomWidth: 0 }}
								badge={{
									element:
										<Button
											rounded
											backgroundColor={'#FA3C4C'}
											title={'NUDGE'}
											buttonStyle={{ padding: 5 }}
											onPress={() => Actions.game()}
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
								title={l.name}
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

const { height, width } = Dimensions.get('window');
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
	return { dash: state.dash, players: arr }
}

export default connect(mapStateToProps, actions)(Dashboard);
