import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { Button, Badge, Icon, Avatar } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import _ from "lodash";
import firebase from "firebase";
import { LinearGradient } from "expo";

import Chat from "./Chat";
import colors from "../styles/colors";
import * as actions from "../actions";

class GuessResult extends Component {
  state = {
    show: false
  };

  renderAskBackButton = (prevQ, nxtQ) => {
    if (!nxtQ || prevQ.value.questionNumber !== nxtQ.value.questionNumber) {
      return (
        <Button
          title={"ASK BACK"}
					textStyle={{ fontSize: 14, color: colors.darkgrey }}
          buttonStyle={styles.chooseButton}
          onPress={() => Actions.askBack({ prevQ })}
        />
      );
    }
  };

  renderColor = (userAnswer, opponentAnswer, option) => {
    if (userAnswer === opponentAnswer && option === userAnswer) return colors.right;
		else {
      if (option === userAnswer) return colors.wrong;
			else if (option === opponentAnswer) return colors.right;
			else return colors.lightgrey;
		} 
	};
	
  renderCard = (item, index, length) => {
    const { opponent } = this.props.game;
    const { uid } = this.props.login;
    const { info } = this.props.player;
    var whos;
    if (length % 2 === 0) {
      whos =
        index % 2 === 0
          ? [`${info.opponentName}`, "your"]
          : ["you", `${info.opponentName}'s`];
    } else {
      whos =
        index % 2 === 1
          ? [`${info.opponentName}`, "your"]
          : ["you", `${info.opponentName}'s`];
    }
    return <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.question}>
            <Text style={{ fontSize: 30, color: colors.darkgrey }}>
              {item.value.content}
            </Text>
          </View>
          <View style={styles.user}>
            <Badge value={whos[1] + " answer was.."} textStyle={{ color: colors.darkgrey, fontSize: 14, marginVertical: 5 }} containerStyle={{ backgroundColor: colors.lightgrey }} />
          </View>
          <View style={styles.options}>
            <Button
							title={item.value.choices.option1}
							textStyle={{ color: "option1" === item.value[uid] || "option1" === item.value[opponent] ? colors.lightgrey : colors.darkgrey }}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], "option1") }]}
						/>
            <Button
							title={item.value.choices.option2}
							textStyle={{ color: "option2" === item.value[uid] || "option2" === item.value[opponent] ? colors.lightgrey : colors.darkgrey }}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], "option2") }]}
						/>
            <Button
							title={item.value.choices.option3}
							textStyle={{ color: "option3" === item.value[uid] || "option3" === item.value[opponent] ? colors.lightgrey : colors.darkgrey }}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], "option3") }]}
						/>
            <Button
							title={item.value.choices.option4}
							textStyle={{ color: "option4" === item.value[uid] || "option4" === item.value[opponent] ? colors.lightgrey : colors.darkgrey }}
							buttonStyle={[styles.option, { backgroundColor: this.renderColor(item.value[uid], item.value[opponent], "option4") }]}
						/>
          </View>
        </ScrollView>
      </View>;
  };

  _renderMenu = () => {
    const { uid } = this.props.login;
    const { opponent, gameKey } = this.props.game;
    const { info } = this.props.player;
    if (this.state.show) {
      return (
        <View
          style={{
            position: "absolute",
            top: 40,
            right: 5,
            borderRadius: 10,
            backgroundColor: "#e6e6fa"
          }}
        >
          <Button
            title={"Block User"}
            onPress={() => {
              this.props.reportUser(
                gameKey,
                opponent,
                uid,
                null,
                info.opponentName,
                info.opponentPhoto
              ),
                this.setState({ show: false });
            }}
            buttonStyle={styles.chooseButton}
          />
          <Button
            title={"Report Abuse"}
            onPress={() => {
              Actions.reportAbuse(info.opponentName, info.opponentPhoto),
                this.setState({ show: false });
            }}
            buttonStyle={styles.chooseButton}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    if (!this.props.player.info) {
      return (
        <ActivityIndicator
          animating={true}
          style={[styles.container, styles.horizontal]}
          size="large"
        />
      );
    }
    const data = this.props.lastFive;
    const { score, opponent } = this.props.game;
    const { uid } = this.props.login;
    const { container, header, badge } = styles;
    const { photo, opponentPhoto } = this.props.dash.info;
    return (
      <ImageBackground
        source={require("../static/background.png")}
        style={container}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => this.setState({ show: false })}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[colors.darkred, colors.lightred]}
            style={header}
          >
            <View style={badge}>
              <Avatar rounded small source={{ uri: photo }} />
              <Text style={{ color: colors.grey, paddingHorizontal: 20 }}>
                {(score[uid] = 0)}
              </Text>
            </View>

            <Icon
              name="home"
              type="material-community"
              color={colors.lightgrey}
              underlayColor={colors.transparent}
              size={40}
              onPress={() => Actions.popTo("dashboard")}
            />

            <View style={badge}>
              <Text style={{ color: colors.grey, paddingHorizontal: 20 }}>
                {(score[opponent] = 0)}
              </Text>
              <Icon
                onPress={() => this.setState({ show: !this.state.show })}
                name="ellipsis-v"
                type="font-awesome"
                color={colors.grey}
                underlayColor={colors.transparent}
                containerStyle={{ paddingRight: 10 }}
              />
              <Avatar rounded small source={{ uri: opponentPhoto }} />
            </View>
          </LinearGradient>
          <FlatList
            horizontal
            pagingEnabled={true}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index
            })}
            keyExtractor={(item, index) => item.key}
            initialScrollIndex={data.length - 1}
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={({ item, index }) =>
              this.renderCard(item, index, data.length)
            }
          />
          <View style={styles.choiceBar}>
            {this.renderAskBackButton(
              data[data.length - 1],
              data[data.length - 2]
            )}
            <Button
              title={"NEW QUESTION"}
              textStyle={{ fontSize: 14, color: colors.darkgrey }}
              buttonStyle={styles.chooseButton}
              onPress={() => {
                Actions.categories();
              }}
            />
          </View>
          <Chat />
        </TouchableOpacity>
        {this._renderMenu()}
      </ImageBackground>
    );
  }
}
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  //global
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.lightgrey
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  // header
  header: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 10,
    // paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between"
  },
  badge: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.lightgrey,
    borderRadius: 20
  },
  //card
  card: {
    flex: 1,
    width: width - 40,
		margin: 20,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.2
  },
  question: {
    marginBottom: 10,
    flex: 2,
    alignItems: "center"
  },
  user: {
    marginBottom: 10,
    justifyContent: "center"
  },
  options: {
    flex: 4,
    alignItems: "center"
  },
  option: {
    width: 250,
    margin: 10,
    backgroundColor: colors.lightgrey,
    borderRadius: 25
  },
  // lower card
  choiceBar: {
    height: 50,
    width: width - 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
		padding: 10,
		margin: 20,
		marginTop: 0,
		borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.2
  },
  chooseButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
		backgroundColor: colors.lightgrey,
		borderRadius: 25
  },
  //footer - chat
  chat: {
    height: 50,
    marginTop: 10,
    backgroundColor: "#ADD8E6"
  },
  input: {
    backgroundColor: "#96EAD7",
    margin: 10,
    borderRadius: 10,
    padding: 10
  },
  spiner: {
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  const arr = [];
  _.forIn(state.game.lastFive, (value, key) => {
    arr.push({ key, value });
  });
  return {
    lastFive: arr,
    game: state.game,
    login: state.login.user,
    dash: state.dash,
    player: state.player
  };
};

export default connect(
  mapStateToProps,
  actions
)(GuessResult);
