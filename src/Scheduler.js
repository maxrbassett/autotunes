import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import SongActionsThumbnail from './SongActionsThumbnail';
import SessionsList from './SessionsList';
import {getMe} from '../spotify-queries';
export default class SongActions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            base_url: "",
            user: ""
        }
        this.playMusic = this.playMusic.bind(this);
        this.stopMusic = this.stopMusic.bind(this);
    }

    componentDidMount() {
        getMe().then((user) => {
            this.setState({user});
        })
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
                    <SessionsList base_url={this.props.screenProps.base_url} navigation={ this.props.navigation } user={this.state.user} />
                </View>
                {/* <Button onPress={ this.playMusic } title="Schedule Music" color="blue" /> */}
                {/* <View style={ styles.thumbnail }>
                    <SongActionsThumbnail base_url={ this.state.base_url } navigation={ this.props.navigation } />
                </View> */}
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