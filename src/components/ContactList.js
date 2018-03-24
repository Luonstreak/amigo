import React, { Component } from 'react';
import { ActivityIndicator, ImageBackground, Platform, Dimensions, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Button, Divider } from 'react-native-elements';
import firebase from 'firebase';
import _ from 'lodash';

// RELATIVE
import * as actions from '../actions';
import { Actions, Modal } from 'react-native-router-flux';


class ContactList extends Component {
	state ={ 
		contacts: null,
		list: null,
		name: null
	}
	
	// componentDidMount() {
	// 	this.showFirstContactAsync();
	// }
	
	// async showFirstContactAsync() {
	// 	// Ask for permission to query contacts.
	// 	const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
	// 	const contacts = await Expo.Contacts.getContactsAsync({
	// 		fields: [
	// 			Expo.Contacts.PHONE_NUMBERS
	// 		],
	// 		pageSize: 1000,
	// 		pageOffset: 0,
	// 		});
	// 		if (contacts.total > 0) {
	// 			const sorted = _.sortBy(contacts.data, ['name', 'phoneNumbers'], ['asc']);
	// 			this.setState({ contacts: sorted })
	// 		}
	// 	}

	selectPlayer = (player, name) => {
		const newPlayer = String(player).replace(/[^\d]/g, '')
		const { phone } = this.props.dash.info
		const { uid } = this.props.user
		const ref = firebase.database().ref(`opponents/${phone}`).orderByKey().equalTo(newPlayer)
		ref.once('value', snap => {
			var opponent = snap.exists()
			if (opponent) {
				alert('You are currently playing a game with this person.')
				this.setState({ list: null })
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

	renderModal = () => {
		const { list, name } = this.state;
		if(this.state.list) {
			return(
			<View style={styles.modal}>
				<Text style={styles.modalHead}>PICK A NUMBER</Text>
				{list.map(el => {
					el['key'] = Math.floor(Math.random()*100000);
					return (
						<Button
							buttonStyle={styles.modalButton}
							textStyle={{ color: 'gray' }}
							title={`${el.number}`}
							onPress={() => {
								this.selectPlayer(Platform.OS === 'ios' ? el.digits : el.number, name)
							}}
						/>
					)
				})}
				<Button
					title='CANCEL'
					buttonStyle={styles.modalButton}
					textStyle={{ color: 'tomato' }}
					onPress={() => {
						this.setState({ list: null })
					}}
				/>
			</View>
		)
		} else { return null }
	}

	render() {
		return (
			<ImageBackground source={require('../static/background.png')} style={styles.backgroundImage}>
				<FlatList
					data={this.props.contacts}
					containerStyle={styles.listStyle}
					keyExtractor={(item, index) => index}
					renderItem={({ item }) => {
						return (
							<View
								style={styles.elementStyle}
							>
								<Text
									style={{ flex: 1, fontSize: 20 }}
									onPress={() => {
										if (item.phoneNumbers.length > 1) {
											this.setState({ list: item.phoneNumbers, name: item.name })
										} else {
											this.selectPlayer(
												Platform.OS === 'ios' ? item.phoneNumbers[0].digits :
												item.phoneNumbers[0].number, item.name
											)
										}
									}}
								>{`${item.name}`}</Text>
							</View>
						)
					}}
				/>
				{this.renderModal()}
			</ImageBackground>
		);
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		flex: 1,
		backgroundColor: '#DFE2E7'
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	},
	modal: {
		position: 'absolute',
		width: width * .9,
		left: width * .05,
		top: width * .5,
		padding: 20,
		borderRadius: 20,
		backgroundColor: 'lightgray',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalHead: {
		fontSize: 20,
		color: '#FFF'
	},
	modalButton: {
		backgroundColor: 'transparent',
		justifyContent: 'center'
	},
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
		borderBottomColor: 'tomato'
	},
	backgroundImage: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
}

const mapStateToProps = state => {
	return { user: state.login.user, dash: state.dash }
}

export default connect(mapStateToProps, actions)(ContactList);
