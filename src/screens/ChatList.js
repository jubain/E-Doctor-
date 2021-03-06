
import React, { useEffect, useState,useContext } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ListItem, Avatar, Button, Text } from 'react-native-elements'
import firebase from 'firebase';
import LoginContext from '../context/LoginContext';

function ChatList(props) {

    const [bookings, setbookings] = useState()
    const {userDetail} = useContext(LoginContext)
    const getBookingInformation = () => {
        const db = firebase.firestore();
        db.collection("bookings").where(userDetail.photoURL === 'doctor' ? 'doctorEmail' : 'pateintEmail', '==', userDetail.email)
            .get()
            .then((querySnapshot) => {
                let tempArray = []
                let a
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tempArray.push(doc.data())
                });
                setbookings(tempArray)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() =>props.navigation.navigate("Chat",{
            time: item.time,
            date:item.date,
            doctorEmail:item.doctorEmail,
            patientEmail:item.pateintEmail
        })}>
            <ListItem bottomDivider>
                <Avatar source={{ uri: item.avatar_url }} />
                <ListItem.Content>
                    <ListItem.Title>{item.doctorName}</ListItem.Title>
                    <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </TouchableOpacity>
    );

    useEffect(() => {
        getBookingInformation()
    }, [])

    return (
        <View>
            {
                <FlatList
                    data={bookings}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            }
        </View>
    );
}

export default ChatList;