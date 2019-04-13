import React from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default class ExtraOptions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fade: false,
            motionSense: false,
            random: false,
        }
        this.changeState = this.changeState.bind(this);
    }

    changeState(key, value){
        this.setState({[key]: value});
        this.props.navigation.getParam('changeState')(key, value)
    }

    render() {
        return (
            <View>
                <CheckBox
                    title="Fade in"
                    checked={ this.state.fadeInOption }
                    onPress={ () => this.changeStatethis.setState({ fadeInOption: !this.state.fadeInOption }) }
                />
                <CheckBox
                    title="Use motion detector to play music"
                    checked={ this.state.motionSensor }
                    onPress={ () => this.setState({ motionSense: !this.state.motionSense }) }
                />
                <CheckBox
                    title={ "Shuffle songs" }
                    checked={ this.state.random }
                    onPress={ () => this.setState({ random: !this.state.random}) }
                />
            </View>
        )
    }
}