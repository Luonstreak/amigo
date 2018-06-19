import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import { Avatar, Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';

class BlockedUsers extends Component {

	render() {
		const { uid } = this.props.login
		const { listStyle, elementStyle } = styles;
		const { blockedUsers } = this.props.settings
		const data = []
		var list = _.forIn(blockedUsers, (value, key) => {
			value['gameKey'] = key
			data.push(value)
		})
		if (data.length < 1) {
			return (
				<View style={{ flex: 1, marginTop: 2, alignItems: 'center' }}>
					<Text style={{ fontSize: 20, color: '#F7931E' }}>No Blocked Users!</Text>
				</View>
			)
		}
		else {
			return (
				<View style={{ flex: 1, marginTop: 20 }}>
					<FlatList
						data={data}
						containerStyle={listStyle}
						keyExtractor={(index) => index}
						renderItem={({ item }) =>
							<View
								style={elementStyle}
							>
								<Avatar
									rounded
									medium
									source={{ uri: item.photo }}
									containerStyle={{ marginRight: 20 }}
									onPress={() => alert('getting Profile')}
								/>
								<Text
									style={{ flex: 1, fontSize: 20, color: '#FFC300' }}
								>{item.name}</Text>
								<Button
									rounded
									backgroundColor={'#FFC300'}
									title={'Unblock'}
									buttonStyle={{ padding: 5 }}
									onPress={() => {
										this.props.unblockUser(uid, item.opponent, item.gameKey),
										alert(`Unblocked ${item.name}!`)
									}}
								/>
							</View>
						}
					/>
				</View>
			)
		}
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	listStyle: {
		marginTop: 0,
		marginLeft: 0,
		marginRight: 0,
		borderTopWidth: 0
	},
	elementStyle: {
		width: width,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderBottomWidth: 1,
		borderBottomColor: 'orange'
	}
}

const mapStateToProps = state => {
	return { login: state.login.user, settings: state.settings	}
}

export default connect(mapStateToProps, actions)(BlockedUsers);
