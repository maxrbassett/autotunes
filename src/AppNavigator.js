import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import SongActions from './SongActions';
import Scheduler from './Scheduler';
import SearchMusic from './SearchMusic';

const SchedulerStack = createStackNavigator({
    Scheduler: {
        screen: Scheduler,
        navigationOptions: ({navigation}) => ({
            title: "Schedule Session"
        })
    },
    Tasks: SongActions
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
