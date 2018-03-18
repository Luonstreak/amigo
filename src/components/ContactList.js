import React, { Component } from 'react';
import { Platform, Dimensions, Text, View, TouchableHighlight, FlatList  } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-elements';
import firebase from 'firebase';

// RELATIVE
import * as actions from '../actions';
import { Actions, Modal } from 'react-native-router-flux';


class ContactList extends Component {
	state ={ 
		contacts: null,
		modalVisible: false
	}

	componentDidMount() {
		setTimeout(() => this.showFirstContactAsync(), 1);
	}

	async showFirstContactAsync() {
		// Ask for permission to query contacts.
		const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
		const contacts = await Expo.Contacts.getContactsAsync({
			fields: [
				Expo.Contacts.PHONE_NUMBERS
			],
			pageSize: 1000,
			pageOffset: 0,
			});
			if (contacts.total > 0) {
				var arr = contacts.data
				this.setState({ contacts: arr })
				// Alert.alert(
				// 	'Your first contact is...',
				// 	`Name: ${contacts.data[0].name}\n` +
				// 	`Phone numbers: ${JSON.stringify(contacts.data[0].phoneNumbers)}\n` +
				// 	`Emails: ${JSON.stringify(contacts.data[0].emails)}`
				// );
			}
		}

	selectPlayer = (player, name) => {
		const newPlayer = String(player).replace(/[^\d]/g, '')
		const { phone } = this.props.dash.info
		const { uid } = this.props.user
		const ref = firebase.database().ref(`opponents/${phone}`).orderByKey().equalTo(newPlayer)
		ref.once('value', snap => {
			var opponent = snap.exists()
			console.log(opponent)
			if (opponent) {
				alert('You are currently playing a game with this person.')
			}
			else {
				this.props.playerSelect(newPlayer, uid, name)
			}
		})
	}

	saveNumbers = (numbers, visible) => {
		this.props.savePhoneNumbers(numbers)
		console.log('visible', visible)
		this.setState({ modalVisible: visible })
	}

	showPlayers = () => {
		return (
			<FlatList
				data={this.state.contacts}
				containerStyle={styles.listStyle}
				keyExtractor={(item, index) => index}
				renderItem={({ item }) =>
					<View
						style={styles.elementStyle}
					>
						<Text
							style={{ flex: 1, fontSize: 20, color: 'mediumseagreen' }}
							// onPress={() => item.phoneNumbers.length > 1 ? this.saveNumbers(item.phoneNumbers, !this.state.modalVisible) : this.selectPlayer(item.phoneNumbers[0].number)}
							onPress={() => Platform.OS === 'ios' ? this.selectPlayer(item.phoneNumbers[0].digits, item.name) : this.selectPlayer(item.phoneNumbers[0].number, item.name)}
						>{`${item.name}`}</Text>
					</View>
				}
			/>
		)
	}
	
	render() {
		return (
			<View>
				{this.showPlayers()}
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({ modalVisible: false });
					}}>
					<Button
						title={'adsfasdf'}
						// textStyle={'tomato'}
						backgroundColor={'transparent'}
					/>
				</Modal>
			</View>
		);
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
	return { user: state.login.user, dash: state.dash }
}

export default connect(mapStateToProps, actions)(ContactList);
