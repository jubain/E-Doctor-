import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, Dimensions, FlatList, Alert } from 'react-native'
import { Avatar, Text, Button, ListItem } from 'react-native-elements'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '@react-navigation/native';
import firebase from 'firebase';


function Doctor(props) {
    const doctor = props.route.params.item
    const db = firebase.firestore();
    //props.route.params.item.history
    const [bookButtonTitle, setbookButtonTitle] = useState('Book')
    const { colors } = useTheme()

    const date = `${props.route.params.date}`
    const time = `${props.route.params.time}`
    console.log(date.slice(0, 10))
    console.log(time.slice(12, 17))

    const renderItem = ({ item }) => {
        return (
            <ListItem bottomDivider>
                <ListItem.Title>{item.fName}</ListItem.Title>
            </ListItem>
        )
    }

    const createChatBox = (doctorEmail, patientEmail) => {
        db.collection('chats').add({
            contents: [],
            doctorEmail: doctorEmail,
            patientEmail: patientEmail
        })
    }

    const checkBookings = () => {
        // if pre booking found then send back to previous page
        db.collection('bookings').where('doctorEmail', '==', doctor.email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().doctorEmail === doctor.email && doc.data().date === date.slice(0, 10) && doc.data().time === time.slice(12, 17)) {
                        Alert.alert(
                            "Sorry",
                            `The doctor is booked for ${time.slice(12, 17)} on ${date.slice(0, 10)}`,
                            [
                                { text: "OK", onPress: () => props.navigation.goBack(null) }
                            ]
                        )
                    }
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

    }

    const doBooking = () => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            // The user object has basic properties such as display name, email, etc.
            const displayName = user.displayName;
            const email = user.email;

            db.collection("bookings").add({
                patientName: displayName,
                pateintEmail: email,
                doctorName: doctor.fName,
                doctorEmail: doctor.email,
                date: date.slice(0, 10),
                time: time.slice(12, 17)
            })
                .then((docRef) => {
                    createChatBox(doctor.email, email)
                    alert('Booking complete. Now you can see your bookings from the dashboard.')
                    setbookButtonTitle('Booked')
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        }

    }
    const History = () => (
        <View>
            <FlatList
                data={props.route.params.item.history}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );

    const Awards = (doctor) => (
        <View>
            <FlatList
                data={props.route.params.item.awards}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );

    const Reviews = (doctor) => (
        <View />
    );

    // Tab View
    const layout = useWindowDimensions();
    const height = Dimensions.get("window").height

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'awards', title: 'Awards' },
        { key: 'reviews', title: 'Reviews' },
    ]);

    const renderScene = SceneMap({
        history: History,
        awards: Awards,
        reviews: Reviews
    });
    // End Tab View

    useEffect(() => {
        checkBookings()
    }, [])

    return (
        <View style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <View style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    rounded
                    size='xlarge'
                    source={{
                        uri: 'https://www.clipartmax.com/png/middle/405-4050774_avatar-icon-flat-icon-shop-download-free-icons-for-avatar-icon-flat.png'
                    }}
                />
                <Text h4>{doctor.fName}</Text>
                <Text h4>{doctor.faculty}</Text>
                <Text>{doctor.hospital}</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                style={{ width: '100%' }}
                renderTabBar={props => <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: 'wheat' }}
                    style={{ backgroundColor: colors.secondary }}
                />}
            />
            <View style={{ width: '100%' }}>
                <Button buttonStyle={{ paddingBottom: 35, backgroundColor: colors.secondary }} title={bookButtonTitle} onPress={doBooking} />
            </View>
        </View>
    );
}

export default Doctor;