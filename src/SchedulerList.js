import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Card, Button, Icon, ListItem, Image } from 'react-native-elements';

var data = [
    {
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
        imageUri: "https://mainlypiano.com/new_site/images/album_reviews/paul-cardall-new-life.jpg"
    },
    {
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
        imageUri: "https://www.udiscovermusic.com/wp-content/uploads/2015/10/100-jazz-albums-header.jpg"
    }
]

const mapToDay = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

export default class SchedulerList extends React.Component {
    convertMinute(minute) {
        minute = minute.toString();
        console.log("Minute", minute, minute.length)
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

    render() {
        return (
            <View>
                <ScrollView>
                    {
                        data.map((playlist, index) => {
                            var formattedTime = "";
                            var weekDays = playlist.schedule.day_of_week.split("-");
                            weekDays.map((day, ind) => {
                                if (ind === 1) formattedTime += "-";
                                formattedTime += mapToDay[day];
                            })
                            formattedTime += " at " + this.convertHour(playlist.schedule.hour) + ":" + this.convertMinute(playlist.schedule.minute) + " " + this.getAmPm(playlist.schedule.hour);
                            return (
                                <ListItem
                                    key={ index }
                                    leftAvatar={ { size: "large", rounded: false, source: { uri: playlist.imageUri } } }
                                    title={ playlist.title }
                                    titleStyle={ { color: 'black', fontWeight: 'bold' } }
                                    subtitle={ formattedTime }
                                    bottomDivider
                                    rounded={ false }
                                    chevron
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}