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
import ListOfLeave from '../screens/Requests/Leave/ListOfLeave';
import CreateLeave from '../screens/Requests/Leave/CreateLeave';
import CreateOnDutyRequest from '../screens/Requests/On Duty/CreateOnDutyRequest';
import ListofOnDutyRequests from '../screens/Requests/On Duty/ListofOnDutyRequests';
import ListOfShiftChangeRequests from '../screens/Requests/Shift Change/ListOfShiftChangeRequests';
import CreateShiftChangeRequest from '../screens/Requests/Shift Change/CreateShiftChangeRequest';
import ListOfEHCRequests from '../screens/Requests/EHC OT/ListOfEHCRequests';
import CreateEHCRequest from '../screens/Requests/EHC OT/CreateEHCRequest';
import CreateCOffRequest from '../screens/Requests/C_Off/CreateCOffRequest';
import ListOfCOffRequests from '../screens/Requests/C_Off/ListOfCOffRequests';

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
            <Stack.Screen name="ListOfLeave" component={ListOfLeave} />
            <Stack.Screen name="CreateLeave" component={CreateLeave} />
            <Stack.Screen name="ListofOnDutyRequests" component={ListofOnDutyRequests} />
            <Stack.Screen name="CreateOnDutyRequest" component={CreateOnDutyRequest} />
            <Stack.Screen name="ListOfShiftChangeRequests" component={ListOfShiftChangeRequests} />
            <Stack.Screen name="CreateShiftChangeRequest" component={CreateShiftChangeRequest} />
            <Stack.Screen name="ListOfEHCRequests" component={ListOfEHCRequests} />
            <Stack.Screen name="CreateEHCRequest" component={CreateEHCRequest} />
            <Stack.Screen name="ListOfCOffRequests" component={ListOfCOffRequests} />
            <Stack.Screen name="CreateCOffRequest" component={CreateCOffRequest} />
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