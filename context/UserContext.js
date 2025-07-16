import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react"
import Geolocation from '@react-native-community/geolocation'

const userContext = createContext()

function UserContext(props) {

    const [user, setUser] = useState('')
    const [defaultUrl, setDefaultUrl] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const getDefaultUrl = async () => {
        const default_url = await AsyncStorage.getItem("protea_default_url")
        if (default_url != null) {
            setDefaultUrl(default_url)
        } else {
            setDefaultUrl('protealive.com:1102')
        }
    }

    useEffect(() => {
        const getUser = async () => {
            return await AsyncStorage.getItem("app_user") ? setUser(JSON.parse(await AsyncStorage.getItem("app_user"))) : setUser(null)
        }

        getUser();
        getDefaultUrl()

        Geolocation.getCurrentPosition(info => {

            setLatitude(info.coords.latitude)
            setLongitude(info.coords.longitude)
        })
    }, [])



    return (
        <userContext.Provider value={{ user, setUser, defaultUrl, setDefaultUrl,latitude,longitude }}>
            {props.children}
        </userContext.Provider>
    )
}

export { UserContext, userContext }