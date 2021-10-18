import React from 'react';
import { View } from 'react-native';

function PatientHistory(props) {
    return (
        <View>
            {console.log(props.route.params)}
        </View>
    );
}

export default PatientHistory;