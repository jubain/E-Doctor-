import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from 'firebase';



function Loading(props) {
    const checkedIfLogedin = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {

                props.navigation.navigate('Dashboard', {
                    user: user
                })
            } else {
                props.navigation.navigate('Login')
            }
        })
    }

    useEffect(() => {
        checkedIfLogedin()
    }, [])

    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Loading;