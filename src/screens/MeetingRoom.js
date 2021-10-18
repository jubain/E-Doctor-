import React, { useEffect, useContext, useState } from 'react';
import { View, Button } from 'react-native';
import { Input } from 'react-native-elements';
import LoginContext from '../context/LoginContext';

function MeetingRoom(props) {
    const [roomID, setroomID] = useState('')
    const [username, setusername] = useState('')
    const { userDetail } = useContext(LoginContext)
    return (
        <View>
            <Input
                label="Room ID"
                value={roomID}
                onChangeText={text => setroomID(text)}
            />
            <Input
                label="username"
                value={username}
                onChangeText={text => setusername(text)}
            />
            <Button title={userDetail.photoURL === "patient" ? 'Join Room' : 'Create Room'} onPress={() => props.navigation.navigate('CameraRoom', {
                roomID,
                username
            })}></Button>
        </View>
    );
}

export default MeetingRoom;