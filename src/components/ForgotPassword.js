import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Dimensions,
  Keyboard,
  AsyncStorage
} from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { LinearGradient } from "expo";
import { Actions } from "react-native-router-flux";
import firebase from "firebase";
// RELATIVE
import * as actions from "../actions";
import colors from "../styles/colors";

class ForgotPassword extends Component {
  state = { keyboard: false };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      this.setState({ keyboard: true })
    );
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      this.setState({ keyboard: false })
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onEmailInput = text => {
    this.props.emailInput(text);
  };

  onButtonPress = () => {
    const { email } = this.props.login;
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(user => {
        alert("Check your email for instructions to reset your password.");
        Actions.login();
      });
    Keyboard.dismiss;
  };

  renderError = () => {
    if (this.props.login.error) {
      return (
        <Text style={{ color: "tomato", margin: 10 }}>
          {this.props.login.error}
        </Text>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <View style={[styles.card,
          this.state.keyboard
            ? { marginTop: height * 0.1 }
            : { marginTop: height * 0.4 }
        ]}
      >
				<Text style={{ fontSize: 24, color: colors.darkred, fontWeight: "400" }}>SING UP</Text>
				<TextInput
					style={styles.input}
					placeholderTextColor={colors.darkred}
					placeholder="Email"
					underlineColorAndroid="transparent"
					autoCapitalize="none"
					autoCorrect={false}
					returnKeyType="next"
					value={this.props.email}
					onSubmitEditing={event => this.refs.SecondInput.focus()}
					onChangeText={this.onEmailInput}
				/>
				{this.renderError()}
				<LinearGradient
					start={{ x: 0.0, y: 0.5 }}
					end={{ x: 1.0, y: 0.5 }}
					colors={[colors.darkred, colors.red]}
					style={styles.button}
				>
					<Button
						buttonStyle={{ backgroundColor: "transparent" }}
						onPress={this.onButtonPress}
						title="Continue"
					/>
				</LinearGradient>
				<Button
					title="Go Back"
					backgroundColor="transparent"
					textStyle={{ color: "#F7931E" }}
					onPress={() => {
						this.props.resetError();
						Actions.pop();
					}}
				/>
			</View>
    );
  }
}

const { height, width } = Dimensions.get("window");
const styles = {
  card: {
    width: width * 0.8,
    marginLeft: width * 0.1,
		alignItems: 'center'
  },
	input: {
		width: width * .8,
		color: colors.darkred,
		backgroundColor: colors.lightyellow,
		fontSize: 15,
		paddingHorizontal: 25,
		paddingVertical: 15,
		marginVertical: 10,
		borderRadius: 50
	},
	button: {
		width: width * .8,
		marginVertical: 10,
		borderRadius: 50
	}
};

const mapStateToProps = state => {
  return { login: state.login };
};

export default connect(
  mapStateToProps,
  actions
)(ForgotPassword);
