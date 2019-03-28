import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class SongActions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            base_url: "http://192.168.0.153:3000"
        }
        this.playMusic = this.playMusic.bind(this);
        this.stopMusic = this.stopMusic.bind(this);
    }

    playMusic() {
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
            console.log("Play music response: ", responseJSON);
        });
    }

    stopMusic() {
        fetch(this.state.base_url + '/stopMusic')
        .then((response) => response.json())
        .then((responseJSON) => {
            console.log("Stop music response: ", responseJSON);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Button onPress={ this.playMusic } title="Search Music" color="blue" />
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