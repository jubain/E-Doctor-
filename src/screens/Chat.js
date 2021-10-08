import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet, View, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from 'react-native'
import { ListItem, Avatar, Button, Text } from 'react-native-elements'
import { TextInput } from 'react-native';
import firebase from 'firebase';



// const renderItem = ({ item }) => {
//     return (
//         <View style={styles.container}>
//             <View style={[
//                 styles.messageBox,
//                 {
//                     backgroundColor: item.user.id === 'u1' ? '#C84771' : '#BEBDB8',
//                     marginLeft: item.user.id === 'u1' ? 50 : 0,
//                     marginRight: item.user.id === 'u1' ? 0 : 50
//                 }
//             ]}>
//                 {item.user.id !== 'u1' && <Text style={styles.name}>{item.user.name}</Text>}
//                 <Text style={styles.message}>{item.content}</Text>
//                 {item.user.id !== 'u1' && <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>}

//             </View>

//         </View>
//     )
// }


function Chat(props) {
    const [message, setmessage] = useState("")
    const [chats, setchats] = useState()
    var doctor = props.route.params.doctorEmail
    var patient = props.route.params.userEmail
    var user = props.route.params.user
    const [messageAndChat, setmessageAndChat] = useState()
    const db = firebase.firestore()

    const [textFieldTouched, settextFieldTouched] = useState(false)

    const sendMessage = () => {

        db.collection('chats')
            .doc('usyihPOZPYxXUTXAX8LX').update({
                "content.doctor": firebase.firestore.FieldValue.arrayUnion(message)
            }).then(() => {
                console.log('all good')
                setmessage('')
            }).catch(err => {
                console.log(err)
            })

        // db.collection('chats').get()
        //     .then((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             console.log(doc.data())
        //         });
        //     })
        //     .catch((error) => {
        //         console.log("Error getting documents: ", error);
        //     });

    }

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
                {item.userId !== 'Jubeen' && <Text style={styles.name}>{item.userId}</Text>}
                <Text style={styles.message}>{item.message}</Text>
                {/* {item.userId !== 'Jubeen' && <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>} */}
            </View>
        </View>
    )


    const sendChat = () => {
        if (message !== "") {
            var documentId
            db.collection('chats').where('patientEmail', '==', patient).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        documentId = doc.id
                    });
                    db.collection('chats').doc(`${documentId}`)
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
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        } else {
            alert("please write a message")
        }

    }

    const getMessage = () => {
        db.collection('chats').doc('ViNAI6NyxKQj5wLZDcSo').get()
            .then((doc) => {
                let tempArray = []
                if (doc.exists) {
                    setmessageAndChat(tempArray)
                    doc.data().contents.forEach(data => {
                        tempArray.push(data)
                    });
                    //tempArray.push(doc.data().contents)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
                setmessageAndChat(tempArray)

            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        // db.collection('chats').where("pateintEmail", "==", patient).get().then((querySnapshot) => {
        //     let tempArray = []
        //     querySnapshot.forEach((doc) => {
        //         if (doc.data().doctorName === doctor)
        //             doc.get()
        //     });
        // })
        //     .catch((error) => {
        //         console.log("Error getting documents: ", error);
        //     });

        db.collection("chats").where("patientEmail", "==", patient)
            .get()
            .then((querySnapshot) => {
                let tempArray = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // if (doc.exists) {
                    //     console.log(true)
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


        // db.collection('chats').where("pateintEmail", "==", patient).get()
        //     .then((doc) => {
        //         let tempArray = []
        //         doc.data().contents.forEach(data => {
        //             tempArray.push(data)
        //         });
        //         //tempArray.push(doc.data().contents)
        //         setmessageAndChat(tempArray.reverse())

        //     }).catch(err => {
        //         console.log(err)
        //     })
    }, [message])

    return (

        <ImageBackground source={{ uri: 'https://wallpaperaccess.com/full/797185.png' }} style={{ width: '100%', height: '100%' }}>
            {/* <FlatList
                data={messageAndChat}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                inverted
            /> */}
            {/* {console.log('new one', messageAndChat)} */}
            <FlatList
                data={messageAndChat}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                inverted
                onTouchStart={() => { settextFieldTouched(false) }}
            //style={textFieldTouched === true ? { marginBottom: 300 } : null}
            />

            <View style={styles.textContainer}>
                <TextInput
                    value={message}
                    numberOfLines={6}
                    multiline style={{ flex: 1 }}
                    placeholder="Type here..."
                    onChangeText={setmessage}
                    onSubmitEditing={sendChat}
                    onTouchStart={() => { settextFieldTouched(true) }}
                //style={textFieldTouched === true ? {} : null}
                />
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
        borderRadius: 50,
        marginHorizontal: 10,
        marginBottom: 20,
        height: '6%'
    }
})

export default Chat