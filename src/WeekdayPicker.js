import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

const weekdays = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]
export default class WeekdayPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Sunday: false,
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
            finePrintStr: "",
            cronArray: [],
            cronStr: ""

        }
        this.getFinePrintText = this.getFinePrintText.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    componentDidMount() {
        var cronArray = this.props.navigation.getParam('cronArray');
        cronArray.map((dayNum) => {
            this.setState({ [weekdays[dayNum]]: true, cronArray,})
        })
    }

    changeState(key, value) {
        var cronArray = this.state.cronArray;
        if(value) cronArray.push(weekdays.findIndex((item) => item === key));
        else cronArray = cronArray.splice((cronArray.findIndex((a) => a === (weekdays.findIndex((item) => item === key))), 1));
        
        cronArray = cronArray.sort((a, b) => a > b)

        this.setState({ [key]: value, cronStr: cronArray.toString(), cronArray });
        this.props.navigation.getParam('changeState')('cronArray', cronArray);
        this.props.navigation.getParam('changeState')(key, value);
        this.props.navigation.getParam('changeState')("day_of_week", cronArray.toString())
    }

    getFinePrintText() {
        var stateObj = this.state;
        var repeatDays = [];
        var dayStr = "";

        Object.entries(stateObj).map(([key, value], index) => {
            if (value === true){
                repeatDays.push(key);
            }
        });

        if(repeatDays.length > 0 && repeatDays.length < 7){
            repeatDays.map((day, index) => {
                if(index !== repeatDays.length-1){
                    dayStr += day + ", "
                }else{
                    dayStr += day + ".";
                }
            })
            return "Your session will repeat every " + dayStr;
        }else if(repeatDays.length === 7) return "";
    }

    render() {
        return (
            <View style={ styles.container }>
                {
                    weekdays.map((day, index) => {
                        return (<CheckBox
                            key={index}
                            title={ day }
                            checked={ this.state[day] }
                            onPress={ () => this.changeState(day, !this.state[day]) }
                        />)
                    })
                }
                <Text style={styles.finePrintText}>{this.getFinePrintText()}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    finePrintText: {
        color: "rgba(0,0,0,.3)",
        margin: 10
    }
})