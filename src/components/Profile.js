import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as actions from '../actions';
import firebase from 'firebase';
import _ from 'lodash';

class Profile extends Component {
	
	getProfile = (item) => {
		this.props.friendsFetch(item.phone)
		Actions.profile({item})
	}

	_renderPhoto = (info) => {
		if (this.props.item) {
			if (this.props.item.photo) {
				return this.props.item.photo
			}
			else {
				return this.props.item.opponentPhoto
			}
		}
		else {
			return info.photo
		}
	}

	renderSettings = () => {
		if (this.props.current){
			return (
				<Icon
					name='settings'
					type='material-community'
					color='dodgerblue'
					underlayColor='transparent'
					onPress={() => Actions.settings()}
					size={40}
				/>
			)
		} else { return null }
	}

	selectPlayer = (item) => {
		const { phone } = this.props.dash.info
		const { uid } = this.props.user
		const ref = firebase.database().ref(`opponents/${phone}`).orderByKey().equalTo(item.phone)
		ref.once('value', snap => {
			var opponent = snap.exists()
			if (opponent) {
				alert('You are currently playing a game with this person.')
			}
			else {
				this.props.playerSelect(item.phone, uid, item.username)
			}
		})
	}

	_renderFriends = (friends) => {
		if (friends) {
			return (
				<FlatList
					data={friends}
					keyExtractor={(item, index) => index}
					renderItem={({ item }) => {
						return (
							<View style={styles.elementStyle}>
								<Avatar
									rounded
									medium
									source={{ uri: item.photo }}
									containerStyle={{ marginRight: 20 }}
									onPress={() => this.getProfile(item)}
								/>
								<Text style={{ flex: 1, fontSize: 20, color: '#FFC300' }}>{item.username}</Text>
								<Button
									rounded
									backgroundColor={'mediumseagreen'}
									title={'PLAY'}
									buttonStyle={{ padding: 5 }}
									onPress={() => this.selectPlayer(item)}
								/>
							</View>
						)
					}}
				/>
			)
			{/* <Text style={titleStyle}>EVERYONE ELSE</Text>
					<FlatList
					data={others}
					keyExtractor={(item, index) => index}
					renderItem={({ item }) =>
						<View
							style={elementStyle}
						>
							<Avatar
								rounded
								medium
								source={{ uri: item.avatar_url }}
								containerStyle={{ marginRight: 20 }}
							/>
							<Text style={{ flex: 1, fontSize: 20, color: '#FFC300' }}>Not So Friend</Text>
							<Icon
								name='information-outline'
								type='material-community'
								color='#CCC'
								backgroundColor={'transparent'}
								onPress={() => alert('see more about your friend..')}
							/>
						</View>
					}
				/> */}
		} else {
			return (
				<ActivityIndicator
					style={{ marginTop: 50 }}
					animating={true}
					color='dodgerblue'
					size="large"
				/>
			)
		}
	}
	render() {
		const { info, friends } = this.props.dash;
		const top = [], rest = [];
		const { headerStyle, titleStyle, listStyle, elementStyle, navBar } = styles;
		return (
			<View style={{ flex: 1 }}>
				<View style={headerStyle}>
					<View style={navBar}>
						<Icon
							name='arrow-left'
							type='material-community'
							color='dodgerblue'
							underlayColor='transparent'
							size={40}
							onPress={() => Actions.pop()}
						/>
						<Icon
							name='home'
							type='material-community'
							color='dodgerblue'
							underlayColor='transparent'
							size={40} s
							onPress={() => Actions.popTo('dashboard')}
					/>
						{this.renderSettings()}
					</View>
					<Avatar
						rounded
						xlarge
						containerStyle={{ margin: width * 0.025 }}
						source={{ uri: this._renderPhoto(info) }}
					/>
					<Text style={{ fontSize: 22 }}>{this.props.item ? this.props.item.username : info.username}</Text>
					<Text style={{ fontSize: 18 }}>{friends.length} FRIENDS</Text>
				</View>
				{/* LIST */}
				<ScrollView>
					<Text style={styles.titleStyle}>TOP 3 FRIENDOS</Text>
					{this._renderFriends(friends)}
				</ScrollView>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');

const styles = {
	//nav
	navBar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width,
		paddingTop: 20
	},
	//header
	headerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#D696BB'
	},
	//body
	titleStyle: {
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		color: '#FFF',
		backgroundColor: 'dodgerblue',
		padding: 5,
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
		borderBottomColor: 'orange'
	}
}

const mapStateToProps = state => {
	return { user: state.login.user, dash: state.dash }
}

export default connect(mapStateToProps, actions)(Profile);
