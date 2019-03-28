import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class SongActions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            base_url: "http://192.168.0.153:3000",
            musicPlaying: false
        }
        this.playMusic = this.playMusic.bind(this);
        this.stopMusic = this.stopMusic.bind(this);
    }

    playPauseMusic() {
        fetch(this.state.base_url + '/playMusic', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //     firstParam: 'yourValue',
            //     secondParam: 'yourOtherValue',
            // }),
        }).then((response) => response.json())
        .then((responseJSON) => {
            if(responseJSON.success){
                console.log("Play music response: ", responseJSON);
                this.setState({musicPlaying: true})
            }
        });
    }

    pauseStopCommand(command) {
        fetch(this.state.base_url + command)
        .then((response) => response.json())
        .then((responseJSON) => {
            if(responseJSON.success){
                console.log("Paused music response: ", responseJSON)
                this.setState({musicPlaying: false})
            }
        })
    }

    render() {
        var musicPlaying = this.state.musicPlaying
        return (
            <View style={styles.container}>
                <Button onPress={(musicPlaying ? this.playMusic : () => this.pauseStopCommand("/pauseMusic"))} title={(musicPlaying ? "Pause Music" : "Play Music")} color="blue" />
                <Button onPress={() =>  this.simpleCommand('/stopMusic') } title="Stop Music" color="red" />
            </View>
        )
    }

}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})