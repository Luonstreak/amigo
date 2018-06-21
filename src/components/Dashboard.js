import React, { Component } from "react";
import {
  ImageBackground,
  Dimensions,
  Text,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Share,
  TouchableOpacity
} from "react-native";
import { Notifications } from "expo";
import { connect } from "react-redux";
import { Avatar, Button } from "react-native-elements";
import { LinearGradient } from "expo";
import colors from "../styles/colors";
import { Actions } from "react-native-router-flux";
import firebase from "firebase";
import moment from "moment";
import _ from "lodash";

import * as actions from "../actions";
import registerForNotifications from "../../services/pushNotifications";
import ChatModal from "./ChatModal";

class Dashboard extends Component {
  state = {
    refreshing: false,
    auxKey: null,
    opponent: null,
    contacts: null
  };

  componentDidMount() {
    this._onRefresh();
    this.props.friendsFetch(this.props.dash.info.phone);
    this.props.getCategories();
    this.props.resetGameKey();
    registerForNotifications();
    //Contacts Conditional
    if (this.props.dash.contacts) {
      this.setState({ contacts: this.props.dash.contacts });
    } else {
      this.showFirstContactAsync();
    }
    //Notifications Conditional
    Notifications.getBadgeNumberAsync().then(badgeNumber => {
      if (badgeNumber !== 0) {
        Notifications.setBadgeNumberAsync(0);
      }
    });
  }

  async showFirstContactAsync() {
    // Ask for permission to query contacts.
    const permission = await Expo.Permissions.askAsync(
      Expo.Permissions.CONTACTS
    );
    const contacts = await Expo.Contacts.getContactsAsync({
      fields: [Expo.Contacts.PHONE_NUMBERS],
      pageSize: 1000,
      pageOffset: 0
    });
    if (contacts.total > 0) {
      const sorted = _.sortBy(contacts.data, ["name", "phoneNumbers"], ["asc"]);
      this.setState({ contacts: sorted });
      this.props.saveContacts(sorted);
    }
  }

  // SPINNER
  _onRefresh = async () => {
    this.setState({ refreshing: true });
		await this.props.userFetch();
		this.setState({ refreshing: false });
  };

  _getChatInfo = (game, name) => {
    this.setState({ auxKey: game, opponent: name });
    this.props.visibleChat(true);
  };

  _renderChat = () => {
    if (this.props.dash.chatVisible === "on") {
      return (
        <View style={styles.chatContainer}>
          <ChatModal
            auxKey={this.state.auxKey}
            opponent={this.state.opponent}
          />
        </View>
      );
    } else {
      null;
    }
  };

  // PROFILE

  _getProfile = item => {
    this.props.friendsFetch(item.opponentPhone);
    Actions.profile({ item });
  };

  // GAME

  _renderGame = async (game, status, setScore, opponent) => {
    const { uid } = this.props.login.user;
    const { phone, photo, username } = this.props.dash.info;
    if (setScore) {
      await firebase
        .database()
        .ref(`scores/${game}`)
        .set({
          [uid]: 0,
          [opponent]: 0
        });
      await firebase
        .database()
        .ref(`nudges/${game}`)
        .update({ [uid]: 5 });
      await firebase
        .database()
        .ref(`users/${uid}/games/${game}`)
        .update({ setScore: false });
      await firebase
        .database()
        .ref(`users/${uid}/games/${game}`)
        .update({ player2: uid });
      await firebase
        .database()
        .ref(`users/${opponent}/games/${game}`)
        .update({ player2: uid });
    } else {
      this.props.fetchScore(game);
    }
    this.props.startGame(game, status, opponent, phone, photo, username);
    this.props.fetchChosenQuestions(game);
  };

  _addNudge = (opponent, key) => {
    const { uid } = this.props.login.user;
    const { username } = this.props.dash.info;

    const ref = firebase.database().ref(`nudges/${key}/${uid}`);
    ref.once("value", snap => {
      var count = snap.val();
      if (count === 0) {
        alert("Sorry, you have no more nudges left for this game.");
      } else {
        const tokenRef = firebase.database().ref(`users/${opponent}/token`);
        tokenRef.once("value", async snap => {
          var token = snap.val();
          if (token) {
            alert(`You have ${count - 1} nudge(s) left for this game.`);
            var message = `${username} nudged you! Play them back!`;
            await firebase
              .database()
              .ref("nudge")
              .push({
                from: uid,
                expoToken: token,
                body: message
              });
            this.props.decreaseNudgeCount(key, uid, count);
          } else {
            alert("Tell your friend to turn on their notifications!");
          }
        });
      }
    });
  };

  _sendReminder = () => {
    var url = "http://amigoo.com";
    var body = `Remember, I asked you a question on AmigoO? So, come on download the app and let's play!${url}`;
    Share.share(
      {
        message: body,
        title: "AmigoO"
      },
      {
        dialogTitle: "Remind Your Friend About AmigoO",
        tintColor: "mediumseagreen"
      }
    )
      .then(({ action, activityType }) => {
        console.log("success", activityType);
      })
      .catch(error => console.log("failed", error));
  };

  _lastPlayed = data => {
    if (data) {
      var date = moment(data, "YYYYMMDDHHmm");
      return date.fromNow();
    } else {
      return "not played yet";
    }
  };

  render() {
    if (!this.props.dash.info || !this.state.contacts) {
      return (
        <ImageBackground
          source={require("../static/background.png")}
					style={{ flex: 1 }}
        >
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator
              animating={true}
              color="mediumseagreen"
              size="large"
            />
          </View>
        </ImageBackground>
      );
    }

    const { currentUser } = firebase.auth();
    const { info } = this.props.dash;
    const {
      headerStyle,
      bodyStyle,
      titleStyle,
			elementStyle,
			gradientStyle
    } = styles;
    const list1 = [],list2 = [],list3 = [],blockList = [];
    _.forIn(info.games, (value, key) => {
      value["opponent"] =
        currentUser.uid === value.player1 ? value.player2 : value.player1;
      value["gameKey"] = key;
      if (value.status === "pending" && !value.blocked) {
        list3.push(value);
      } else if (value.status === "waiting" && !value.blocked) {
        list2.push(value);
      } else if (value.blocked) {
        blockList.push(value);
      } else {
        list1.push(value);
      }
    });
    return (
      <ImageBackground
        source={require("../static/background.png")}
				style={{ flex: 1 }}
      >
        {/*HEADER*/}
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[colors.darkred, colors.lightred]}
          style={[gradientStyle, headerStyle]}
        >
          <Button
            rounded
            backgroundColor={colors.lightred}
            title={"INVITE FRIENDS"}
            buttonStyle={{ marginLeft: -20, padding: 5 }}
            onPress={() =>
              Actions.contactList({ contacts: this.state.contacts })
            }
          />
          <Avatar
            rounded
            medium
            source={{ uri: info.photo }}
            onPress={() => Actions.profile({ current: true })}
          />
        </LinearGradient>
        {/*BODY*/}
        <ScrollView
          style={bodyStyle}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              tintColor={"#EF4846"}
            />
          }
        >
          {/* MY TURN */}
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[colors.darkred, colors.lightred]}
            style={gradientStyle}
          >
            <Text style={[titleStyle, { backgroundColor: colors.transparent }]}>
              YOUR TURN
            </Text>
          </LinearGradient>
          <FlatList
            data={list1}
            keyExtractor={index => index}
            renderItem={({ item }) => {
              return (
                <View style={elementStyle}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Avatar
											rounded
											large
											source={{ uri: item.opponentPhoto }}
											containerStyle={{ marginRight: 20, backgroundColor: '#FFF' }}
											onPress={() => this._getProfile(item)}
										/>
										<TouchableOpacity
											onPress={() =>
												this._getChatInfo(item.gameKey, item.opponentName)
											}
										>
											<Text
												style={{ fontSize: 16, color: colors.darkgrey }}
											>
												{item.opponentName}
											</Text>
											<Text style={{ fontSize: 10, color: colors.lightred }}>
												{this._lastPlayed(item.opponentLastPlayed)}
											</Text>
										</TouchableOpacity>
									</View>
                  <Button
                    rounded
                    backgroundColor={colors.lightred}
                    title={"PLAY"}
										buttonStyle={{ padding: 5, marginRight: 10 }}
                    onPress={() =>
                      this._renderGame(
                        item.gameKey,
                        item.status,
                        item.setScore,
                        item.player1 !== currentUser.uid
                          ? item.player1
                          : item.player2
                      )
                    }
                  />
                </View>
              );
            }}
          />
          {/* THEIR TURN */}
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[colors.darkred, colors.lightred]}
            style={gradientStyle}
          >
            <Text style={[titleStyle, { backgroundColor: colors.transparent }]}>
              THEIR TURN
            </Text>
          </LinearGradient>
          <FlatList
            data={list2}
            keyExtractor={index => index}
            renderItem={({ item }) => {
              return (
                <View style={[elementStyle, gradientStyle]}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
										<Avatar
											rounded
											large
											source={{ uri: item.opponentPhoto }}
											containerStyle={{ marginRight: 20 }}
											onPress={() => this._getProfile(item)}
										/>
										<TouchableOpacity
											onPress={() =>
												this._getChatInfo(item.gameKey, item.opponentName)
											}
										>
											<Text
												style={{ fontSize: 16, color: colors.darkgrey }}
											>
												{item.opponentName}
											</Text>
											<Text style={{ fontSize: 10, color: colors.lightred }}>
												{this._lastPlayed(item.opponentLastPlayed)}
											</Text>
										</TouchableOpacity>
									</View>
                  <Button
                    rounded
										backgroundColor={colors.red}
                    title={"NUDGE"}
										buttonStyle={{ padding: 5, marginRight: 10 }}
                    onPress={() =>
                      this._addNudge(
                        item.player1 !== currentUser.uid
                          ? item.player1
                          : item.player2,
                        item.gameKey
                      )
                    }
                  />
                </View>
              );
            }}
          />
          {/* PENDING */}
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[colors.darkred, colors.lightred]}
            style={gradientStyle}
          >
            <Text style={[titleStyle, { backgroundColor: colors.transparent }]}>
              PENDING
            </Text>
          </LinearGradient>
          <FlatList
            data={list3}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <View style={[elementStyle, gradientStyle]}>
                <Avatar
                  rounded
                  large
                  source={{ uri: item.photo }}
                  containerStyle={{ marginRight: 20 }}
                  onPress={() => this._getProfile(item)}
                />
                <Text style={{ fontSize: 16, color: colors.darkgrey }}>
                  {item.opponentName}
                </Text>
                <Button
                  rounded
									backgroundColor={colors.lightred}
                  title={"REMIND"}
									buttonStyle={{ padding: 5, marginRight: 10 }}
                  onPress={() =>
                    this._sendReminder(item.opponent, item.gameKey)
                  }
                />
              </View>
            )}
          />
        </ScrollView>
        {/*CHAT MODAL*/}
        {this._renderChat()}
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
		paddingBottom: 10,
    paddingHorizontal: 20,
  },
  //body
  titleStyle: {
    backgroundColor: colors.transparent,
    fontWeight: "400",
    fontSize: 20,
    textAlign: "center",
    color: "#FFF",
		padding: 10,
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
		shadowOpacity: 0.2,
  },
  //chat modal
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  chatContainer: {
    position: "absolute",
    top: width * 0.05,
    width: width * 0.9,
    margin: width * 0.05,
    marginTop: 0,
    paddingTop: 10,
    justifyContent: "flex-end",
    backgroundColor: "#83D0CD",
    borderRadius: 20
  }
};

const mapStateToProps = state => {
  return {
    login: state.login,
    profile: state.profile,
    dash: state.dash
  };
};

export default connect(
  mapStateToProps,
  actions
)(Dashboard);
