import React from 'react';
import { View, Text, DatePickerIOS, StyleSheet, Button, Picker } from 'react-native';
import TimePicker from "react-native-24h-timepicker";


export default class DatePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenDate: new Date(),
            time: "2 hours"

        }
        this.setDate = this.setDate.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentDidMount() {
        this.setState({
            chosenDate: this.props.navigation.getParam('chosenDate'),
            time: this.formatTimeStrFromMinutes(this.props.navigation.getParam('duration')),
        });
    }

    formatTimeStrFromMinutes(duration) {
        return (Math.floor(duration / 60) + "h, " + (Math.floor(duration % 60) + "m"));
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
        this.props.navigation.getParam('changeState')("chosenDate", newDate);
        this.props.navigation.getParam('changeState')('hour', newDate.getHours());
        this.props.navigation.getParam('changeState')('minute', newDate.getMinutes());
    }

    onCancel() {
        this.TimePicker.close();
    }

    onConfirm(hour, minute) {
        if (minute === "00") this.setState({ time: (hour + " hour" + (hour === 1 ? "" : "s") + (minute === "00" ? "" : (minute + " minutes"))) })
        else this.setState({ time: (`${hour} hours, ${minute} minutes`), hour, minute });
        this.props.navigation.getParam('changeState')('duration', (parseInt(hour) * 60 + parseInt(minute)));
        this.TimePicker.close();
    }

    render() {
        return (
            <View>
                <View style={ styles.datePicker }>
                    <DatePickerIOS
                        date={ this.state.chosenDate }
                        onDateChange={ this.setDate }
                    />
                </View>
                <View style={ styles.durationView }>
                    <Text style={ styles.timeText }>{ this.state.time } </Text>
                    <Button title="Change Duration" onPress={ () => this.TimePicker.open() } />
                </View>
                <View style={ styles.timePicker }>
                    <TimePicker
                        ref={ ref => {
                            this.TimePicker = ref;
                        } }
                        onCancel={ () => this.onCancel() }
                        onConfirm={ (hour, minute) => this.onConfirm(hour, minute) }
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    datePicker: {
        borderBottomColor: 'rgba(0,0,0,.1)',
        borderBottomWidth: 1
    },
    durationView: {
        padding: 10,
        alignItems: 'center',

    },
    timeText: {
        fontSize: 50,
    }
});