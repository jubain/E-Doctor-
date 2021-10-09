
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ListItem, Avatar, Button, Text } from 'react-native-elements'
import firebase from 'firebase';

function ChatList(props) {

    const [bookings, setbookings] = useState()
    const user = props.route.params.user
    const getBookingInformation = () => {
        const db = firebase.firestore();
        db.collection("bookings").where(user.photoURL === 'doctor' ? 'doctorEmail' : 'pateintEmail', '==', user.email)
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
        <TouchableOpacity onLongPress={() => console.log("hello")} onPress={() => props.navigation.navigate('Chat', {
            user: user
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