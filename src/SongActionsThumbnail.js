import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Icon, Slider } from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import { parse } from 'qs';


export default class SongActionsThumbnail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            musicPlaying: false,
            listeningData: '',
            currentSong: '',
            artist: '',
            value: 70,
            display: false
        }

        this.playMusic = this.playMusic.bind(this);
        this.fetchSong = this.fetchSong.bind(this);
        this.pauseMusic = this.pauseMusic.bind(this);
        this.startFetchingInterval = this.startFetchingInterval.bind(this);
    }

    componentDidMount() {
        this.setState({ display: false })
        this.fetchSong().then((response) => {
            if (response.split(":")[0] !== "volume") {
                this.startFetchingInterval();
            }
        }).catch((err) => {
            console.log("err: ", err)
        })
        
    }

    fetchSong() {
        return new Promise((resolve, reject) => {
            fetch(this.props.base_url + '/getCurrentTrackDetails')
            .then((response) => response.text())
            .then((responseJSON) => {
                resolve(responseJSON);
            }).catch((err) => {
                console.log("Error making thumbnail fetch: ", err.message)
                reject(err)
            })
        })
    }


    startFetchingInterval() {
        // socket.on('songDetails', songDetails => cb(null, songDetails));
        // socket.emit('subscribeToTimer', 1000);
        var interval = setInterval(
            () => {
                this.fetchSong().then((response) => {
                    if (response.split(":")[0] !== "volume") {
                        this.parseTrackString(response);
                    } else {
                        console.log("clearing interval");
                        clearInterval(interval);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            5000
        );
    }

    parseTrackString(str) {
        var lines = str.split('\n');
        var artistName = lines[0].split("-")[0];
        console.log("Artist name: ", artistName);
        var songName = lines[0].split('-')[1];
        console.log("Song name: ", songName);

    }


    playMusic() {
        this.setState({ musicPlaying: true })
        fetch(this.props.base_url + '/playMusic', {
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
                if (responseJSON.success) {
                    console.log("Play music response: ", responseJSON);
                } else {
                    this.setState({ musicPlaying: false })
                }
            });
    }

    pauseMusic() {
        this.setState({ musicPlaying: false })
        fetch(this.props.base_url + '/pauseMusic')
            .then((response) => response.json())
            .then((responseJSON) => {
                if (responseJSON.success) {
                    console.log("Paused music");
                }
            })
    }

    openFullView() {
        console.log("Opening full view")
    }

    volumeChange(value) {
        console.log("Val: ", value)
        this.setState({ value })
        fetch(this.props.base_url + '/changeVolume')
            .then((response) => response.json())
            .then((responseJSON) => {
                if (responseJSON.success) {
                    console.log("changed volume")
                }
            })
    }

    render() {
        var { musicPlaying, display } = this.state;
        var songNameLength = ("Super long piece of text is long").length
        var artistNameLen = ("Paul Cardall").length
        if (!display) {
            return null;
        } else {
            return (
                <TouchableOpacity onPress={ this.openFullView } activeOpacity={ 0.9 } style={ styles.container }>
                    <View style={ styles.songNameContainer }>
                        <TextTicker
                            style={ styles.songName }
                            bounce={ false }
                            marqueeDelay={ 1000 }
                            duration={ songNameLength * 900 }
                        >
                            Super long piece of text is long.
                    </TextTicker>
                        <TextTicker
                            style={ styles.artistName }
                            bounce={ false }
                            marqueeDelay={ 1000 }
                            duration={ artistNameLen * 900 }
                        >
                            Paul Cardall
                    </TextTicker>
                        {/* <View style={ { borderBottomColor: '#ddd', borderBottomWidth: 1 } } /> */ }
                    </View>
                    <View style={ styles.buttonContainer }>
                        <Button
                            onPress={ (musicPlaying ? this.pauseMusic : this.playMusic) }
                            buttonStyle={ [styles.button, styles.skipButton] }
                            //  title={(musicPlaying ? "Pause Music" : "Play Music")} 
                            color="white"
                            icon={ <Icon name="skip-previous" size={ 25 } color="#ddd" /> } />
                        <Button
                            onPress={ (musicPlaying ? this.pauseMusic : this.playMusic) }
                            buttonStyle={ styles.button }
                            //  title={(musicPlaying ? "Pause Music" : "Play Music")} 
                            color="white"
                            icon={ <Icon name={ musicPlaying ? "pause" : "play-circle-outline" } size={ 70 } color="#ddd" /> } />
                        <Button
                            onPress={ (musicPlaying ? this.pauseMusic : this.playMusic) }
                            buttonStyle={ [styles.button, styles.skipButton] }
                            //  title={(musicPlaying ? "Pause Music" : "Play Music")} 
                            color="white"
                            icon={ <Icon name="skip-next" size={ 25 } color="#ddd" /> } />
                    </View>
                    <View style={ styles.volumeControlContainer }>
                        <View style={ styles.volumeIcon }>
                            <Icon style={ styles.volumeIcon } name="volume-down" size={ 20 } color="#ddd" />
                        </View>
                        <Slider
                            value={ this.state.value }
                            style={ { width: "70%" } }
                            maximumValue={ 100 }
                            step={ 1 }
                            minimumTrackTintColor={ "#ddd" }
                            maximumTrackTintColor={ "grey" }
                            onSlidingComplete={ this.volumeChange.bind(this) }
                            trackStyle={ styles.slider }
                            thumbTintColor={ "#ddd" }
                        />
                        <View style={ styles.volumeIcon }>
                            <Icon style={ styles.volumeIcon } name="volume-up" size={ 20 } color="#ddd" />
                        </View>
                    </View>

                </TouchableOpacity>
            )
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1d1d1d",
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: 'transparent',
    },
    skipButton: {
        marginTop: 25
    },
    songName: {
        color: '#ddd',
        fontSize: 20
    },
    songNameContainer: {
        textAlign: 'left',
        width: "60%"
    },
    artistName: {
        color: "#ddd",
        fontSize: 12
    },
    volumeControlContainer: {
        alignItems: "stretch",
        flexDirection: 'row',
        justifyContent: "center"
    },
    volumeIcon: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5
    },
    slider: {
        backgroundColor: 'white',
    }
})