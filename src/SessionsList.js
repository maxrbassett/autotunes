import React from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Card, Button, Icon, ListItem, Image } from 'react-native-elements';
import CreateSession from './CreateSession';

var data = [
    {
        id: "1",
        title: "Paul Cardall Playlist",
        schedule: {
            //Try to have this in cron style
            // * (minute 0-59) * (hour 0-24) * (day_of_month 1-31) * (month 1-12) * (Day_of_week 0-6)
            minute: 0,
            hour: 9,
            day_of_month: "*",
            month: "*",
            day_of_week: "0"
        },
        imageUri: "https://mainlypiano.com/new_site/images/album_reviews/paul-cardall-new-life.jpg",
        playlistUri: "spotify:user:1236454592:playlist:5bXpAYwggtSvnGJWIZynYo"
    },
    {
        id: "2",
        title: "Jazz Playlist",
        schedule: {
            //Try to have this in cron style
            // * (minute 0-59) * (hour 0-24) * (day_of_month 1-31) * (month 1-12) * (Day_of_week 0-6)
            minute: 0,
            hour: 17,
            day_of_month: "*",
            month: "*",
            day_of_week: "1-6"
        },
        imageUri: "https://www.udiscovermusic.com/wp-content/uploads/2015/10/100-jazz-albums-header.jpg",
        playlistUri: "spotify:user:spotify:playlist:37i9dQZF1DX4wta20PHgwo"
    }
]

const mapToDay = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat"
}

export default class SchedulerList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editView: false,
            modalVisible: false,
            allSessions: [],
            loading: false
        }
        this.editClicked = this.editClicked.bind(this);
        this.createClicked = this.createClicked.bind(this);
        this.fetchAllSessions = this.fetchAllSessions.bind(this);
        this.removeConfirmed = this.removeConfirmed.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ editView: this.state.editView, editClicked: this.editClicked, createClicked: this.createClicked })
        this.fetchAllSessions();
    }

    fetchAllSessions() {
        console.log(this.props.base_url)
        this.setState({ loading: true })
        fetch("http://" + this.props.base_url + ":3000/getAllSessions")
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({ allSessions: responseJSON, loading: false });
            }).catch((err) => {
                console.log("Could not fetch sessions: ", err);
                this.setState({ loading: false })
            })

    }

    convertMinute(minute) {
        minute = minute.toString();
        if (minute.length === 1) {
            return "0" + minute;
        } else return minute;
    }

    convertHour(hour) {
        hour = hour.toString();
        if (hour > 12) {
            return hour - 12;
        } else return hour;
    }

    getAmPm(hour) {
        hour = hour.toString();
        if (hour > 12) {
            return "pm";
        } else return "am";
    }

    getFormattedTime(playlist) {
        var formattedTime = "";
        if(playlist.schedule.day_of_week === null ) return "Doesn't repeat"
        var weekDays = playlist.schedule.day_of_week.split(",");
        if (weekDays.length === 7) formattedTime += "Every day"
        else {
            weekDays.map((day, ind) => {
                formattedTime += mapToDay[day];
                if (ind !== weekDays.length - 1) formattedTime += " ";
            })
        }
        formattedTime += " at " + this.convertHour(playlist.schedule.hour) + ":" + this.convertMinute(playlist.schedule.minute) + " " + this.getAmPm(playlist.schedule.hour);
        return formattedTime;
    }

    editClicked() {
        this.props.navigation.setParams({ editView: !this.state.editView })
        this.setState({ editView: !this.state.editView })
        if (this.state.modalVisible) {
            this.setState({ modalVisible: false })
        }
    }

    createClicked() {
        // this.setState({modalVisible: true})
        this.props.navigation.navigate('CreateSession', {
            sessionEditType: "Create",
            user: this.props.user,
            base_url: this.props.base_url,
            fetchAllSessions: this.fetchAllSessions
        });

    }

    removeAlert(playlist) {
        Alert.alert(
            "Delete " + playlist.sessionName + "?",
            "This action cannot be undone",
            [
                { text: 'No' },
                { text: 'Yes', onPress: () => this.removeConfirmed(playlist.id) }
            ]
        )
    }

    removeConfirmed(id) {
        this.setState({ loading: true })
        fetch("http://" + this.props.base_url + ":3000/removeSession/" + id, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.text())
            .then((responseJSON) => {
                console.log("Delete response: ", responseJSON);
                this.fetchAllSessions();
            }).catch((err) => {
                console.log("Error deleting: ", err);
                this.setState({ loading: false });
            })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <View style={ this.state.loading ? styles.loading : styles.hide }>
                    <ActivityIndicator size="small" color="black" />
                </View>
                <ScrollView>
                    {
                        this.state.allSessions.map((playlist, index) => {
                            var formattedTime = this.getFormattedTime(playlist);
                            return (
                                <ListItem
                                    key={ index }
                                    leftAvatar={ { size: "large", rounded: false, source: { uri: playlist.imageUri } } }
                                    title={ playlist.sessionName }
                                    titleStyle={ { color: 'black', fontWeight: 'bold' } }
                                    subtitle={ formattedTime }
                                    bottomDivider
                                    leftIcon={ this.state.editView ? <Icon name="do-not-disturb-on" size={ 20 } color="red" /> : null }
                                    chevron={ this.state.editView ? false : true }
                                    onPress={
                                        this.state.editView ? () => this.removeAlert(playlist) : () => this.props.navigation.navigate("SessionDetails", { playlist, subtitle: formattedTime }) }
                                />
                            )
                        })
                    }
                    <View style={ styles.addSessionButton }>
                        < Button
                            title="Create Session"
                            raised
                            onPress={ this.createClicked }
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loading: {
        paddingTop: 10
    },
    hide: {
        display: 'none'
    },
    addSessionButton: {
        alignItems: 'center',
        marginTop: 20,
        padding: 20
    }
})