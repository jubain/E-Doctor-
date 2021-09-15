import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet, View, TouchableOpacity, ImageBackground } from 'react-native'
import { ListItem, Avatar, Button, Text } from 'react-native-elements'
import moment from 'moment';
import { TextInput } from 'react-native';
import firebase from 'firebase';


// id: '1',
// users: [{
//     id: 'u1',
//     name: 'Vadim',
//     imageUri: 'https://scontent.fkiv3-1.fna.fbcdn.net/v/t31.0-1/s200x200/22256588_1932617800312085_5686197942193420542_o.jpg?_nc_cat=110&_nc_sid=7206a8&_nc_eui2=AeF3UwtnAs3QLEJRnLSp4-hQxlokCBJZ6JPGWiQIElnok9HafHyjqv9D4bW9zeNFfNJlg5jLsvbewM7j5OD-OFy-&_nc_ohc=IxycgYSpqQEAX8EcTqI&_nc_ht=scontent.fkiv3-1.fna&tp=7&oh=640a83293bb75378958d22b633302f1b&oe=5F9F4BB7',
// }, {
//     id: 'u2',
//     name: 'Lukas',
//     imageUri: 'https://scontent.fkiv3-1.fna.fbcdn.net/v/t1.0-1/p200x200/107443858_3074598385966770_1929559809312242379_n.jpg?_nc_cat=107&_nc_sid=7206a8&_nc_eui2=AeGly5fZLQUfAKei_EiACEq5Dfw2T_M-BQMN_DZP8z4FA_aLEVK_8e0dKvl_5vxVO0Zn-4OPzQ9pKS0c0XeXd898&_nc_ohc=z1ydC_UL4KsAX_tfrbv&_nc_oc=AQknywM4y1IAQaQZaZkPdtkUmaem060LXSByeTx3pdQXWfxW2_tdzfgRsQIXQK_zV94&_nc_ht=scontent.fkiv3-1.fna&tp=6&oh=69508c88f073f64f432fc1f1ab9299e8&oe=5F9C5FD5',
// }],
const chat = [{
    id: 'm1',
    content: 'How are you, Lukas!',
    createdAt: '2021-10-10T12:48:00.000Z',
    user: {
        id: 'u1',
        name: 'Vadim',
    },
}, {
    id: 'm2',
    content: 'I am good, good',
    createdAt: '2021-10-03T14:49:00.000Z',
    user: {
        id: 'u2',
        name: 'Lukas',
    },
}, {
    id: 'm3',
    content: 'What about you?',
    createdAt: '2020-10-03T14:49:40.000Z',
    user: {
        id: 'u2',
        name: 'Lukas',
    },
}, {
    id: 'm4',
    content: 'Good as well, preparing for the stream now.',
    createdAt: '2020-10-03T14:50:00.000Z',
    user: {
        id: 'u1',
        name: 'Vadim',
    },
}, {
    id: 'm5',
    content: 'How is your uni going?',
    createdAt: '2020-10-03T14:51:00.000Z',
    user: {
        id: 'u1',
        name: 'Vadim',
    },
}, {
    id: 'm6',
    content: 'It is a bit tough, as I have 2 specializations. How about yours? Do you enjoy it?',
    createdAt: '2020-10-03T14:49:00.000Z',
    user: {
        id: 'u2',
        name: 'Lukas',
    },
}, {
    id: 'm7',
    content: 'Big Data is really interesting. Cannot wait to go through all the material.',
    createdAt: '2020-10-03T14:53:00.000Z',
    user: {
        id: 'u1',
        name: 'Vadim',
    },
}]


const renderItem = ({ item }) => (
    <View style={styles.container}>
        <View style={[
            styles.messageBox,
            {
                backgroundColor: item.userId === 'Jubeen' ? '#C84771' : '#BEBDB8',
                marginLeft: item.userId === 'Jubeen' ? 50 : 0,
                marginRight: item.userId === 'Jubeen' ? 0 : 50
            }
        ]}>
            {item.userId !== 'Jubeen' && <Text style={styles.name}>{item.userId}</Text>}
            <Text style={styles.message}>{item.message}</Text>
            {/* {item.userId !== 'Jubeen' && <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>} */}
        </View>
    </View>
)

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

    const [messageAndChat, setmessageAndChat] = useState()

    const db = firebase.firestore()

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


    const sendChat = () => {

        db.collection('chats')
            .doc('ViNAI6NyxKQj5wLZDcSo').update({
                "contents": firebase.firestore.FieldValue.arrayUnion({
                    id: `${Math.random()}`,
                    message: message,
                    userId: 'Devika'
                })
            }).then(() => {
                console.log('all good')
                setmessage('')
            }).catch(err => {
                console.log(err)
            })
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
        db.collection('chats').doc('ViNAI6NyxKQj5wLZDcSo').get()
            .then((doc) => {
                let tempArray = []
                doc.data().contents.forEach(data => {
                    tempArray.push(data)
                });
                //tempArray.push(doc.data().contents)
                setmessageAndChat(tempArray.reverse())

            }).catch(err => {
                console.log(err)
            })
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
            />

            <View style={styles.textContainer}>
                <TextInput
                    value={message}
                    numberOfLines={6}
                    multiline style={{ flex: 1 }}
                    placeholder="Type here..."
                    onChangeText={setmessage}
                    onSubmitEditing={sendChat}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
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