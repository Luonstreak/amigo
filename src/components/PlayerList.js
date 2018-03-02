import React, { Component } from 'react';
import { Dimensions, Text, View, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button, List, ListItem } from 'react-native-elements';

// RELATIVE
import * as actions from '../actions';
import { Actions } from 'react-native-router-flux';


class PlayerList extends Component {

	selectPlayer = (player) => {
		this.props.playerSelect(player)
	}

	showPlayers = () => {
		var players = this.props.player.players
		return (
			<Card>
				<List>
					{Object.keys(players).map((k) => (
						<ListItem
							roundAvatar
							avatar={{ uri: 'https://i.imgur.com/FDWo9.jpg' }}
							hideChevron={true}
							key={k}
							title={k}
							onPress={() => { 
								this.selectPlayer(k)
								Actions.categories()
							}}
						/>
						// <Button

						// >
					))}
				</List>
			</Card>
		)
	}
	
	render() {
		return (
			<View>
				{this.showPlayers()}
			</View>
		);
	}
}

const mapStateToProps = state => {
	return { player: state.player }
}

export default connect(mapStateToProps, actions)(PlayerList);
