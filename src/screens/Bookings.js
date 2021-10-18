import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Text, Button, Icon } from 'react-native-elements'
import firebase from 'firebase';

const db = firebase.firestore();

const date = new Date()
let newDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`

const onJoinPress = () => {
    console.log('Opens messaging app')
}



var bookingId // To get chat of same booking Id

function Bookings(props) {

    const [canBook, setcanBook] = useState(false)
    const [bookings, setbookings] = useState()
    const { colors } = useTheme()
    const user = props.route.params.user

    const renderItem = ({ item }) => {

        return (
            // <TouchableOpacity disabled={item.date === newDate ? false : true} style={{}}>
            //     <ListItem bottomDivider>
            //         <ListItem.Content>
            //             <ListItem.Title>{item.time}</ListItem.Title>
            //         </ListItem.Content>
            //         <ListItem.Content>
            //             <ListItem.Title>{item.date}</ListItem.Title>
            //         </ListItem.Content>
            //         <ListItem.Content>
            //             <ListItem.Title>{item.doctor}</ListItem.Title>
            //         </ListItem.Content>
            //         <ListItem.Content>
            //             <ListItem.Subtitle>
            //                 <Icon
            //                     name='chevron-right'
            //                     type='font-awesome'
            //                 />
            //             </ListItem.Subtitle>
            //         </ListItem.Content>
            //     </ListItem>
            // </TouchableOpacity>
            //<TouchableOpacity disabled={item.date === newDate ? false : true} style={{ marginVertical: 5 }} onPress={onJoinPress}>

            <TouchableOpacity onPress={() => props.navigation.navigate('Chat', {
                bookingId: bookingId,
                userEmail: props.route.params.userEmail,
                doctor: item.doctorName,
                doctorEmail: item.doctorEmail,
                patientName: item.patientName,
                patientEmail: item.pateintEmail,
                time: item.time,
                date: item.date,
                user: props.route.params.user
            })}>

                {/* <ListItem bottomDivider containerStyle={item.date === newDate ?
                    { backgroundColor: "#C84771", borderRadius: 20 }
                    : { backgroundColor: "#dddddd", borderRadius: 20 }
                }> */}
                <ListItem>
                    {console.log('from bookings', item.date)}
                    <ListItem.Content>
                        <View style={{ height: 50, width: '10%', backgroundColor: '#94d0cc', margin: 0, borderRadius: 10 }}>
                        </View>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 15, color: 'black' }}>{item.time}</ListItem.Title>
                        <ListItem.Subtitle style={{ fontSize: 12, color: 'black' }}>{item.date}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 13, color: 'black', fontWeight: 'bold' }}>    {user.photoURL === "doctor" ? item.patientName : item.doctorName}</ListItem.Title>
                    </ListItem.Content>
                    {/* <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 14, color: 'white' }}>{
                            item.date === newDate ? "          Join" : null
                        }</ListItem.Title>
                    </ListItem.Content> */}
                    <ListItem.Chevron />
                </ListItem>
            </TouchableOpacity>
        )
    }

    const getBookings = () => {
        var tempArray = []
        console.log(user.email)
        db.collection('bookings').where(user.photoURL === "patient" ? "pateintEmail" : "doctorEmail", "==", user.email).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    tempArray.push(doc.data())
                });
                setbookings(tempArray)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });


    }

    useEffect(() => {
        getBookings()
    }, [])

    return (
        <View style={{ display: 'flex', alignItems: 'center', backgroundColor: colors.primary, height: '100%' }}>
            <View style={{ width: '95%', display: 'flex', alignItems: 'center' }}>
                {bookings === [] ?
                    <View>
                        <Text h4>No Bookings yet</Text>
                    </View>
                    :
                    <View style={{ width: '100%' }}>
                        <FlatList
                            data={bookings}
                            renderItem={renderItem}
                            keyExtractor={item => item.pateintEmail}
                            setBook={setcanBook}
                        />
                        <View style={styles.bookButton}>
                            <Button onPress={() => {
                                props.navigation.navigate("Book")
                            }} title="Book Appointments" titleStyle={{ fontSize: 15 }} buttonStyle={{ backgroundColor: colors.secondary, borderRadius: 15, padding: 15 }} />
                        </View>
                    </View>

                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bookButton: {
        marginTop: '80%',
    }
})

export default Bookings;