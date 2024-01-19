import { View, StatusBar, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack } from 'native-base';
import Loader from '../component/Loader';
import { Ionicons, AntDesign, Entypo, FontAwesome5, MaterialCommunityIcons, Feather } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import Toast from 'react-native-root-toast';
import { url } from '../helpers';
import { userContext } from '../context/UserContext';

const Profile = ({ navigation }) => {

    const { user,defaultUrl } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [img, setImg] = useState('')

    useEffect(() => {

        async function fetchImage() {
            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
                "CompanyId": user?.EmployeeDetails?.CompanyId,
            });

            const response = await fetch("https://" + defaultUrl + 'Dashboard/GetImages', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()

                if (data?.UserImage) {
                    setImg(data)

                } else {
                    Toast.show(data?.error_msg, {
                        duration: 3000,
                    })
                    setLoader(false)
                }

            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
                setLoader(false)
            }
        }

        fetchImage()
    }, [])

    return (
        <NativeBaseProvider>
            {loader && < Loader />}

            <StatusBar translucent backgroundColor='transparent' />

            <ImageBackground source={require('../assets/images/profile-BG.png')} style={styles.titleBG} resizeMode='cover'>
                <HStack alignItems='center' justifyContent='space-between' mt={12 + StatusBar.currentHeight}>
                    <HStack alignItems='center'>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Ionicons name="md-menu-sharp" size={32} color="white" />
                        </TouchableOpacity>

                        <Text fontFamily={fonts.PopSB} fontSize={26} ml={7} color='white'>My Profile</Text>
                    </HStack>

                    <TouchableOpacity>
                        <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                    </TouchableOpacity>
                </HStack>

                <VStack px={3} mt={6}>
                    <View style={styles.imgView}>
                        {img?.UserImage ? <Image source={{ uri: `data:image/png;base64,${img?.UserImage}` }} style={styles.img} /> :
                            <AntDesign name="user" size={24} color="grey" />
                        }
                    </View>

                    <Text color='white' fontFamily={fonts.PopB} fontSize={26} mt={1}>{user?.Name}</Text>
                    <Text color='white' fontFamily={fonts.UrbanR} fontSize={17}>{user?.EmployeeDetails?.BusinessEmailId}</Text>
                    <Text color='white' fontFamily={fonts.UrbanB} fontSize={17} mt={1}>{user?.EmployeeDetails?.BusinessPhone}</Text>
                </VStack>
            </ImageBackground>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, marginTop: 10, paddingBottom: 200 }}>
                <VStack px={4} mb={5}>
                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Employee ID</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.EmployeeId}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <AntDesign name="creditcard" size={20} color="black" />
                            <Text style={styles.title}>card number</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.CardNo}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <FontAwesome5 name="building" size={20} color="black" />
                            <Text style={styles.title}>company</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.Company}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Ionicons name="information-circle-outline" size={18} color="black" />
                            <Text style={[styles.title, { textTransform: 'uppercase' }]}>SBU</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.SBU}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Ionicons name="git-branch-outline" size={20} color="black" />
                            <Text style={styles.title}>branch</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.Location}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Ionicons name="briefcase-outline" size={20} color="black" />
                            <Text style={styles.title}>department</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.Department}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <FontAwesome5 name="user-lock" size={16} color="black" />
                            <Text style={styles.title}>division</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.Division}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <MaterialCommunityIcons name="file-star-outline" size={20} color="black" />
                            <Text style={styles.title}>grade</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.Grade}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Ionicons name="ios-bandage-outline" size={20} color="black" />
                            <Text style={styles.title}>band</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.Band}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <MaterialCommunityIcons name="calendar-clock-outline" size={20} color="black" />
                            <Text style={styles.title}>Joining date</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.JoiningDate.split('T')[0]}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Feather name="user-check" size={20} color="black" />
                            <Text style={styles.title}>employee e-status</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.EmployeeStatus}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <FontAwesome5 name="user-cog" size={16} color="black" />
                            <Text style={styles.title}>functional head</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.FuntionalHead}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <MaterialCommunityIcons name="head-lightbulb-outline" size={20} color="black" />
                            <Text style={styles.title}>operational head</Text>
                        </HStack>
                        <Text style={styles.value}>{user?.EmployeeDetails?.OperationalHead}</Text>
                    </HStack>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    titleBG: {
        width: Dimensions.get('window').width,
        minHeight: undefined,
        aspectRatio: 1,
        paddingHorizontal: 18,
    },
    imgView: {
        backgroundColor: '#ccc',
        height: 110,
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        position: 'relative',
        marginBottom: 8,
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
        resizeMode: 'contain'
    },
    infoCard: {
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#fbdfbc',
        paddingVertical: 14,
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: fonts.PopB,
        fontSize: 15,
        marginLeft: 12,
        textTransform: 'capitalize',
        letterSpacing: .1,
    },
    value: {
        fontFamily: fonts.UrbanR,
        fontSize: 15,
    }
})

export default Profile;