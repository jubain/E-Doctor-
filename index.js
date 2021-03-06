import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { createStore } from 'redux'
import { LogBox } from 'react-native'

import App from './App';
LogBox.ignoreAllLogs

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
