import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet, View, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from 'react-native'
import { ListItem, Avatar, Button, Text } from 'react-native-elements'
import { TextInput } from 'react-native';
import firebase from 'firebase';

function Chat(props) {
    const [message, setmessage] = useState("")

    var doctor = props.route.params.doctorEmail
    var patient = props.route.params.patientEmail
    var user = props.route.params.user

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
                <Text style={styles.message}>{item.message}</Text>
                {/* {item.userId !== 'Jubeen' && <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>} */}
            </View>
        </View>
    )


    const sendChat = () => {
        if (message !== "") {
            var documentId
            db.collection('chats').where(user.photoURL === 'patient' ? "patientEmail" : 'doctorEmail', '==', user.email).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.data())
                        if (user.photoURL === 'doctor') {
                            if (doc.data().patientEmail === patient) {
                                db.collection('chats').doc(`${doc.id}`)
                                    .update({
                                        "contents": firebase.firestore.FieldValue.arrayUnion({
                                            id: `${Math.random()}`,
                                            message: message,
                                            userId: props.route.params.user.email
                                        })
                                    }).then(() => {
                                        setmessage('')
                                    }).catch(err => {
                                        console.log(err)
                                    })
                            }
                        } else {
                            if (doc.data().doctorEmail === doctor) {
                                db.collection('chats').doc(`${doc.id}`)
                                    .update({
                                        "contents": firebase.firestore.FieldValue.arrayUnion({
                                            id: `${Math.random()}`,
                                            message: message,
                                            userId: props.route.params.user.email
                                        })
                                    }).then(() => {
                                        setmessage('')
                                    }).catch(err => {
                                        console.log(err)
                                    })
                            }
                        }

                    });

                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        } else {
            alert("please write a message")
        }

    }

    setTimeout(() => {
        db.collection("chats").where(user.photoURL === "patient" ? "patientEmail" : "doctorEmail", "==", user.email)
            .get()
            .then((querySnapshot) => {
                let tempArray = []
                querySnapshot.forEach((doc) => {
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
    }, 500);
    useEffect(() => {



    }, [message])

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
            <View style={textFieldTouched === false ? styles.textAndButtonContainer : styles.textAndButtonContainerAfterKeyboard}>
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
    sendButton: {
        flex: 1.5,
        height: '100%'
    }
})

export default Chat