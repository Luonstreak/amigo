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
import { LinearGradient } from "expo";
import { Button, Badge, Icon, Avatar } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Chat from "./Chat";
import { connect } from "react-redux";
import _ from "lodash";

import colors from "../styles/colors";
import * as actions from "../actions";

class Guess extends Component {
  state = {
    show: false
  };

	renderColor = (userAnswer, opponentAnswer, option) => {
		if (userAnswer === opponentAnswer) {
			if (option === userAnswer) { return colors.wrong; }
			else if (option === opponentAnswer) { return colors.wrong; }
			else { return colors.lightgrey; }
		} else {
			if (option === userAnswer) { return colors.wrong; }
			else if (option === opponentAnswer) { return colors.right; }
			else { return colors.lightgrey; }
		}
	}

  select = (num, questionKey, opponentAnswer, item, uid) => {
    const { gameKey, opponent, score } = this.props.game;
    const { selectedPlayer } = this.props.player;
    const { phone } = this.props.dash.info;
    const newScore = score ? score[uid] : 0;
    this.props.checkAnswers(
      num,
      questionKey,
      gameKey,
      opponent,
      opponentAnswer,
      item,
      newScore,
      selectedPlayer,
      phone
    );
    this.props.changeStatus("guessResult", uid, gameKey, opponent);
  };

  renderCard = (item, index, length) => {
    const { opponent } = this.props.game;
    const { uid } = this.props.login;
    const { info } = this.props.player;
    const isLast = index !== length - 1;
    var who;
    if (length % 2 === 0) {
      who =
        index % 2 === 0
          ? [`${info.opponentName}`, "your"]
          : ["you", `${info.opponentName}'s`];
    } else {
      who =
        index % 2 === 1
          ? [`${info.opponentName}`, "your"]
          : ["you", `${info.opponentName}'s`];
    }

    return (
      <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
        <View style={styles.question}>
          <Text style={{ fontSize: 30, color: colors.darkgrey }}>{item.value.content}</Text>
        </View>
        {index === length - 1 ? (
          <View style={styles.user}>
            <Badge
              value={`${info.opponentName}'s answer was..`}
              textStyle={{ color: colors.darkgrey, fontSize: 14, marginVertical: 5 }}
              containerStyle={{ backgroundColor: colors.lightgrey }}
            />
          </View>
        ) : (
          <View style={styles.user}>
            <Badge
              value={
                item.value[uid] == item.value[opponent]
                  ? `${who[0]} guessed right!`
                  : `${who[0]} guessed wrong!`
              }
              textStyle={{
                color:
                  item.value[uid] == item.value[opponent]
                    ? "mediumseagreen"
                    : "tomato",
                fontSize: 20
              }}
              containerStyle={{ backgroundColor: "transparent" }}
            />
            <Badge
              value={who[1] + " answer was.."}
              textStyle={{ color: colors.darkgrey, fontSize: 14, marginVertical: 5 }}
              containerStyle={{ backgroundColor: colors.lightgrey }}
            />
          </View>
        )}
        <View style={styles.options}>
					<Button
						title={item.value.choices.option1}
						textStyle={{color: colors.darkgrey}}
						buttonStyle={[styles.option, isLast ? {backgroundColor: this.renderColor(item.value[uid],item.value[opponent],"option1")} : null]}
						onPress={() => {isLast ? null : this.select(1, item.key, item.value[opponent], item, uid);}}
					/>
					<Button
						title={item.value.choices.option2}
						textStyle={{color: colors.darkgrey}}
						buttonStyle={[styles.option, isLast ? {backgroundColor: this.renderColor(item.value[uid],item.value[opponent],"option2")} : null]}
						onPress={() => {isLast ? null : this.select(2, item.key, item.value[opponent], item, uid);}}
					/>
					<Button
						title={item.value.choices.option3}
						textStyle={{color: colors.darkgrey}}
						buttonStyle={[styles.option, isLast ? {backgroundColor: this.renderColor(item.value[uid],item.value[opponent],"option3")} : null]}
						onPress={() => {isLast ? null : this.select(3, item.key, item.value[opponent], item, uid);}}
					/>
					<Button
						title={item.value.choices.option4}
						textStyle={{color: colors.darkgrey}}
						buttonStyle={[styles.option, isLast ? {backgroundColor: this.renderColor(item.value[uid],item.value[opponent],"option4")} : null]}
						onPress={() => {isLast ? null : this.select(4, item.key, item.value[opponent], item, uid);}}
					/>
        </View>
      </ScrollView>
    );
  };

  _renderMenu = () => {
    const { uid } = this.props.login;
    const { opponent, gameKey } = this.props.game;
    if (this.state.show) {
      return (
        <View
          style={{
            position: "absolute",
            top: 40,
            right: 5,
            borderRadius: 25,
            backgroundColor: colors.lightgrey
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
		const { info } = this.props.player;
		const { photo, opponentPhoto } = this.props.dash.info;
    const { container, header, badge } = styles;
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
              <Avatar
                rounded
                small
                source={{ uri: photo }}
              />
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
              <Avatar
                rounded
                small
								source={{ uri: opponentPhoto }}
              />
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
          <Chat />
        </TouchableOpacity>
        {this._renderMenu()}
      </ImageBackground>
    );
  }
}
const { height, width } = Dimensions.get("window");
const styles = {
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
    borderRadius: 10
  },
  question: {
    marginBottom: 20,
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
    borderRadius: 25,
  },
  // lower card
  chooseCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 30,
    borderRadius: 25,
    backgroundColor: colors.lightgrey
  },
  chooseButton: {
    margin: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: colors.lightred
  }
};

const mapStateToProps = state => {
  const arr = [];
  _.forIn(state.game.lastFive, (value, key) => {
    arr.push({ key, value });
  });
  return {
    lastFive: arr,
    game: state.game,
    login: state.login.user,
    player: state.player,
    dash: state.dash
  };
};

export default connect(
  mapStateToProps,
  actions
)(Guess);
