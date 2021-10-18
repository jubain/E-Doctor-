import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from 'firebase';
import LoginContext from '../context/LoginContext';



function Loading(props) {
    const { getCurrentUser } = useContext(LoginContext)
    const checkedIfLogedin = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getCurrentUser(user)
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