import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { getPlaylistTracks } from '../spotify-queries';
import { ScrollView } from 'react-native-gesture-handler';

export default class SessionDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks: []
        }
    }
    componentDidMount() {
        this.props.navigation.setParams({"edit": this.edit});
        getPlaylistTracks(this.props.navigation.getParam("playlist").spotifyUri).then((tracks) => {
            // console.log("Tracks: ", tracks.items["0"])
            this.setState({ tracks: Object.entries(tracks.items) })
        }).catch((err) => {
            console.log("ERR ON COMPONENT DID MOUNT: ", err)
        })
    }

    playTrack(item) {
        console.log("Play track", item);
    }

    edit() {
        console.log("Editing");
    }

    render() {
        var playlist = this.props.navigation.getParam("playlist");
        return (
            <View style={ styles.container }>
                <ListItem 
                    leftAvatar={ { size: "xlarge", rounded: false, source: { uri: playlist.imageUri } } }
                    title={ playlist.sessionName }
                    titleStyle={ { color: 'black', fontWeight: 'bold' } }
                    subtitle={this.props.navigation.getParam('subtitle')}
                    bottomDivider                    
                />
                <ScrollView>
                    {
                        this.state.tracks.length === 0 ?
                            <ActivityIndicator style={styles.indicator} size="large" color="black" />
                            :
                            this.state.tracks.map((entry, index) => {
                                var id = entry[0];
                                var item = entry[1];
                                return (
                                    <ListItem
                                        key={ index }
                                        title={ item.track.name }
                                        titleStyle={ { color: 'black', fontWeight: 'bold' } }
                                        subtitle={ item.track.artists[0].name }
                                        onPress={ () => this.playTrack(item) }
                                    />
                                )
                            })

                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicator: {
        marginTop: 20
    }
})