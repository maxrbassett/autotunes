import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import SongActions from './SongActions';
import Scheduler from './Scheduler';
import SearchMusic from './SearchMusic';
import CreateSession from './CreateSession';
import SessionDetails from './SessionDetails';
import { Button } from 'react-native-elements';
import WeekdayPicker from './WeekdayPicker';
import DatePicker from './DatePicker';
import ExtraOptions from './ExtraOptions';

const SchedulerStack = createStackNavigator({
    Scheduler: {
        screen: Scheduler,
        navigationOptions: ({ navigation }) => ({
            title: (navigation.getParam('editView') ? "Edit" : "Your") +  " Sessions",
            headerTintColor: 'black',
            headerLeft: (
                <Button
                    onPress={ navigation.getParam('createClicked') }
                    buttonStyle={ { display: (navigation.getParam('editView') ? null : "none"), backgroundColor: "transparent", marginLeft: 15 } }
                    title="Create"
                    titleStyle={ { color: "black", fontSize: 16 } }
                />
            ),
            headerRight: (
                <Button
                    onPress={ navigation.getParam('editClicked') }
                    buttonStyle={ { backgroundColor: "transparent", marginRight: 15 } }
                    title={ navigation.getParam('editView') ? "Done" : "Edit" }
                    titleStyle={ { color: "black", fontSize: 16 } }
                />
            ),
        })
    },
    SessionDetails: {
        screen: SessionDetails,
        navigationOptions: ({ navigation }) => ({
            title: navigation.getParam("title"),
            headerTintColor: 'black',

            headerRight: (
                <Button
                    onPress={ navigation.getParam('edit') }
                    buttonStyle={ { backgroundColor: "transparent", marginRight: 15 } }
                    title="Edit"
                    titleStyle={ { color: "black", fontSize: 16 } }
                />
            ),
        })
    },
    CreateSession: {
        screen: CreateSession,
        navigationOptions: ({ navigation }) => {
            return ({
                title: navigation.getParam("sessionEditType") + " Session",
                headerLeft: (
                    <Button
                        onPress={ () => navigation.goBack()}
                        buttonStyle={ { backgroundColor: "transparent", marginLeft: 15 } }
                        title="Cancel"
                        titleStyle={ { color: "black", fontSize: 16 } }
                    />
                ),
                headerRight: (
                    <Button
                        onPress={ navigation.getParam('doneCreatingSessionClicked') }
                        buttonStyle={ { backgroundColor: "transparent", marginRight: 15 } }
                        title="Save"
                        titleStyle={ { color: "black", fontSize: 16 } }
                    />
                )
            })
        }
    },
    DatePicker: {
        screen: DatePicker,
        navigationOptions: ({ navigation }) => {
            return ({
                title: "Next up",
            })
        }
    },
    WeekdayPicker: {
        screen: WeekdayPicker,
        navigationOptions: ({ navigation }) => {
            return ({
                title: "Repeat",
            })
        }
    },
    ExtraOptions: {
        screen: ExtraOptions,
        navigationOptions: ({ navigation }) => {
            return ({
                title: "Extra Options",
            })
        }
    },
    SongActions: {
        screen: SongActions,
        mode: "modal",

    }
})

const SearchStack = createStackNavigator({
    Search: SearchMusic,
    Tasks: SongActions
})

const InstantPlayStack = createStackNavigator({
    "Instant Play": SearchMusic,
    Tasks: SongActions
})

export default createAppContainer(createBottomTabNavigator(
    {
        Scheduler: SchedulerStack,
        Search: SearchStack,
        "Instant Play": InstantPlayStack
    }
));
