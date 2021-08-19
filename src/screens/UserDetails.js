import React, { useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native'
import { Text, Input, ListItem, Chip, Badge, Button } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '@react-navigation/native';

function UserDetails(props) {

    // Theme
    const { colors } = useTheme()
    // End theme

    // Date picker
    const [buttonColour, setbuttonColour] = useState("#C84771")

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

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

    const showDatepicker = () => {
        showMode('date');
    };

    // Date picker ends

    // Gender
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Prefer not to say', value: 'Prefer not to say' }
    ]);
    // Gender Ends

    const conditions = [
        { id: '1', name: 'AIDS/HIV' }, { id: '2', name: "Alzheimer's" }, { id: '3', name: "Anemia" }, { id: '4', name: "Asthma" }, { id: '5', name: "Blood Disease" },
        { id: '6', name: "Breathing Problem" }, { id: '7', name: "Cancer" },
        { id: '8', name: "Chest Pain" }, { id: '9', name: "Covid" }, { id: '10', name: "Diabetes" }, { id: '11', name: 'Drug Addiction' }, { id: '12', name: "Epilepsy" }, { id: '13', name: "Excessive Bleeding" },
        { id: '14', name: "Frequent Cough" }, { id: '15', name: "Frequent Diarrhea" }, { id: '16', name: "Genital Herpes" },
    ]

    const [selectedId, setSelectedId] = useState([]);

    // Badge 
    const [badgeMessage, setbadgeMessage] = useState("")
    const [badgeColour, setbadgeColour] = useState("")
    // , "Hay Fever", "Heart Disease",
    //     "Hepatitis A,B or C", "High Blood Pressure", "High Cholesterol", "Kidney Problem",
    //     "Liver Disease", "Lungs Disease", "Low Blood Pressure", "Others"
    // const Item = ({ item, onPress, backgroundColor, textColor }) => (
    //     <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    //         <Text style={[styles.title, textColor]}>{item.id}</Text>
    //     </TouchableOpacity>
    // );
    const [backgroundColour, setbackgroundColour] = useState("white")

    const removeDisease = (item) => {
        let tempArray = [...selectedId]
        const index = tempArray.findIndex(obj => obj.id === item.id)
        tempArray.splice(index, 1)
        setSelectedId(tempArray)
        setbadgeMessage(`${item.name} is removed`)
        setbadgeColour('error')
    }



    const renderItem = ({ item }) => {

        // const backgroundColor = item.id === selectedId ? "" : "white";
        // const color = item.id === selectedId ? 'white' : 'black';

        return (
            <TouchableOpacity
                onPress={() => {
                    let tempArray = [...selectedId]
                    if (tempArray.findIndex(obj => obj.id === item.id) != -1) {
                        console.log('exist')
                    } else {
                        console.log('not exist')
                        tempArray.push(item)
                    }
                    setSelectedId(tempArray);
                    setbadgeMessage(`${item.name} added`)
                    setbadgeColour('success')
                    setbackgroundColour('red')
                }
                }
                style={{ backgroundColor: backgroundColour }}
            >
                <ListItem bottomDivider >
                    <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 13 }}>{item.name}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </TouchableOpacity>
        )
    }


    return (
        <View style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            paddingTop: 20,
            backgroundColor: colors.primary
        }}>

            {badgeMessage != "" ?
                <Badge containerStyle={{ position: 'absolute' }} textStyle={{ fontWeight: 'bold' }} status={badgeColour} value={badgeMessage} />
                : null}
            <View style={styles.dob}>
                <Text style={{ fontWeight: 'bold' }}>Date of Birth</Text>
                <Button onPress={showDatepicker} titleStyle={{ color: buttonColour, fontSize: 15 }} type='clear' title="Select Date" />
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        style={{ width: '37%', backgroundColor: "white" }}
                    />
                )}
            </View>

            <View style={styles.gender}>
                <View style={{ width: '33%' }}>
                    <Text style={{ fontWeight: 'bold' }}>Gender</Text>
                </View>
                <View style={{ width: '50%' }}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={{ backgroundColor: colors.secondary, borderRadius: 20, borderWidth: 0 }}
                        textStyle={{ fontSize: 12, color: 'white' }}
                        labelStyle={{
                            fontWeight: "bold"
                        }}
                        dropDownContainerStyle={{ backgroundColor: colors.secondary, borderWidth: 0 }}
                        bottomOffset={100}
                    />
                </View>
            </View>
            <View style={styles.phoneNumber}>
                <Input
                    placeholder="Phone number"
                    maxLength={10}
                    textContentType='telephoneNumber'
                    label="Phone"
                    keyboardType='number-pad'
                    labelStyle={{ fontSize: 14, color: 'black' }}
                    inputStyle={{ fontSize: 15 }}
                />
            </View>
            <View style={{ display: 'flex', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Medical History</Text>
                <Text style={{ fontSize: 12 }}>Pick the condition from below if you have them</Text>
                {selectedId.length != 0 ?
                    <View style={{ height: 50, marginTop: 20 }}>
                        <ScrollView horizontal={true}>
                            {selectedId.map(item => {
                                return (
                                    <Chip
                                        title={item.name || ""}
                                        key={item.id}
                                        icon={{
                                            name: "close",
                                            type: "font-awesome",
                                            size: 20,
                                            color: "blue",
                                        }}
                                        type="outline"
                                        iconRight
                                        style={{ marginHorizontal: 5 }}
                                        onPress={() => { removeDisease(item) }}
                                    />
                                )
                            })}
                        </ScrollView>
                    </View>
                    : null}

                <View style={selectedId != 0 ? styles.medicalConditionList1 : styles.medicalConditionList2}>
                    <FlatList
                        data={conditions}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                    {selectedId.length != 0 ?
                        <View style={Platform.OS === 'ios' ? { position: 'absolute', marginTop: '75%', marginLeft: '75%' } :
                            { position: 'absolute', marginTop: '65%', marginLeft: '75%' }}>
                            <Button
                                title="Next"
                                buttonStyle={{ width: 90, backgroundColor: colors.secondary, height: 90, borderRadius: 50, opacity: .8 }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => props.navigation.navigate('Dashboard')}
                            />
                        </View>

                        : null
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    dob: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 30
    },
    gender: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 30
    },
    phoneNumber: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%'
    },
    medicalConditionList1: {
        width: 400, height: '65%'
    },
    medicalConditionList2: {
        width: 400, height: '70%', marginTop: '5%'
    }
})
export default UserDetails;