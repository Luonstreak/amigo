import React, { Component } from 'react';
import { Dimensions, Text, View, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button, List, ListItem } from 'react-native-elements';
import firebase from 'firebase';

// RELATIVE
import * as actions from '../actions';
import { Actions } from 'react-native-router-flux';


class PlayerList extends Component {

	selectPlayer = (player) => {
		const { currentUser } = firebase.auth()
		const ref = firebase.database().ref(`opponents/${currentUser.uid}`).orderByKey().equalTo(player)

		ref.once('value').then(async snap => {
			var opponent = await snap.exists()
			if (opponent) {
				alert('You are currently playing a game with this person.')
			}
			else {
				this.props.playerSelect(player)
			}
		})
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
