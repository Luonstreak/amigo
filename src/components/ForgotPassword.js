import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions, Keyboard, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
// RELATIVE
import * as actions from '../actions';

class ForgotPassword extends Component {
	state = { keyboard: false }

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ keyboard: true }));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboard: false }));
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	onEmailInput = (text) => {
		this.props.emailInput(text);
	}

	onButtonPress = () => {
		const { email } = this.props.login;
		firebase.auth().sendPasswordResetEmail(email).then((user) => {
			alert('Check your email for instructions to reset your password.')
			Actions.login()
		})
		Keyboard.dismiss;
	}

	renderError = () => {
		if (this.props.login.error) {
			return (
				<Text
					style={{ color: 'tomato', margin: 10 }}
				>{this.props.login.error}</Text>
			)
		} else { return null }
	}

	render() {
		return <View style={[styles.card, this.state.keyboard ? { marginTop: height * 0.1 } : { marginTop: height * 0.4 }]}>
        <View>
          <Text
            style={{
              alignSelf: "center",
							color: "#F7931E",
              fontSize: 20
            }}
          >
            Forgot Password{" "}
          </Text>
          <View>
            <TextInput style={styles.input} placeholderTextColor="rgba(0,91,234,0.5)" placeholder="Email" underlineColorAndroid="transparent" autoCapitalize="none" autoCorrect={false} returnKeyType="next" value={this.props.email} onSubmitEditing={event => this.refs.SecondInput.focus()} onChangeText={this.onEmailInput} />
          </View>
        </View>
        {this.renderError()}
        <LinearGradient start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} colors={["#00c6fb", "#005bea"]} style={styles.button}>
          <Button buttonStyle={{ backgroundColor: "transparent" }} onPress={this.onButtonPress} title="Continue" />
        </LinearGradient>
        <View style={styles.container}>
          <Button title="Go Back" backgroundColor="transparent" textStyle={{ color: "#F7931E" }} onPress={() => {
              this.props.resetError();
              Actions.pop();
            }} />
        </View>
      </View>;
	}
}

const { height, width } = Dimensions.get('window');
const styles = {
	container: {
		flexDirection: 'row',
		marginBottom: 20,
		justifyContent: 'center'
	},
	card: {
		width: (width * .8),
		marginLeft: (width * .1),
		justifyContent: 'center'
	},
	input: {
		color: 'rgb(0,91,234)',
		backgroundColor: 'rgba(0,198,251,0.1)',
		fontSize: 15,
		padding: 15,
		paddingLeft: 30,
		marginTop: 20,
		borderRadius: 50
	},
	button: {
		marginTop: 20,
		borderRadius: 50
	}
}

const mapStateToProps = state => {
	return { login: state.login };
};

export default connect(mapStateToProps, actions)(ForgotPassword);
