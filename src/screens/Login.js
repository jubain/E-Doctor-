import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Text, Input, Button } from 'react-native-elements'
import { useTheme } from '@react-navigation/native';
import { Image } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { FacebookSocialButton, GoogleSocialButton } from 'react-native-social-buttons'
import firebase from 'firebase';

function Login(props) {
    const [inputs, setinputs] = useState({
        email: '',
        password: ''
    })
    const [errorMessage, seterrorMessage] = useState("")
    const onPressLogin = () => {
        if (inputs.email !== "" || inputs.password !== "") {
            firebase.auth().signInWithEmailAndPassword(inputs.email, inputs.password)
                .then((userCredential) => {
                    // Signed in
                    console.log('from login', userCredential)
                    //var user = userCredential.user;
                    props.navigation.navigate('Loading')
                    // ...
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(error)
                });

        } else {
            seterrorMessage("Empty Field")
        }
    }
    const onSignUp = () => {

    }

    const { colors } = useTheme()

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: colors.primary,
            height: '100%'
        }}>
            <Image
                source={require('../../public/logo.png')}
                style={{ width: 230, height: 230 }}
            />

            <View style={styles.container}>
                <View style={styles.inputs}>
                    <Input
                        autoCapitalize='none'
                        autoCompleteType='off'
                        placeholder="Email or Username"
                        errorMessage={errorMessage}
                        value={inputs.email}
                        style={{ fontSize: 15 }}
                        onChangeText={text => setinputs({ ...inputs, email: text })}
                        leftIcon={
                            <Icon
                                name="user"
                                size={24}
                                color='black'
                            />
                        }
                        onFocus={() => {
                            seterrorMessage("")
                        }}
                    />
                    <Input
                        placeholder="Password"
                        style={{ fontSize: 15 }}
                        errorMessage={errorMessage}
                        value={inputs.password}
                        onChangeText={text => setinputs({ ...inputs, password: text })}
                        secureTextEntry={true}
                        leftIcon={{ type: 'antdesign', name: 'key' }}
                        onFocus={() => {
                            seterrorMessage("")
                        }}
                    />

                    <View style={styles.buttons}>
                        <View style={styles.button}>
                            <Button
                                title="Login"
                                buttonStyle={{
                                    backgroundColor: '#C84771',
                                    width: 220,
                                    borderRadius: 20
                                }}
                                onPress={onPressLogin}
                            />
                        </View>
                        <Text h5 style={{ alignSelf: 'center', marginBottom: 15, marginTop: 15 }}>Or</Text>
                        <View style={styles.button}>
                            <FacebookSocialButton
                                buttonViewStyle={styles.socialButtons}
                            />
                        </View>
                        <View style={styles.button}>
                            <GoogleSocialButton
                                buttonViewStyle={styles.socialButtons}
                            />
                        </View>
                        <View style={styles.registerLink}>
                            <Text style={{ fontSize: 15 }}>Don't have an Account?</Text>
                            <Text onPress={() => props.navigation.navigate('UserRegister')} style={{ fontWeight: 'bold', fontSize: 15, color: '#C84771' }}>  Register</Text>
                        </View>
                        <View>
                            <Text onPress={() => props.navigation.navigate('DoctorRegister')} style={{ fontWeight: 'bold', fontSize: 15, color: '#C84771' }}>Are you a Doctor?</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {

    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 370,
    },
    inputs: {
        alignSelf: 'stretch',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginTop: 20,
    },
    button: {
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center',
    },
    socialButtons: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        borderRadius: 20
    },
    registerLink: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 30,
        marginBottom: 15
    }
})

export default Login;