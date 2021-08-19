import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Text, Button, Icon } from 'react-native-elements'

const bookings = [
    { id: '1', time: '2:00', date: '4-7-2021', doctor: 'Dr Devika' },
    { id: '2', time: '3:00', date: '02-7-2021', doctor: 'Dr Devika' },
    { id: '3', time: '4:00', date: '02-8-2021', doctor: 'Dr Devika' },
    { id: '4', time: '1:00', date: '02-9-2021', doctor: 'Dr Devika' }
]

const date = new Date()
let newDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`

const onJoinPress = () => {
    console.log('Opens messaging app')
}

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
        <TouchableOpacity disabled={item.date === newDate ? false : true} style={{ marginVertical: 5 }} onPress={onJoinPress}>
            <ListItem bottomDivider containerStyle={item.date === newDate ?
                { backgroundColor: "#C84771", borderRadius: 20 }
                : { backgroundColor: "#dddddd", borderRadius: 20 }
            }>
                <ListItem.Content style={{}}>
                    <View style={{ height: 50, width: '10%', backgroundColor: '#94d0cc', margin: 0, borderRadius: 10 }}>
                    </View>
                </ListItem.Content>
                <ListItem.Content>
                    <ListItem.Title style={{ fontSize: 15, color: 'white' }}>{item.time}</ListItem.Title>
                    <ListItem.Subtitle style={{ fontSize: 12, color: 'white' }}>{item.date}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content>
                    <ListItem.Title style={{ fontSize: 13, color: 'white' }}>      {item.doctor}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Content>
                    <ListItem.Title style={{ fontSize: 14, color: 'white' }}>{
                        item.date === newDate ? "          Join" : null
                    }</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </TouchableOpacity>
    )
}

function Bookings(props) {
    const [canBook, setcanBook] = useState(false)

    const { colors } = useTheme()

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
                            keyExtractor={item => item.id}
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