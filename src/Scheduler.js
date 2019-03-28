import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import SongActionsThumbnail from './SongActionsThumbnail';
import SchedulerList from './SchedulerList';

export default class SongActions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            base_url: ""
        }
        this.playMusic = this.playMusic.bind(this);
        this.stopMusic = this.stopMusic.bind(this);
    }

    componentDidMount() {
        this.setState({ base_url: this.props.screenProps.base_url })
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
            <View style={ styles.container }>
                <View style={ styles.schedulerList }>
                    <SchedulerList />
                </View>
                <Button onPress={ this.playMusic } title="Schedule Music" color="blue" />
                <View style={ styles.thumbnail }>
                    <SongActionsThumbnail base_url={ this.state.base_url } navigation={ this.props.navigation } />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    schedulerList: {
        flex: 1,
        width: '100%'
    },
    thumbnail: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    }
})