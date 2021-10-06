import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, } from 'react-native'
import Modal from 'react-native-modal';
import { useTheme } from '@react-navigation/native';
import { Input, Text, Button, Icon, ListItem, Avatar } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import firebase from 'firebase';
import { ActivityIndicator } from 'react-native';


function BookAppointments(props) {

    const [hospitalList, sethospitalList] = useState()
    const [doctorList, setdoctorList] = useState()
    const [userChoosedHospital, setuserChoosedHospital] = useState("")
    const [hospitalSelected, sethospitalSelected] = useState({ id: '' })

    const db = firebase.firestore()

    const findHospitals = () => {
        db.collection("hospitals").where("location", "==", userlocation)
            .get()
            .then((querySnapshot) => {
                let tempArray = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    var obj = { data: doc.data(), id: doc.id }
                    tempArray.push(obj)
                });
                sethospitalList(tempArray)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

    }



    const [userlocation, setlocation] = useState("")

    // Date picker
    const [buttonColour, setbuttonColour] = useState("#C84771")

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(true);

    const onChange = (event, selectedDate) => {
        setbuttonColour('#dddddd')
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showTimepicker = () => {
        showMode('time');
    };


    const showDatepicker = () => {
        showMode('date');
    };

    // Date picker ends

    // Buttons
    const [pickPressed, setpickPressed] = useState(false)

    const [pickSpeciality, setpickSpeciality] = useState(false)
    // End Buttons

    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    // End Modal

    // Theme
    const { colors } = useTheme()
    // End theme

    const [userDepartmentPick, setuserDepartmentPick] = useState("")

    // const onSelectDepartment = (department) => {
    //     setuserDepartmentPick(department)
    // }

    const doctorDetail = (item) => {
        props.navigation.navigate('Doctor', {
            item: item
        })
    }

    const renderItem = ({ item }) => {
        if (userDepartmentPick === item.faculty) {
            return (
                <TouchableOpacity onPress={() => doctorDetail(item)}>
                    <ListItem bottomDivider>
                        <ListItem.Title>{item.id}</ListItem.Title>
                        <ListItem.Content>
                            <Avatar
                                rounded
                                source={{
                                    uri:
                                        'https://yt3.ggpht.com/ytc/AAUvwngzcAc_oJVZp14A9mA7eWSphYWezOIXd-0Kj_re=s900-c-k-c0x00ffffff-no-rj',
                                }}
                            />
                        </ListItem.Content>
                        <ListItem.Content><Text>{item.fName}</Text></ListItem.Content>
                        <ListItem.Content><Text>{item.faculty}</Text></ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </TouchableOpacity>
            )
        }
    }

    const renderHospitals = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                setuserChoosedHospital(item);
                sethospitalSelected({ id: item.id })
            }}
                style={item.id === hospitalSelected.id ? { backgroundColor: 'grey' } : null}
            >
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar
                        rounded
                        source={{
                            uri: 'https://www.vayodhahospitals.com/wp-content/uploads/2017/09/Hospital-Front-View-copy-1-1-1600x650_c.jpg'
                        }}
                        size='large'
                    />
                    <Text style={{ color: 'white', overflow: 'hidden', fontWeight: 'bold' }}>{item.data.name}     </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const findDoctor = () => {

        //db.collection("doctors").where("faculty", "==", userDepartmentPick)
        if (userlocation === "" || userDepartmentPick === "" || userChoosedHospital === "") {
            alert("please type location, choose hospital and choose faculty of doctors you want.")
        }
        db.collection("doctors").where("hospital", "==", userChoosedHospital.id)
            .get()
            .then((querySnapshot) => {
                // console.log(querySnapshot)
                let tempArray = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.data())
                    if (doc.data().faculty === userDepartmentPick) {
                        tempArray.push(doc.data())
                    }
                });
                setdoctorList(tempArray)

            })
            .catch((error) => {
                console.log(error);
            });

    }

    return (
        <ParallaxScrollView
            backgroundColor={colors.secondary}
            contentBackgroundColor={colors.primary}
            parallaxHeaderHeight={700}
            renderForeground={() => (
                <View style={{ backgroundColor: colors.primary, height: '100%', display: 'flex', alignItems: 'center' }}>

                    <View style={{ width: '90%', marginTop: '10%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Pick a Date</Text>
                        </View>

                        {show === true ?
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                                style={{ width: '37%' }}
                            />
                            : null}
                    </View>

                    <View style={{ width: '90%', marginTop: '10%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Pick a Time</Text>
                        </View>

                        {show === true ?
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="time"
                                is24Hour={true}
                                display="inline"
                                onChange={onChange}
                                style={{ width: '58%', backgroundColor: "white" }}
                            />
                            : null}
                    </View>

                    <View style={styles.location}>
                        <View style={{ width: '80%' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 10, paddingTop: 30, paddingBottom: 25, color: colors.primary }}>Location</Text>
                            <Input labelStyle={styles.label} label="Enter a location" onFocus={showDatepicker}
                                placeholder="e.g. Kathmandu, Pokhara"
                                value={userlocation}
                                onChangeText={text => setlocation(text)}
                                style={{ fontSize: 12 }}
                                onSubmitEditing={findHospitals()}
                                inputContainerStyle={{ borderWidth: 1, borderRadius: 10, borderColor: 'white', backgroundColor: 'white' }}
                            />

                        </View>

                        {/* <View style={{ width: '80%' }}>
                            <Input labelStyle={styles.label} label="Address 2 *" onFocus={showDatepicker}
                                placeholder="City"
                                placeholderTextColor="black"
                                style={{ fontSize: 12 }}
                                inputContainerStyle={{ borderWidth: 1, borderRadius: 10, borderColor: 'white', backgroundColor: 'white' }}
                            />
                        </View>

                        <View style={{ width: '80%' }}>
                            <Input labelStyle={styles.label} label="Address 3 *" onFocus={showDatepicker}
                                placeholder="District"
                                placeholderTextColor="black"
                                style={{ fontSize: 12 }}
                                inputContainerStyle={{ borderWidth: 1, borderRadius: 10, borderColor: 'white', backgroundColor: 'white' }}
                            />
                        </View> */}
                    </View>
                    <View style={{ width: '90%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Speciality</Text>
                        <Button
                            title={userDepartmentPick === "" ? 'Choose' : userDepartmentPick}
                            onPress={() => {
                                // if (hospitalList.length !== 0 || hospitalList.length !== undefined) {
                                //     setpickSpeciality(true)
                                //     setModalVisible(true)
                                // } else {
                                //     alert('Please enter a location of a hospital')
                                // }
                                setpickSpeciality(true)
                                setModalVisible(true)

                            }}
                            buttonStyle={{ width: '100%' }}
                            type="clear"
                        />

                    </View>

                    {/* Hospital flatlist */}
                    <View style={{ marginTop: '10%', width: '90%' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Choose any Hospital</Text>
                        {/* {hospitalList !== undefined ?
                            hospitalList.length === 0 ? null :

                                
                            : null
                        } */}
                        <FlatList
                            data={hospitalList}
                            renderItem={renderHospitals}
                            keyExtractor={item => item.id}
                            horizontal
                            style={{
                                backgroundColor: '#C84771',
                                paddingHorizontal: 15, paddingVertical: 10,
                                borderRadius: 10,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 11,
                                },
                                shadowOpacity: 0.55,
                                shadowRadius: 14.78,
                                elevation: 22,
                            }}
                        />

                    </View>
                    <View style={{ width: '90%', marginTop: 10 }}>
                        <Button titleStyle={{ fontSize: 25 }} buttonStyle={styles.searchButton} containerStyle={styles.searchButtonContainer} title="Search" onPress={findDoctor} />
                    </View>


                </View>
            )}>
            {userDepartmentPick !== "" ?
                <FlatList
                    data={doctorList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.email}
                    style={{ width: '100%' }}
                />
                :
                null
            }


            {pickSpeciality === true ?
                <View>
                    <Modal isVisible={modalVisible}>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Text h4 style={{ color: 'white', letterSpacing: 3 }}>Pick a Department</Text>
                            <View style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
                                <View style={styles.specialityOptions}>
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            setuserDepartmentPick("Dentist")
                                            setModalVisible(false)

                                        }}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="tooth"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            setuserDepartmentPick("Pediatric")
                                            setModalVisible(false)

                                        }}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="baby"
                                                color='white'
                                                size={35}
                                                style={styles.icons}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            setuserDepartmentPick("Orthopedic")
                                            setModalVisible(false)

                                        }}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="bone"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={{ fontSize: 14, color: "white" }}>Dentists</Text>
                                        <Text style={{ fontSize: 14, color: "white" }}>Pediatrics</Text>
                                        <Text style={{ fontSize: 14, color: "white" }}>Orthopedics</Text>
                                    </View>

                                </View>

                                <View style={styles.specialityOptions}>
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            setuserDepartmentPick("Female")
                                            setModalVisible(false)
                                        }}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="female"
                                                size={40}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.button}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="hand-holding-heart"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="apple-alt"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.textContainer}>
                                        <View style={{ display: 'flex', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 14, color: "white" }}>Female</Text>
                                            <Text style={{ fontSize: 14, color: "white" }}>Specialist</Text>
                                        </View>
                                        <Text style={{ fontSize: 14, color: "white" }}>Cardiatics</Text>
                                        <Text style={{ fontSize: 14, color: "white" }}>Nutrionist</Text>
                                    </View>
                                </View>


                                <View style={styles.specialityOptions}>
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            setModalVisible(false)
                                        }}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="brain"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="male"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button}>
                                            <Icon
                                                type="material-icons"
                                                name="face-retouching-natural"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.textContainer}>
                                        <Text style={{ fontSize: 14, color: "white" }}>Nurologist</Text>
                                        <View style={{ display: 'flex', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 14, color: "white" }}>Male</Text>
                                            <Text style={{ fontSize: 14, color: "white" }}>Specialist</Text>
                                        </View>
                                        <Text style={{ fontSize: 14, color: "white" }}>Dermatologist</Text>
                                    </View>
                                </View>

                                <View style={styles.specialityOptions}>
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity style={styles.button}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="microscope"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="radiation"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button}>
                                            <Icon
                                                type="font-awesome-5"
                                                name="transgender"
                                                size={35}
                                                color='white'
                                                style={styles.icons}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.textContainer}>
                                        <Text style={{ fontSize: 14, color: "white" }}>Pathologist</Text>
                                        <Text style={{ fontSize: 14, color: "white" }}>Radiologist</Text>
                                        <View style={{ display: 'flex', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 14, color: "white" }}>General</Text>
                                            <Text style={{ fontSize: 14, color: "white" }}>Physicians</Text>
                                        </View>
                                    </View>
                                </View>


                            </View>

                        </View>
                    </Modal>
                </View>
                : null
            }
        </ParallaxScrollView>
    )
    //{
    /* <View style={{ backgroundColor: colors.primary, height: '100%', display: 'flex', alignItems: 'center' }}>
    
    {userDepartmentPick != "" ?

        <FlatList
            data={doctors}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{ borderWidth: 1, width: '95%' }}
        />

        : null}

    

</View> */
    //}
    //);
}

const styles = StyleSheet.create({
    label: {
        color: 'white',
        fontSize: 14
    },
    location: {
        width: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,
        elevation: 22,
        backgroundColor: '#C84771',
        borderRadius: 20,
        marginVertical: '10%'
    },
    specialityOptions: {
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'red',
        width: '100%',
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: 'green',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
    ,
    icons: {
        backgroundColor: '#C84771',
        paddingHorizontal: 30,
        paddingVertical: 20,
        width: '100%',
        borderRadius: 900
    },
    searchButton: {
        width: '100%',
        height: "100%",
        backgroundColor: '#C84771',
        borderRadius: 15
    },
    searchButtonContainer: {
        height: '35%'
    }
})

export default BookAppointments;