import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
//relative
import * as actions from '../actions';

class Modal extends Component {
	
	render() {
		if (!this.props.player.info.opponentName) {
			return (
				<ActivityIndicator
					animating={true}
					style={[styles.container, styles.horizontal]}
					size="large"
				/>
			);
		}
		const { result, gameKey } = this.props.game
		const { uid } = this.props.user
		const { info } = this.props.player
		return (
			<View style={styles.container}>
				<Avatar
					rounded
					xlarge
					avatarStyle={{ marginTop: 300, borderWidth: 10, borderColor: result.result ? '#6DC066' : '#FF4444' }}
					source={{ uri: info.opponentPhoto }}
				/>
				<View style={styles.message}>
					<Text style={{ fontSize: 30, color: result.result ? '#6DC066' : '#FF4444' }}>{info.opponentName} got it</Text>
					<Text style={{ fontSize: 26, fontWeight: 'bold', color: result.result ? '#6DC066' : '#FF4444' }}>{result.result ? 'RIGHT' : 'WRONG'}</Text>
					<Button
						rounded
						title="Continue"
						titleTextColor={'#F7F7F7'}
						backgroundColor={result.result ? '#6DC066' : '#FF4444' }
						buttonStyle={{ width: 200, marginTop: 100 }}
						onPress={async () => {
							const { currentUser } = firebase.auth();
							await firebase.database().ref(`users/${currentUser.uid}/games/${gameKey}`).update({
								status: 'result'
							})
							Actions.result()
						}}
						/>
				</View>
			</View>
		)
	}
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	//global
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000',
		padding: 20
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	},
	message: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 50
	},
	//footer - chat
	chat: {
		height: 50,
		marginTop: (width * .05),
		backgroundColor: '#ADD8E6',
	},
	input: {
		backgroundColor: '#96EAD7',
		margin: width * .05,
		borderRadius: 10,
		padding: 10
	},
});

const mapStateToProps = state => {
	return { game: state.game, user: state.login.user, player: state.player };
};

export default connect(mapStateToProps, actions)(Modal);