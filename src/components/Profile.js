import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Dimensions } from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as actions from '../actions';

class Profile extends Component {
		
	render() {
		const { profileUser } = this.props.profile
		const { headerStyle, titleStyle, listStyle, elementStyle} = styles;
		return (
			<View style={{ flex: 1 }}>
				<View style={headerStyle}>
					<Icon
						name='arrow-left'
						type='material-community'
						color='dodgerblue'
						underlayColor='transparent'
						size={40}
						containerStyle={{ position: 'absolute', top: 20, left: 10 }}
						onPress={() => Actions.pop()}
					/>
					<Avatar
						rounded
						xlarge
						containerStyle={{ margin: width * 0.025 }}
						source={{uri: profileUser.photo}}
					/>
					<Text style={{ fontSize: 22 }}>{profileUser.username}</Text>
					<Text style={{ fontSize: 18 }}>{profileUser.friends} FRIENDS</Text>
				</View>
				{/* LIST */}
				<ScrollView>
					<Text style={titleStyle}>TOP 3 FRIENDOS</Text>
					<FlatList
						data={profileUser.games}
						keyExtractor={(item, index) => index}
						renderItem={({ item }) => {
							return (
								<View style={elementStyle}>
									<Avatar
										rounded
										medium
										source={{ uri: item.avatar_url }}
										containerStyle={{ marginRight: 20 }}
									/>
									<Text style={{ flex: 1, fontSize: 20, color: '#FFC300' }}>{item.opponent}</Text>
									<Icon
										name='information-outline'
										type='material-community'
										color='#CCC'
										backgroundColor={'transparent'}
										onPress={() => alert('see more about your friend..')}
									/>
								</View>
							)
						}}
					/>
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
				</ScrollView>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');

const styles = {
	//header
	headerStyle: {
		paddingTop: 20,
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
		padding: 5
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
	return { profile: state.profile }
}

export default connect(mapStateToProps, actions)(Profile);
