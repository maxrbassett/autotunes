import { Client_Id, Secret_Id, Redirect_Url } from './secrets';
import { AuthSession } from 'expo';
import { encode as btoa } from 'base-64';
import { AsyncStorage } from 'react-native';
import SpotifyWebAPI from 'spotify-web-api-js';

const scopesArr = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state', 'user-library-modify',
    'user-library-read', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public',
    'playlist-modify-private', 'user-read-recently-played', 'user-top-read'];
const scopes = scopesArr.join(' ');

export function getPlaylistTracks(uri) {
    id = uri.split("playlist")[1];
    console.log("id1: ", id);
    id = id.split(":")[1];
    console.log("id2: ", id)
    return new Promise((resolve, reject) => {
        getValidSPObj().then((sp) => {
            sp.getPlaylistTracks(id).then((response) => {
                resolve(response);
            }).catch((err) => console.log("Error getting playlist: ", err.response))
        }).catch((err) => {
            console.log("There was an error in getting playlist tracks: ", err);
        })
    })
}

export function getUserPlaylist(userId) {
    return new Promise((resolve, reject) => {
        getValidSPObj().then((sp) => {
            sp.getUserPlaylists(userId).then((response) => {
                resolve(response);
            }).catch((err) => console.log("Error getting playlist: ", err.response))
        }).catch((err) => {
            console.log("There was an error in getting playlists: ", err);
        })
    })
}

export function getMe() {
    return new Promise((resolve, reject) => {
        getValidSPObj().then((sp) => {
            sp.getMe().then((response) => {
                resolve(response);
            }).catch((err) => console.log("Error getting playlist: ", err.response))
        }).catch((err) => {
            console.log("There was an error in getting playlist tracks: ", err);
        })
    })
}



export function getAuthorizationCode() {
    const redirectUrl = AuthSession.getRedirectUrl(); //this will be something like https://auth.expo.io/@your-username/your-app-slug
    return new Promise((resolve, reject) => {
        AuthSession.startAsync({
            authUrl:
                'https://accounts.spotify.com/authorize' +
                '?response_type=code' +
                '&client_id=' +
                Client_Id +
                (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
                '&redirect_uri=' +
                encodeURIComponent(redirectUrl),
        }).then((result) => {
            resolve(result.params.code);
        })
    })
}

export function getTokens() {
    return new Promise((resolve, reject) => {
        getAuthorizationCode().then((authorizationCode) => {

            const credsB64 = btoa(`${Client_Id}:${Secret_Id}`);
            fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credsB64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
                    Redirect_Url
                    }`,
            }).then((response) => response.json())
                .then((responseJSON) => {
                    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
                    const {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        expires_in: expiresIn,
                    } = responseJSON;

                    const expirationTime = (new Date().getTime() + expiresIn * 1000).toString();
                    AsyncStorage.setItem('accessToken', accessToken)
                        .catch((error) => {
                            console.error("Error saving data: ", error)
                        })
                    AsyncStorage.setItem('refreshToken', refreshToken)
                        .catch((error) => {
                            console.error("Error saving data: ", error)
                        })
                    AsyncStorage.setItem('expirationTime', expirationTime)
                        .catch((error) => {
                            console.error("Error saving data: ", error)
                        })
                    resolve({ "success": true })
                }).catch((err) => {
                    console.log("Error in getting tokens: ", err);
                    reject(err);
                })
        })
    }) //we wrote this function above
}

export function refreshTokens() {
    return new Promise((resolve, reject) => {
        const credsB64 = btoa(`${Client_Id}:${Secret_Id}`);
        AsyncStorage.getItem('refreshToken').then((refreshToken) => {
            fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credsB64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.error) {
                        getTokens().then((response) => {
                            console.log("response", response);
                        }).catch((err) => console.log("ERR: ", err))
                    } else {
                        const {
                            access_token: newAccessToken,
                            refresh_token: newRefreshToken,
                            expires_in: expiresIn,
                        } = responseJson;

                        const expirationTime = (new Date().getTime() + expiresIn * 1000).toString();
                        AsyncStorage.setItem('accessToken', newAccessToken)
                            .catch((error) => {
                                console.error("Error saving data: ", error)
                            })
                        if (newRefreshToken) {
                            AsyncStorage.setItem('refreshToken', newRefreshToken)
                                .catch((error) => {
                                    console.error("Error saving data: ", error)
                                })
                        }
                        AsyncStorage.setItem('expirationTime', expirationTime)
                            .catch((error) => {
                                console.error("Error saving data: ", error)
                            })
                    }
                })
        })
    })
}

export function getValidSPObj() {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('expirationTime').then((tokenExpirationTime) => {
            if (new Date().getTime() > tokenExpirationTime) {
                // access token has expired, so we need to use the refresh token
                refreshTokens().then(() => {
                    AsyncStorage.getItem("accessToken").then((accessToken) => {
                        var sp = new SpotifyWebAPI();
                        console.log("SP: ", sp)
                        sp.setAccessToken(accessToken).then(() => {
                            resolve(sp);
                        }).catch((err) => console.log("ERROR!!!!!!!!!!: ", err))
                    })
                })
            } else {
                AsyncStorage.getItem('accessToken').then((accessToken) => {
                    var sp = new SpotifyWebAPI();
                    sp.setAccessToken(accessToken);
                    resolve(sp);
                })
            }
        })
    })
}



