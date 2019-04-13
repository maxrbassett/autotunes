import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, AsyncStorage } from "react-native";
import React from 'react';
import SignInView from './src/SignInView';
import AppNavigator from './src/AppNavigator';
import SongActionsThumbnail from './src/SongActionsThumbnail';
import { refreshTokens } from './spotify-queries';


export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      ipAddress: '',
      username: '',
      password: '',
      loggedIn: false,
      errorMessage: '',
      base_url: '',
      loadingSmall: false
    }

    this.loginToSpotify = this.loginToSpotify.bind(this);
    this.submitIP = this.submitIP.bind(this);
    this.setError = this.setError.bind(this);
    this.testConnection = this.testConnection.bind(this);
    this.tryAgainClicked = this.tryAgainClicked.bind(this);
    this.newIPClicked = this.newIPClicked.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true })
    AsyncStorage.getItem('IPADDRESS')
      .then((value) => {
        AsyncStorage.getItem('expirationTime').then((tokenExpirationTime) => {
          if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
            refreshTokens();
          } else {
            this.setState({ accessTokenAvailable: true });
          }
          if (value !== null) {
            this.testConnection(value);
            this.setState({ base_url: ('http://'+value+":3000"), ipAddress: value, loading: false, loggedIn: true })
          } else {
            console.log("Didn't find anything");
          }
        })
      }).catch((error) => {
        this.setState({ errorMessage: "Cannot find IP Address" })
      })
  }

  submitIP(ip) {
    console.log("Submitting ip", ip)
    fetch("http://" + ip + ":3000/")
      .then((response) => response.text())
      .then((responseJSON) => {
        AsyncStorage.setItem('IPADDRESS', ip)
          .catch((error) => {
            console.log("Error saving data: ", error)
          })
      }).catch((err) => {
        console.log("ERr: ", err, this.signInView)
        this.signInView.current.onChage("ipErrorMessage", "Cannot connect to your rPi");
      })
  }

  loginToSpotify(email, password) {
    console.log("Logging in", email, password)
  }

  testConnection(ipAddress) {
    fetch('http://' + ipAddress + ':3000/')
      .then((response) => response.text())
      .then((responseText) => {
        console.log("response text: ", responseText);
        if (responseText !== "") {
          this.setState({ errorMessage: "", loadingSmall: false });
        }
      }).catch((err) => {
        this.setState({ loadingSmall: false })
        this.setError();
      })
  }

  setError() {
    this.setState({ errorMessage: "Could not connect to device." })
  }

  tryAgainClicked() {
    this.setState({ loadingSmall: true, errorMessage: "" });
    this.testConnection(this.state.ipAddress);
  }

  newIPClicked() {
    this.setState({ loggedIn: false })
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
          <AppNavigator screenProps={ { setError: this.setError, errorMessage: this.state.errorMessage, base_url: this.state.ipAddress } } />
          <View style={ this.state.errorMessage === "" ? styles.hide : styles.errorMessage }>
            <Text style={ styles.errorText }>{ this.state.errorMessage }</Text>
            <TouchableOpacity style={ styles.tryAgainButton } onPress={ this.tryAgainClicked }>
              <Text style={ styles.tryAgainText }>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ styles.tryAgainButton } onPress={ this.newIPClicked }>
              <Text style={ styles.tryAgainText }>New IP</Text>
            </TouchableOpacity>
          </View>
          <View style={ this.state.loadingSmall ? styles.loadingSmall : styles.hide }>
            <ActivityIndicator size="small" color="black" />
          </View>
          <View style={ styles.thumbnail }>
            <SongActionsThumbnail setError={ this.setError } base_url={ this.state.base_url } navigation={ this.props.navigation } />
          </View>
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

  },
  thumbnail: {
    flex: 1,
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
  hide: {
    display: 'none'
  },
  errorMessage: {
    position: 'absolute',
    top: 60,
    height: 30,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: '#9c0100',
  },
  loadingSmall: {
    position: 'absolute',
    top: 70,
    alignItems: 'center',
    left: '50%'
  },
  errorText: {
    color: 'white',
  },
  tryAgainText: {
    color: '#ddd',
    textDecorationLine: 'underline',
    fontSize: 15
  }
})
