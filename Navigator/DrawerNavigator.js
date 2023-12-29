import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign } from 'react-native-vector-icons'
import Home from '../screens/Home';
import CustomDrawer from '../component/CustomerDrawer';
import { Platform } from 'react-native';
import { Image } from 'react-native';
import MobilePunch from '../screens/MobilePunch';
import PunchPhoto from '../screens/PunchPhoto';
import Calendar from '../screens/Calendar';
import Profile from '../screens/Profile';
import Request from '../screens/Request';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}

function MobilePunchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            <Stack.Screen name="MobilePunch" component={MobilePunch} />
            <Stack.Screen name="PunchPhoto" component={PunchPhoto} />
        </Stack.Navigator>
    )
}

function RequestStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            <Stack.Screen name="Request" component={Request} />
        </Stack.Navigator>
    )
}


export default function DrawerNavigator() {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#3a7bd5',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333333',
                drawerLabelStyle: { marginLeft: -20, fontSize: 17 },
                // drawerHideStatusBarOnOpen: true,
                // headerStatusBarHeight: Platform.select({ android: 0 }),
            }}
        >

            <Drawer.Screen name="Home" component={HomeStack}
                options={{
                    drawerIcon: ({ color }) => (
                        <Image style={{ tintColor: color, width: 20, height: undefined, aspectRatio: 1 }} source={require('../assets/icons/home.png')} />
                    ),
                    drawerItemStyle: { paddingHorizontal: 16, },
                }}
            />

            <Drawer.Screen name="Calendar" component={Calendar}
                options={{
                    drawerIcon: ({ color }) => (
                        <Image style={{ tintColor: color, width: 20, height: undefined, aspectRatio: 1 }} source={require('../assets/icons/calendar.png')} />
                    ),
                    drawerItemStyle: { paddingHorizontal: 16, },
                    title: 'Calendar',
                    sceneContainerStyle: { backgroundColor: 'white' }
                }}
            />

            <Drawer.Screen name="Profile" component={Profile}
                options={{
                    drawerIcon: ({ color }) => (
                        <Image style={{ tintColor: color, width: 20, height: undefined, aspectRatio: 1 }} source={require('../assets/icons/profile.png')} />
                    ),
                    drawerItemStyle: { paddingHorizontal: 16, },
                    title: 'Profile',
                    sceneContainerStyle: { backgroundColor: 'white' }
                }}
            />

            <Drawer.Screen name="MobilePunch" component={MobilePunchStack}
                options={{
                    drawerIcon: ({ color }) => (
                        <Image style={{ tintColor: color, width: 20, height: undefined, aspectRatio: 1 }} source={require('../assets/icons/fingerprint.png')} />
                    ),
                    drawerItemStyle: { paddingHorizontal: 16, },
                    title: 'Punch',
                    sceneContainerStyle: { backgroundColor: 'white' }
                }}
            />

            <Drawer.Screen name="Request" component={RequestStack}
                options={{
                    drawerIcon: ({ color }) => (
                        <Image style={{ tintColor: color, width: 20, height: undefined, aspectRatio: 1 }} source={require('../assets/icons/request.png')} />
                    ),
                    drawerItemStyle: { paddingHorizontal: 16, },
                    title: 'Request',
                    sceneContainerStyle: { backgroundColor: 'white' }
                }}
            />
        </Drawer.Navigator>
    );
}