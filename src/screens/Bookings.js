import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Text, Button, Icon } from 'react-native-elements'
import firebase from 'firebase';

const user = firebase.auth().currentUser;
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
                //bookingId: bookingId,
                patientEmail: props.route.params.userEmail,
                doctor: item.doctorName,
                user: props.route.params.userData
            })}>
                {/* <ListItem bottomDivider containerStyle={item.date === newDate ?
                    { backgroundColor: "#C84771", borderRadius: 20 }
                    : { backgroundColor: "#dddddd", borderRadius: 20 }
                }> */}
                <ListItem>
                    <ListItem.Content>
                        <View style={{ height: 50, width: '10%', backgroundColor: '#94d0cc', margin: 0, borderRadius: 10 }}>
                        </View>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 15, color: 'black' }}>{item.doctorEmail}</ListItem.Title>
                        <ListItem.Subtitle style={{ fontSize: 12, color: 'black' }}>{item.doctorName}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 13, color: 'black' }}>      {item.doctorName}</ListItem.Title>
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
        db.collection('bookings').where("pateintEmail", "==", props.route.params.userEmail).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    console.log(doc.id)
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