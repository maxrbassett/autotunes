import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, Text, View, Button, ActivityIndicator, AsyncStorage } from "react-native";
import React from 'react';
import SignInView from './src/SignInView';
import AppNavigator from './src/AppNavigator';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      ipAddress: '',
      username: '',
      password: '',
      loggedIn: false
    }

    this.signInView = React.createRef();
    this.loginToSpotify = this.loginToSpotify.bind(this);
    this.submitIP = this.submitIP.bind(this);
  }

  componentDidMount() {
    //fetch Ip address
    this.setState({loading: true})
    AsyncStorage.getItem('IPADDRESS')
      .then((value) => {
        if (value !== null) {
          this.setState({ ipAddress: value, loading: false, loggedIn: true})
        }else {
          console.log("Didn't find anything");
        }

      }).catch((error) => {
        console.error("Err: ", error)
      })
  }

  submitIP(ip) {
    console.log("Submitting ip", ip)
    fetch("http://" + ip + ":3000/test")
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log("Returned from query: ", responseJSON)
        if (responseJSON.success) {
          AsyncStorage.setItem('IPADDRESS', ip)
            .catch((error) => {
              console.error("Error saving data: ", error)
            })
        }else{
          this.signInView.current.onChange("ipErrorMessage", "Cannot connect to your rPi")
        }
      }).catch((err) => {
        console.log("ERr: ", err, this.signInView)
        this.signInView.current.onChage("ipErrorMessage", "Cannot connect to your rPi");
      })
  }

  loginToSpotify(email, password) {
    console.log("Logging in", email, password)
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={ styles.loading }>
          <ActivityIndicator size="large" color="black" />
        </View>
      )
    }
    else if (this.state.loggedIn) {
      return (
          <View style={ styles.container }>
            <AppNavigator screenProps={ { base_url: this.state.ipAddress } } />
          </View>
      );
    } else {
      return (
        <SignInView ref={ this.signInView } login={ this.login } submitIP={ this.submitIP } />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'

  }
})
