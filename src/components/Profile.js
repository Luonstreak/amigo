import React, { Component } from "react";
import {
  ImageBackground,
	Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Avatar, Button, Icon } from "react-native-elements";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import firebase from "firebase";
import * as actions from "../actions";
import colors from "../styles/colors";

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

	selectPlayer = (item) => {
		const { phone } = this.props.dash.info
		const { uid } = this.props.user
		const ref = firebase.database().ref(`opponents/${phone}`).orderByKey().equalTo(item.phone)
		ref.once("value", snap => {
			var opponent = snap.exists()
			if (opponent) {
				alert("You are currently playing a game with this person.")
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
					keyExtractor={index => index}
					renderItem={({ item }) => {
						return <View style={styles.elementStyle}>
                <Avatar rounded large containerStyle={{ marginRight: 20 }} source={{ uri: item.photo }} onPress={() => this.getProfile(item)} />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 20,
                    color: "#FFC300"
                  }}
                >
                  {item.username}
                </Text>
                <Button rounded backgroundColor={colors.lightred} title={"PLAY"} onPress={() => this.selectPlayer(item)} />
              </View>;
					}}
				/>
			)
		} else {
			return (
				<ActivityIndicator
					style={{ marginTop: 50 }}
					animating={true}
					color="#FFC300"
					size="large"
				/>
			)
		}
	}
	render() {
		const { info, friends } = this.props.dash;
		const { headerStyle, photoStyle, titleStyle, gradientStyle } = styles;
		return (
			<ImageBackground
				source={require("../static/background.png")}
				style={{ flex: 1 }}
			>
				<LinearGradient
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					colors={[colors.darkred, colors.lightred]}
					style={headerStyle}
				>
					<Icon
						name="arrow-left"
						type="material-community"
						color={colors.lightgrey}
						underlayColor={colors.transparent}
						size={40}
						onPress={() => Actions.pop()}
					/>
					<Icon
						name="home"
						type="material-community"
						color={colors.lightgrey}
						underlayColor={colors.transparent}
						size={40}
						onPress={() => Actions.popTo("dashboard")}
					/>
					{this.props.current && <Icon
						name="settings"
						type="material-community"
						color={colors.lightgrey}
						underlayColor={colors.transparent}
						onPress={() => Actions.settings()}
						size={40}
					/>}
				</LinearGradient>
				<LinearGradient
					start={{ x: .5, y: 0.5 }}
					end={{ x: .5, y: 0 }}
					colors={[colors.lightgrey, colors.transparent]}
					style={photoStyle}
				>
					<Avatar
						rounded
						xlarge
						containerStyle={{ margin: width * 0.025 }}
						source={{ uri: this._renderPhoto(info) }}
					/>
					<Text style={{ fontSize: 34, color: colors.lightred, fontWeight: '400' }}>{this.props.item ? this.props.item.username : info.username}</Text>
				</LinearGradient>
				<LinearGradient
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					colors={[colors.darkred, colors.lightred]}
					style={gradientStyle}
				>
					<Text style={[titleStyle, { backgroundColor: colors.transparent }]}>{friends.length == 1 ? "1 FRIEND" : `${friends.length} FRIENDS`}</Text>
				</LinearGradient>
				<ScrollView>
					{this._renderFriends(friends)}
				</ScrollView>
			</ImageBackground>
		);
	}
}

const { width } = Dimensions.get("window");
const styles = {
	//header
	headerStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 20,
		paddingHorizontal: 20,
	},
	//PHOTO
  photoStyle: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
	//body
	titleStyle: {
		backgroundColor: colors.transparent,
		fontWeight: "400",
		fontSize: 20,
		textAlign: "center",
		color: "#FFF",
		padding: 10
	},
	elementStyle: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 20,
		marginVertical: 10,
		backgroundColor: colors.lightgrey,
		borderRadius: 50,
		shadowColor: "#000",
		shadowOffset: { height: 3, width: 0 },
		shadowOpacity: 0.2
	},
	gradientStyle: {
		shadowColor: "#000",
		shadowOffset: { height: 3, width: 0 },
		shadowOpacity: 0.2
	}
};

const mapStateToProps = state => {
	return { user: state.login.user, dash: state.dash }
}

export default connect(mapStateToProps, actions)(Profile);
