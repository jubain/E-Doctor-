import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform } from 'react-native';
import { StyleSheet, View, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from 'react-native'
import { ListItem, Avatar, Button } from 'react-native-elements'
import { TextInput, Text } from 'react-native';
import firebase from 'firebase';

function Chat(props) {
    const [message, setmessage] = useState("")
    var doctor = props.route.params.doctorEmail
    var patient = props.route.params.patientEmail
    var user = props.route.params.user
    const date = props.route.params.date
    const time = props.route.params.time

    const [messageAndChat, setmessageAndChat] = useState()
    const db = firebase.firestore()

    const [textFieldTouched, settextFieldTouched] = useState(false)


    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <View style={[
                styles.messageBox,
                {
                    backgroundColor: item.userId !== user.email ? '#C84771' : '#BEBDB8',
                    marginLeft: item.userId !== user.email ? 50 : 0,
                    marginRight: item.userId !== user.email ? 0 : 50
                }
            ]}>
                {item.userId !== user.email && <Text style={styles.name}>{item.userId}</Text>}
                <Text selectable={true} style={styles.message}>{item.message}</Text>
                {/* {item.userId !== 'Jubeen' && <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>} */}
            </View>
        </View>
    )


    const sendChat = () => {
        if (message !== "") {
            var documentId
            db.collection('chats').where(user.photoURL === "patient" ? "patientEmail" : "doctorEmail", "==", user.email)
                .where(user.photoURL === "patient" ? "doctorEmail" : "patientEmail", "==", user.photoURL === "patient" ? doctor : patient)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection('chats').doc(doc.id).update({
                            "contents": firebase.firestore.FieldValue.arrayUnion({
                                id: Math.random(),
                                message: message,
                                userId: user.email
                            })
                        }).then(() => {
                            setmessage("")
                        })
                        // if (user.photoURL === 'doctor') {
                        //     if (doc.data().patientEmail === patient) {
                        //         db.collection('chats').doc(`${doc.id}`)
                        //             .update({
                        //                 "contents": firebase.firestore.FieldValue.arrayUnion({
                        //                     id: `${Math.random()}`,
                        //                     message: message,
                        //                     userId: props.route.params.user.email
                        //                 })
                        //             }).then(() => {
                        //                 setmessage('')
                        //             }).catch(err => {
                        //                 console.log(err)
                        //             })
                        //     }
                        // } else {
                        //     if (doc.data().doctorEmail === doctor) {
                        //         db.collection('chats').doc(`${doc.id}`)
                        //             .update({
                        //                 "contents": firebase.firestore.FieldValue.arrayUnion({
                        //                     id: `${Math.random()}`,
                        //                     message: message,
                        //                     userId: props.route.params.user.email
                        //                 })
                        //             }).then(() => {
                        //                 setmessage('')
                        //             }).catch(err => {
                        //                 console.log(err)
                        //             })
                        //     }
                        // }

                    });

                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        } else {
            alert("Empty Message")
        }

    }

    setTimeout(() => {
        db.collection("chats").where(user.photoURL === "patient" ? "patientEmail" : "doctorEmail", "==", user.email)
            .where(user.photoURL === "patient" ? "doctorEmail" : "patientEmail", "==", user.photoURL === "patient" ? doctor : patient)
            .where('time', '==', time).where('date', '==', date)
            .get()
            .then((querySnapshot) => {
                let tempArray = []
                querySnapshot.forEach((doc) => {
                    // if (doc.exists) {
                    //     console.log('document exist')
                    // }
                    // if (user.photoURL === "doctor") {
                    //     if (doc.data().doctorEmail === user.email && doc.data().patientEmail === patient) {

                    //     }
                    // } else {
                    //     if (doc.data().patientEmail === user.email && doc.data().doctorEmail === doctor) {
                    //         doc.data().contents.forEach(data => {
                    //             tempArray.push(data)
                    //         })
                    //     }
                    // }
                    doc.data().contents.forEach(data => {
                        tempArray.push(data)
                    })

                });
                setmessageAndChat(tempArray.reverse())

            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, 50000000000);
    useEffect(() => {
        Alert.alert(
            "Dear User",
            "You will have 1 minutes for this chat box. After that you will be taken out from the chat room. Thank you.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => { }
                    // setTimeout(() => {
                    //     props.navigation.goBack(null)
                    // }, 10000)
                }
            ]
        )
    }, [])

    return (

        <ImageBackground source={{ uri: 'https://wallpaperaccess.com/full/797185.png' }} style={{ width: '100%', height: '100%' }}>

            <FlatList
                data={messageAndChat}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                inverted
                onTouchStart={() => { settextFieldTouched(false) }}
            //style={textFieldTouched === true ? { marginBottom: 300 } : null}
            />
            <View style={textFieldTouched === false ? styles.textAndButtonContainer : Platform.OS === 'ios' ? styles.textAndButtonContainerAfterKeyboard :
                styles.textAndButtonContainerAfterKeyboardAndorid
            }>
                <View style={styles.textContainer}>
                    <TextInput
                        value={message}
                        numberOfLines={6}
                        multiline style={{ flex: 1 }}
                        placeholder="Type here..."
                        onChangeText={setmessage}
                        onTouchStart={() => { settextFieldTouched(true) }}
                    //style={textFieldTouched === true ? {} : null}
                    />

                </View>
                <Button onPress={sendChat} style={styles.sendButton} title="Send"></Button>
            </View>

        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    keyBoardAvoidingcontainer: {
        flex: 1
    },
    container: {
        padding: 10,
    },
    messageBox: {
        backgroundColor: '#C84771',
        marginRight: 50,
        borderRadius: 5,
        padding: 10,
    },
    name: {
        fontWeight: 'bold', color: '#C84771', marginBottom: 5
    },
    message: {
        color: 'white',

    },
    time: {
        color: 'white',
        alignSelf: 'flex-end',
        fontSize: 12,
        color: 'gray'
    },
    textContainer: {
        backgroundColor: 'white',
        padding: 10,
        flex: 1.8,
        height: '100%',
        borderRadius: 50
    },
    textAndButtonContainer: {
        marginHorizontal: 10,
        marginBottom: 20,
        height: '6%',
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    textAndButtonContainerAfterKeyboard: {
        marginHorizontal: 10,
        marginBottom: 350,
        height: '6%',
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    textAndButtonContainerAfterKeyboardAndorid: {
        marginHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    sendButton: {
        flex: 1.5,
        height: '100%'
    }
})

export default Chat