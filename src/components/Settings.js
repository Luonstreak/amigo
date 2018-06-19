import React, { Component } from 'react';
import { View, AsyncStorage, Text, TextInput, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import firebase from 'firebase';
import Accordion from 'react-native-collapsible/Accordion';

class Settings extends Component {
	state = {
		email: this.props.dash.info.email,
		newEmail: null,
		newEmail2: null,
		password: null,
		newPass: null,
		newPass2: null,
		errorE: null,
		errorP: null,
	}

	_isEmail = (section) => {
		section === 'Email' ? this.props.state.email : this.state.password
	}

	_renderHeader = (section) => {
		return (
			<View style={{ borderBottomWidth: 2, borderBottomColor: '#CBCBCB' }}>
				<Text style={styles.header}>UPDATE {section.toUpperCase()}</Text>
			</View>
		);
	}

	_updateEmail = () => {
		const user = firebase.auth().currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(
			user.email,
			this.props.dash.info.password
		);
		const { newEmail, newEmail2 } = this.state;
		if (newEmail !== newEmail2) {
			return this.setState({ errorE: 'Email Confimation doesn\'t match' })
		}
		else if (!newEmail || !newEmail2) {
			return this.setState({ errorE: 'All fields must be filled' })
		} else {
			user.reauthenticateWithCredential(credential).then(() => {
				user.updateEmail(newEmail).then(() => {
					firebase.database().ref(`users/${user.uid}`).update({ email: newEmail })
					alert('The email has been updated!')
				}).catch(error => {
					error.code === 'auth/invalid-email' ? this.setState({ errorE: 'Wrong email format' }) 
					: alert('There has been an error, please try again!')
				});
			}).catch(error => {
				alert('There has been an error, please try again!')
			});
		}
	}

	_updatePassword = () => {
		const user = firebase.auth().currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(
			user.email,
			this.props.dash.info.password
		);
		const { newPass, newPass2, password } = this.state;
		if (newPass !== newPass2) {
			return this.setState({ errorP: 'Password Confimation doesn\'t match' })
		}
		else if (!password || !newPass || !newPass2) {
			return this.setState({ errorP: 'All fields must be filled' })
		}
		else if (password !== this.props.dash.info.password) {
			return this.setState({ errorP: 'Wrong password' })
		}
		else {
			this.setState({ errorP: null })
			user.reauthenticateWithCredential(credential).then(() => {
				user.updatePassword(newPass).then(() => {
					firebase.database().ref(`users/${user.uid}`).update({ password: newPass })
					alert('The password has been updated!')
				}).catch(error => {
					console.log('pass error', error)
					alert('There has been an error, please try again!')
				});
			}).catch(error => {
				console.log('reauth error', error)
				alert('There has been an error, please try again!')
			});
		}
	}
	
	_renderError = (section) => {
		var error = null;
		if (section === 'Email' && this.state.errorE) {
			error = this.state.errorE
		} else if (section === 'Password' && this.state.errorP) {
			error = this.state.errorP
		}
		return <Text style={{ color: 'tomato', fontSize: 18, margin: 5 }}>{error}</Text>
	}

	_renderContent = (section, state) => {
		return (
			<View style={{ alignItems: 'center' }}>
				<Text style={{ color: '#F7931E', fontSize: 20, margin: 10 }}>Current {section}</Text>
				<TextInput
					secureTextEntry={section === 'Email' ? false : true}
					editable={section === 'Email' ? false : true}
					style={[styles.input, { borderBottomWidth: 0 }]}
					autoCapitalize='none'
					autoCorrect={false}
					returnKeysection='next'
					value={section === 'Email' ? this.props.login.user.email : this.state.password}
					onSubmitEditing={event => this.refs.SecondInput.focus()}
					onChangeText={text => this.setState({ password: text })}
				// onChangeText={this.onEmailInput}
				/>
				<Text style={{ color: '#F7931E', fontSize: 20, margin: 10 }}>New {section}</Text>
				<TextInput
					ref='SecondInput'
					secureTextEntry={section === 'Email' ? false : true}
					style={styles.input}
					autoCapitalize='none'
					autoCorrect={false}
					returnKeysection='next'
					placeholder={`New ${section}`}
					value={section === 'Email' ? this.state.newEmail : this.state.newPass}
					onSubmitEditing={event => this.refs.ThirdInput.focus()}
					onChangeText={text => {
						section === 'Email' ? this.setState({ newEmail: text }) : this.setState({ newPass: text })
					}}
				/>
				<TextInput
					ref='ThirdInput'
					secureTextEntry={section === 'Email' ? false : true}
					style={[styles.input, { marginBottom: 20 }]}
					autoCapitalize='none'
					autoCorrect={false}
					returnKeysection='next'
					placeholder={`Confirm New ${section}`}
					value={section === 'Email' ? this.state.newEmail2 : this.state.newPass2}
					onChangeText={text => {
						section === 'Email' ? this.setState({ newEmail2: text }) : this.setState({ newPass2: text })
					}}
				/>
				{this._renderError(section)}
				<Button
					title="UPDATE"
					buttonStyle={[styles.button, { marginBottom: 20 }]}
					textStyle={{ fontSize: 20 }}
					onPress={() => {
						this.setState({ modal: true })
						section === 'Email' ? this._updateEmail() : this._updatePassword()
					}}
				/>
			</View>
		);
	}

	_logout = async () => {
		let fbToken = await AsyncStorage.getItem('fbToken');
		if (fbToken) {
			AsyncStorage.removeItem('fbToken');
		} else {
			firebase.auth().signOut()
				.then(() => {
					alert('Sign out complete');
					Actions.login()
				})
				.catch((error) => {
					console.log('logout error', error)
					alert('There has been an error, please try again!')
				});
		}
	}

	render() {
		const { uid } = this.props.login.user
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
				<Accordion
					sections={['Email', 'Password']}
					renderHeader={this._renderHeader}
					renderContent={this._renderContent}
					underlayColor={'transparent'}
					
				/>
					
				<View>
					<Button
						title="BLOCKED USERS"
						buttonStyle={[styles.button, {
							marginBottom: 20,
							backgroundColor: '#FFF',
							borderColor: 'tomato',
							borderWidth: 1 }]}
						textStyle={{ fontSize: 20, color: 'tomato' }}
						containerStyle={{ border: 1, borderColor: '#CBCBCB' }}
						onPress={() => { this.props.fetchBlockedUsers(uid) }}
					/>

					<Button
						title="LOG OUT"
						buttonStyle={[styles.button, {
							marginBottom: 20,
							backgroundColor: '#FFF',
							borderColor: 'tomato',
							borderWidth: 1 }]}
						textStyle={{ fontSize: 20, color: 'tomato' }}
						containerStyle={{ border: 1, borderColor: '#CBCBCB' }}
						onPress={() => this._logout()}
					/>
				</View>
			</View>
		);
	}
}

const { width } = Dimensions.get('window');
const styles = {
  header: {
    width,
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    color: "#888",
    padding: 10
  },
  input: {
    width: width * 0.8,
    color: "#F7931E",
    backgroundColor: "#EDEDED",
    borderRadius: 30,
    fontSize: 20,
    padding: 15,
    paddingLeft: 25,
    margin: 20,
    marginTop: 0
  },
  button: {
    width: width * 0.8,
    borderRadius: 30,
    padding: 15,
    backgroundColor: "#F7931E"
  }
};

const mapStateToProps = state => {
	return { dash: state.dash, login: state.login };
}

export default connect(mapStateToProps, actions)(Settings);
