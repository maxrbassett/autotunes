import React from 'react';
import { View, StyleSheet, Text, DatePickerIOS, ActivityIndicator, Image, Switch, TextInput, Button, Keyboard, FlatList } from 'react-native';
import { ListItem, CheckBox } from 'react-native-elements';
import { getUserPlaylist } from '../spotify-queries';

const mapToDay = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

const mapToDayShortcut = {
    0: "SU",
    1: "M",
    2: "TU",
    3: "W",
    4: "TH",
    5: "F",
    6: "SA"
}

export default class CreateSession extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            chosenDate: new Date(),
            playlists: [],
            selectedPlaylist: null,
            sessionName: "",
            hour: null,
            minute: null,
            day_of_week: null,
            cronArray: [],//list of all of the repeat days in cron style
            duration: 120,//in minutes
            extras: {
                motionActivated: false,
                fade: true,
                random: true
            },
            saving: false

        };
        this.setModalVisible = this.setModalVisible.bind(this);
        this.doneClicked = this.doneClicked.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.playlistSelected = this.playlistSelected.bind(this);
        this.changeState = this.changeState.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.formatRepeat = this.formatRepeat.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ doneCreatingSessionClicked: this.doneClicked });
        getUserPlaylist(this.props.navigation.getParam('user').id).then((response) => {
            this.setState({ playlists: response.items });
        })
    }

    changeState(key, value) {
        this.setState({ [key]: value })
    }

    doneClicked() {
        this.setState({ saving: true })
        var spotifyUriArray = this.state.selectedPlaylist.uri.split(":");
        spotifyUriStr = spotifyUriArray[0] + ":user:" + this.props.navigation.getParam('user').id + ":playlist:" + spotifyUriArray[2];
        var sessionObject = {
            "schedule": {
                "minute": this.state.minute,
                "hour": this.state.hour,
                "day_of_month": "*",
                "month": "*",
                "day_of_week": this.state.day_of_week
            },
            "sessionName": this.state.sessionName,
            "duration": this.state.duration,
            "spotifyUri": spotifyUriStr,
            "imageUri": (this.state.selectedPlaylist.images.length > 0 ? this.state.selectedPlaylist.images[0].url : "https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image-300x225.png"),
            "useMotionToActivate": this.state.motionActivated, // optional
            "random": this.state.random, // optional
            "fadeIn": this.state.fade // optional
        }
        fetch("http://" + this.props.navigation.getParam('base_url') + ':3000/addSession', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionObject)
        })
            .then((response) => response.text())
            .then((responseJSON) => {
                // console.log("After adding session: ", responseJSON);
                this.setState({ saving: false });
                this.props.navigation.getParam('fetchAllSessions')();
                this.props.navigation.goBack();
            })
            .catch((err) => {
                console.log("Error saving session: ", err);
                this.setState({ saving: false });
            })

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    playlistSelected(playlist) {
        this.setState({ selectedPlaylist: playlist, sessionName: (playlist.name + " Session") });
    }

    renderItem(data) {
        var playlist = data.item;
        return (
            <ListItem
                key={ data.index }
                leftAvatar={ { size: "small", rounded: false, source: { uri: (playlist.images.length > 0 ? playlist.images[0].url : "https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image-300x225.png") } } }
                title={ playlist.name }
                titleStyle={ { color: 'black', fontWeight: 'bold' } }
                subtitle={ playlist.tracks.total + " tracks" }
                bottomDivider
                // leftIcon={ this.state.editView ? <Icon name="do-not-disturb-on" size={ 20 } color="red" /> : null }
                chevron
                onPress={ () => this.playlistSelected(playlist) }
            // this.state.editView ? () => this.remove(playlist) : () => this.props.navigation.navigate("SessionDetails", { title: playlist.title, playlist }) }
            />
        )
    }

    keyExtractor(item, index) {
        return item.id;
    }

    formatDate() {
        var date = this.state.chosenDate;
        if (date === null) return "Never";

        var durationHours = this.state.duration / 60;
        var hour = date.getHours() === 0 ? 12 : date.getHours();
        hour = (hour > 12 ? (hour - 12) : (hour));
        var hour2 = (hour + durationHours > 12 ? ((hour + durationHours) - 12) : (hour + durationHours));
        var ampm1 = (date.getHours() > 12 ? "pm" : "am");
        var ampm2 = (date.getHours() + durationHours >= 24 ? "am" : "pm");
        var returnStr = ""

        if (this.isToday(this.state.chosenDate)) returnStr = "Today"
        else returnStr = mapToDay[date.getDay()]

        return (returnStr + " " + hour + ampm1 + "-" + hour2 + ampm2);
    }

    isToday(someDate) {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }

    formatRepeat() {
        var repeatStr = "Every ";
        if (this.state.day_of_week === null || this.state.day_of_week === "") return "Never";
        else if (this.state.day_of_week.split(",").length === 7) return "Every day";
        else {
            this.state.day_of_week.split(",").map((item, index) => {
                repeatStr += (mapToDayShortcut[item])
                if (index !== this.state.day_of_week.split(",").length - 1) repeatStr += ","
            });
            return repeatStr;
        }
    }


    render() {
        return (
            <View style={ styles.container }>
                <View style={ this.state.saving ? styles.savingLoader : styles.hide }>
                    <ActivityIndicator size="large" color="white" />
                </View>
                {
                    this.state.selectedPlaylist !== null ?
                        <View>
                            <View style={ styles.image }>
                                <Image
                                    style={ { width: 200, height: 200 } }
                                    source={ { uri: (this.state.selectedPlaylist.images.length > 0 ? this.state.selectedPlaylist.images[0].url : "https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image-300x225.png") } }
                                />
                            </View>
                            <TextInput
                                style={ { padding: 10, fontSize: 30, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,.1)" } }
                                placeholder="Session name"
                                value={ this.state.sessionName }
                                onChangeText={ (text) => this.setState({ sessionName: text }) }
                            />
                            <ListItem
                                title={ "Start" }
                                titleStyle={ { color: 'black' } }
                                rightTitle={ this.formatDate() }
                                rightTitleStyle={ { width: 200, textAlign: 'right' } }
                                bottomDivider
                                chevron
                                onPress={ () => this.props.navigation.navigate('DatePicker', {
                                    changeState: this.changeState,
                                    chosenDate: this.state.chosenDate,
                                    duration: this.state.duration
                                }) }
                            />
                            <ListItem
                                title={ "Repeat" }
                                titleStyle={ { color: 'black' } }
                                rightTitle={ this.formatRepeat() }
                                rightTitleStyle={ { width: 200, textAlign: 'right' } }
                                bottomDivider
                                chevron
                                onPress={ () => this.props.navigation.navigate('WeekdayPicker', {
                                    changeState: this.changeState,
                                    day_of_week: this.state.day_of_week,
                                    cronArray: this.state.cronArray
                                }) }
                            />
                            <ListItem
                                title={ "Extra Options" }
                                titleStyle={ { color: 'black' } }
                                rightTitleStyle={ { width: 200, textAlign: 'right' } }

                                rightTitle={ "None" }
                                bottomDivider
                                chevron
                                onPress={ () => this.props.navigation.navigate('ExtraOptions', {
                                    changeState: this.changeState,
                                    extras: this.state.extras
                                }) }
                            />

                        </View>
                        :
                        <View style={ styles.playlist }>
                            <FlatList
                                data={ this.state.playlists }
                                keyExtractor={ this.keyExtractor }
                                renderItem={ this.renderItem } />

                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toggleBar: {
        height: 40,
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,.1)',
        borderBottomWidth: 1
    },
    toggleSwitch: {
        alignItems: 'flex-end'
    },
    datePicker: {
        borderBottomColor: 'rgba(0,0,0,.1)',
        borderBottomWidth: 1
    },
    repeatText: {
        color: 'black'
    },
    image: {
        alignItems: 'center'
    },
    extraOptionsCheckboxes: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    hide: {
        display: 'none'
    },
    savingLoader: {
        position: 'absolute',
        top: '30%',
        left: '30%',
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 5,
        zIndex: 5
    }
});