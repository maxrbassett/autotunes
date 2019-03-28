import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class SignInView extends React.Component {
    constructor() {
        super() 
        this.state = {
            ipAddress: '',
            ipErrorMessage: '',
            username:'',
            password:''
        }

    }

    onChange(type, val) {
        this.setState({[type]: val})
    }

    render() {
        return (
            <View style={ styles.container }>
                <Input
                    placeholder="  IP ADDRESS FOR PI"
                    shake={ true }
                    onChangeText={(val) => this.onChange('ipAddress', val)}
                    leftIcon={
                        <Icon
                            name='code'
                            size={ 24 }
                            color='black'
                        />
                    }
                    errorMessage={this.state.ipErrorMessage}
                />
                <Button
                    title="CONNECT PI"
                    type="outline"
                    onPress={() => this.props.submitIP(this.state.ipAddress)}
                />
                
                {/* <Input
                    placeholder='  SPOTIFY USERNAME'
                    shake={ true }
                    leftIcon={
                        <Icon
                            name='user'
                            size={ 24 }
                            color='black'
                        />
                    }
                />
                <Input
                    placeholder='  SPOTIFY PASSWORD'
                    shake={ true }
                    leftIcon={
                        <Icon
                            name='key'
                            size={ 24 }
                            color='black'
                        />
                    }
                /> */}
                {/* <Input
                    placeholder='INPUT WITH ERROR MESSAGE'
                    errorStyle={ { color: 'red' } }
                    errorMessage='ENTER A VALID ERROR HERE'
                /> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


