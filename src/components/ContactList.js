import React, { Component } from 'react';
import { ImageBackground, Platform, Dimensions, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import firebase from 'firebase';
import _ from 'lodash';
import { LinearGradient } from 'expo';
import { Actions } from "react-native-router-flux";

import colors from '../styles/colors';
import * as actions from '../actions';


class ContactList extends Component {
	state ={ 
		contacts: null,
		list: null,
		name: null
	}
	
	async showFirstContactAsync() {
		const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
		const contacts = await Expo.Contacts.getContactsAsync({
			fields: [
				Expo.Contacts.PHONE_NUMBERS
			],
			pageSize: 1000,
			pageOffset: 0,
			});
			if (contacts.total > 0) {
				const sorted = _.sortBy(contacts.data, ['name', 'phoneNumbers'], ['asc']);
				this.setState({ contacts: sorted })
			}
		}

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
		this.setState({ modalVisible: visible })
	}

	renderModal = () => {
		const { list, name } = this.state;
		if(this.state.list) {
			return (
			<View style={styles.modal}>
				<Text style={styles.modalHead}>PICK A NUMBER</Text>
				{list.map(el => {
					el['key'] = Math.floor(Math.random()*100000);
					return (
						<Button
							key={el.key}
							buttonStyle={[styles.modalButton,{backgroundColor: colors.grey}]}
							textStyle={{ color: colors.darkgrey }}
							title={`${el.number}`}
							onPress={() => {
								this.selectPlayer(Platform.OS === 'ios' ? el.digits : el.number, name)
							}}
						/>
					)
				})}
				<Button
					title='CANCEL'
					buttonStyle={[styles.modalButton,{backgroundColor: colors.wrong}]}
					textStyle={{ color: colors.lightgrey }}
					onPress={() => {
						this.setState({ list: null })
					}}
				/>
			</View>
		)
		} else { return null }
	}

	render() {
		return <ImageBackground source={require("../static/background.png")} style={styles.backgroundImage}>
        <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} colors={[colors.darkred, colors.lightred]} style={styles.header}>
          <Icon name="home" type="material-community" color={colors.lightgrey} underlayColor={colors.transparent} size={40} onPress={() => Actions.popTo("dashboard")} />
        </LinearGradient>
        <FlatList data={this.props.contacts} containerStyle={styles.listStyle} keyExtractor={(item, index) => index} renderItem={({ item }) => {
            return <View style={styles.elementStyle}>
                <Text style={{ flex: 1, fontSize: 20, color: colors.black }} onPress={() => {
                    if (item.phoneNumbers.length > 1) {
                      this.setState({
                        list: item.phoneNumbers,
                        name: item.name
                      });
                    } else {
                      this.selectPlayer(Platform.OS === "ios" ? item.phoneNumbers[0].digits : item.phoneNumbers[0].number, item.name);
                    }
                  }}>{`${item.name}`}</Text>
              </View>;
          }} />
        {this.renderModal()}
      </ImageBackground>;
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#DFE2E7"
  },
  header: {
    width,
    flexDirection: "row",
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    position: "absolute",
    width: width * 0.9,
    left: width * 0.05,
    bottom: width * 0.05,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    justifyContent: "center",
    alignItems: "center"
  },
  modalHead: {
    fontSize: 20,
    color: colors.darkred
  },
  modalButton: {
		width: 200,
		borderRadius: 25,
		paddingHorizontal: 10,
		paddingVertical: 5,
		margin: 5,
    justifyContent: "center"
  },
  listStyle: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    borderTopWidth: 0
  },
  elementStyle: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkred
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
};

const mapStateToProps = state => {
	return { user: state.login.user, dash: state.dash }
}

export default connect(mapStateToProps, actions)(ContactList);
