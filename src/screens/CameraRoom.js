import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Alert, SafeAreaView, Button, StyleSheet } from 'react-native';
import { io } from 'socket.io-client'
import LoginContext from '../context/LoginContext';
import { Camera } from 'expo-camera';


function CameraRoom(props) {
    const { userDetail } = useContext(LoginContext)
    const [activeUsers, setactiveUsers] = useState()
    const [startCamera, setstartCamera] = useState(false)
    let socket

    const __startCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync()
        if (status === 'granted') {
            setstartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }

    const joinRoom = () => {
        __startCamera()
        socket.emit('join-room', { roomID: props.route.params.roomID, username: props.route.params.username })
    }

    useEffect(() => {
        socket = io('http://13b4-2a00-23c6-88ae-c901-7478-d82d-753a-2989.ngrok.io')
        socket.on('connection', () => {
            console.log('connected')
        })
        socket.on('all-users', users => {
            setactiveUsers(users)
        })
        joinRoom()
    }, [])

    return (
        <View>
            {startCamera === true ?
                <SafeAreaView>
                    <View>
                        <Camera
                            type='front'
                            style={{
                                width: activeUsers !== undefined ? activeUsers.length <= 1 ? '100%' : 120 : null,
                                height: activeUsers !== undefined ? activeUsers.length <= 0 ? '88%' : 150 : null,
                            }}
                        >
                        </Camera>
                        {activeUsers !== undefined ?
                            activeUsers.map(user => {
                                return (
                                    <View style={{ backgroundColor: 'red', borderWidth: 1, height: '100%' }}>
                                        <Text>{user.username}</Text>
                                    </View>
                                )

                            })
                            : null}
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Users</Text>
                        <View>
                            <Button title="End Call"></Button>
                        </View>
                        {activeUsers !== undefined ?

                            activeUsers.map((user, index) => {
                                console.log(user.username)
                                return (
                                    <View>
                                        <Text>{user.username}</Text>
                                    </View>
                                )

                            })
                            : null}
                    </View>
                </SafeAreaView>
                : null}
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
    }
})

export default CameraRoom;