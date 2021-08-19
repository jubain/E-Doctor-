import React, { useState } from 'react';
import { View, useWindowDimensions, Dimensions, FlatList } from 'react-native'
import { Avatar, Text, Button, ListItem } from 'react-native-elements'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '@react-navigation/native';


function Doctor(props) {
    const doctor = props.route.params.item
    //props.route.params.item.history

    const { colors } = useTheme()


    const renderItem = ({ item }) => {
        return (
            <ListItem bottomDivider>
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem>
        )
    }

    const History = () => (
        <View>
            <FlatList
                data={props.route.params.item.history}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );

    const Awards = (doctor) => (
        <View>
            <FlatList
                data={props.route.params.item.awards}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );

    const Reviews = (doctor) => (
        <View />
    );

    // Tab View
    const layout = useWindowDimensions();
    const height = Dimensions.get("window").height

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'history', title: 'History' },
        { key: 'awards', title: 'Awards' },
        { key: 'reviews', title: 'Reviews' },
    ]);

    const renderScene = SceneMap({
        history: History,
        awards: Awards,
        reviews: Reviews
    });
    // End Tab View

    return (
        <View style={{ display: 'flex', alignItems: 'center', borderWidth: 2, height: '100%' }}>
            <View style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    rounded
                    size='xlarge'
                    source={{
                        uri: 'https://cdn1.iconfinder.com/data/icons/avatar-flat-design-big-family/512/avatar_sexy_woman-512.png'
                    }}
                />
                <Text h4>{doctor.name}</Text>
                <Text h4>{doctor.department}</Text>
                <Text>UOB Hospital</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                style={{ width: '100%' }}
                renderTabBar={props => <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: 'wheat' }}
                    style={{ backgroundColor: colors.secondary }}
                />}
            />
            <View style={{ width: '100%' }}>
                <Button buttonStyle={{ paddingBottom: 35, backgroundColor: colors.secondary }} title="Book" />
            </View>
        </View>
    );
}

export default Doctor;