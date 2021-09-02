import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { Text, Input, CheckBox, Button, Badge } from 'react-native-elements'
import firebase from 'firebase';
import app from 'firebase/app'

function UserRegistration(props) {

    const [isSelected, setSelection] = useState(false);
    const [inputs, setinputs] = useState({
        fname: '',
        mname: '',
        lname: '',
        email: '',
        password: '',
        confirm: '',
    })
    const [passwordError, setpasswordError] = useState("")
    const [passwordMatch, setpasswordMatch] = useState(false)

    const [badgeMessage, setbadgeMessage] = useState("")

    const confirmPasswords = () => {
        if (inputs.password === inputs.confirm) {
            setpasswordMatch(true)
            setpasswordError("Password Matched")
        } else {
            setpasswordError(false)
            setpasswordError("Password not Matched!")
        }
    }

    const submit = () => {
        setbadgeMessage("")
        if (isSelected === false) {
            setbadgeMessage("Agree with terms and condition")
        }
        if (inputs.fname == "" || inputs.lname == "" || inputs.email == "" || inputs.password == "" || inputs.confirm == "") {
            setbadgeMessage("Empty fields")
        } else {
            if (isSelected === false) {
                setbadgeMessage("Please agree with terms and conditions")
            } else {
                console.log('hello')
            }
        }

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
            <View style={styles.content}>
                <View style={{ position: 'absolute', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Badge status={badgeMessage != "" ? "warning" : ""} value={badgeMessage} />
                </View>

                <View style={{ marginTop: 50 }}>
                    <Input
                        placeholder=""
                        style={styles.inputText}
                        autoCapitalize='none'
                        autoCompleteType='off'
                        autoCorrect={false}
                        value={inputs.fname}
                        label="First Name"
                        labelStyle={styles.labels}
                        onChangeText={text => setinputs({ ...inputs, fname: text })}

                    />
                </View>
                <View>
                    <Input
                        placeholder=""
                        style={styles.inputText}
                        autoCapitalize='none'
                        autoCompleteType='off'
                        label="Middle Name"
                        autoCorrect={false}
                        value={inputs.mname}
                        labelStyle={styles.labels}
                        onChangeText={text => setinputs({ ...inputs, mname: text })}

                    />
                </View>

                <View>
                    <Input
                        placeholder=""
                        style={styles.inputText}
                        autoCapitalize='none'
                        autoCompleteType='off'
                        autoCorrect={false}
                        label="Last Name"
                        labelStyle={styles.labels}
                        value={inputs.lname}
                        onChangeText={text => setinputs({ ...inputs, lname: text })}
                    />
                </View>

                <View>
                    <Input
                        placeholder="a@bc.com"
                        style={styles.inputText}
                        autoCapitalize='none'
                        autoCompleteType='off'
                        autoCorrect={false}
                        label="Email"
                        labelStyle={styles.labels}
                        leftIcon={{ type: 'fontisto', name: 'email' }}
                        value={inputs.email}
                        onChangeText={text => setinputs({ ...inputs, email: text })}
                        textContentType='emailAddress'
                    />
                </View>

                <View>
                    <Input
                        placeholder=""
                        style={styles.inputText}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCompleteType='off'
                        label="Password"
                        labelStyle={styles.labels}
                        autoCorrect={false}
                        leftIcon={{ type: 'fontisto', name: 'key' }}
                        maxLength={16}
                        errorMessage={passwordError}
                        errorStyle={passwordMatch != true ? { color: 'red' } : { color: 'green' }}
                        onEndEditing={() => confirmPasswords()}
                        value={inputs.password}
                        onChangeText={text => { setinputs({ ...inputs, password: text }); }}
                    />
                </View>

                <View>
                    <Input
                        placeholder=""
                        style={styles.inputText}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        label="Confirm"
                        labelStyle={styles.labels}
                        autoCompleteType='off'
                        autoCorrect={false}
                        errorMessage={passwordError}
                        maxLength={16}
                        errorStyle={passwordMatch == true ? { color: 'green' } : { color: 'red' }}
                        onEndEditing={() => confirmPasswords()}
                        value={inputs.confirm}
                        leftIcon={{ type: 'feather', name: 'check' }}
                        onChangeText={text => { setinputs({ ...inputs, confirm: text }); }}
                    />
                    {/* <Text style={passwordMatch != true ? { marginTop: -20, fontSize: 12, color: 'red' } :
                        { marginTop: -20, fontSize: 12, color: 'green' }}>{passwordError}</Text> */}
                </View>

                <View>
                    <CheckBox
                        title='Agree with terms and conditions'
                        checked={isSelected}
                        onPress={() => { setSelection(!isSelected) }}
                    />
                </View>
                <View style={styles.buttons}>
                    <View>
                        <Button
                            title="Create Account"
                            onPress={() => {
                                firebase.auth().createUserWithEmailAndPassword(inputs.email, inputs.password)
                                    .then(userCredential => {
                                        const user = firebase.auth().currentUser;
                                        user.updateProfile({
                                            displayName: inputs.fname
                                        }).then(() => {
                                            console.log('update succesfull')
                                            const db = firebase.firestore();
                                            db.collection("users")
                                                .doc(user.uid)
                                                .set({
                                                    email: user.email,
                                                    fName: inputs.fname,
                                                    mName: inputs.mname,
                                                    lName: inputs.lname,
                                                    bookings: []

                                                });
                                            props.navigation.navigate('Dashboard', { user: user })
                                        })
                                    })
                                    .catch(error => {
                                        var errorCode = error.code;
                                        var errorMessage = error.message;
                                        console.log("error: ", error)
                                    })
                            }}
                            buttonStyle={{ width: 220, backgroundColor: colors.secondary, borderRadius: 20 }}
                        />


                    </View>

                    <View style={styles.terms}>
                        <Text style={{ fontSize: 15 }}>Already have an account?</Text>
                        <Text onPress={() => props.navigation.navigate('Login')} style={{ fontWeight: 'bold', fontSize: 15, color: colors.secondary }}>  Login</Text>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    content: {
        paddingTop: 5
    },
    inputText: {
        fontSize: 15
    },
    buttons: {
        paddingTop: 10,
        display: 'flex',
        alignItems: 'center'
    },
    terms: {
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    labels: {
        color: 'black'
    }
})

export default UserRegistration;