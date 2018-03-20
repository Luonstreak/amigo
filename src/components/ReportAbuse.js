import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons';
import { connect } from 'react-redux';

import * as actions from '../actions';

class ReportAbuse extends React.Component {
	state = {}

	render() {
		return (
			<View style={styles.container}>
				{this.renderCheckList()}
			</View>
		);
	}

	_reportUser = () => {
		const { uid } = this.props.login
		const { opponent, gameKey } = this.props.game
		const opName = this.props.opponentName
		const opPhoto = this.props.opponentPhoto
		const reason = this.state.checkListOption
		this.props.reportUser(gameKey, opponent, uid, reason, opName, opPhoto)
	}

	renderCheckList() {
		const options = [
			"Harassment",
			"Hate Speech",
			"Violence"
		];

		setSelectedOption = (checkListOption) => {
			this.setState({
				checkListOption,
			});
		}

		renderOption = (option, selected, onSelect, index) => {

			const textStyle = {
				paddingTop: 10,
				paddingBottom: 10,
				color: 'black',
				flex: 1,
				fontSize: 14,
			};
			const baseStyle = {
				flexDirection: 'row',
			};
			var style;
			var checkMark;

			if (index > 0) {
				style = [baseStyle, {
					borderTopColor: '#eeeeee',
					borderTopWidth: 1,
				}];
			} else {
				style = baseStyle;
			}

			if (selected) {
				checkMark = <Text style={{
					flex: 0.1,
					color: '#007AFF',
					fontWeight: 'bold',
					paddingTop: 8,
					fontSize: 20,
					alignSelf: 'center',
				}}>✓</Text>;
			}

			return (
				<TouchableWithoutFeedback onPress={onSelect} key={index}>
					<View style={style}>
						<Text style={textStyle}>{option}</Text>
						{checkMark}
					</View>
				</TouchableWithoutFeedback>
			);
		}

		renderContainer = (options) => {
			return (
				<View style={{
					backgroundColor: 'white',
					paddingLeft: 20,
					borderTopWidth: 1,
					borderTopColor: '#cccccc',
					borderBottomWidth: 1,
					borderBottomColor: '#cccccc',
				}}>
					{options}
				</View>
			);
		}

		return (
			<View style={{ flex: 1 }}>
				<View style={{ marginTop: 10, backgroundColor: 'white' }}>
					{/* <Text style={{ padding: 20, fontWeight: 'bold' }}>VerticalSelect</Text> */}
					<View style={{
						backgroundColor: '#eeeeee',
						paddingTop: 5,
						paddingBottom: 5,
					}}>
						<Text style={{
							color: '#555555',
							paddingLeft: 20,
							marginBottom: 5,
							marginTop: 5,
							fontSize: 12,
						}}>{`Pressing submit will block ${this.props.opponentName} and send this game's details to the administrators for review and possible action.`}</Text>
						<RadioButtons
							options={options}
							onSelection={setSelectedOption}
							selectedOption={this.state.checkListOption}
							renderOption={renderOption}
							renderContainer={renderContainer}
						/>
					</View>
						<Button 
							buttonStyle={styles.button}
							title={'Submit'}
							onPress={() => {
								alert(`${this.props.opponentName} has been reported. Thank you.`),
								this._reportUser()
						}}
						/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	button: {
		margin: 10,
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 10,
		backgroundColor: '#0099FF'
	},
});

const mapStateToProps = state => {
	return { game: state.game, login: state.login.user };
};

export default connect(mapStateToProps, actions)(ReportAbuse);
