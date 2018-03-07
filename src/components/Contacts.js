import React, { Component } from 'react';
import { Dimensions, Text, View, ScrollView } from 'react-native';
import { Avatar, Button, Card, List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as actions from '../actions';

class Contacts extends Component {

	render() {
		// const games = this.props.dash.games
		const list1 = [{ name: 'test_1' }, { name: 'test_2' }, { name: 'test_3' }, { name: 'test_4' }, { name: 'test_5' }]
		
		return (
			<ScrollView style={{ marginTop: 20 }}>
				<List>
					{list1.map((l, i) => (
						<ListItem
							roundAvatar
							hideChevron
							avatar={{ uri: l.avatar_url }}
							key={i}
							title={l.name}
							containerStyle={{ paddingLeft: 20, paddingRight: 20 }}
							badge={{
								element:
									<Button
										rounded
										backgroundColor={'#FFC300'}
										title={'PLAY'}
										buttonStyle={{ padding: 2.5 }}
										onPress={() => Actions.question()}
									/>
							}}
						/>
						))}
				</List>
			</ScrollView>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	//header
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		paddingLeft: 0,
		backgroundColor: '#D696BB'
	},
	//body
	title: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#FFF',
		padding: 2.5,
		backgroundColor: '#44BEC7'
	}
}


export default connect(null, actions)(Contacts);
