import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react"

const userContext = createContext()

function UserContext(props) {

    const [user, setUser] = useState('')

    useEffect(() => {
        const getUser = async () => {
            return await AsyncStorage.getItem("app_user") ? setUser(JSON.parse(await AsyncStorage.getItem("app_user"))) : setUser(null)
        }

        getUser();
    }, [])

    return (
        <userContext.Provider value={{ user, setUser }}>
            {props.children}
        </userContext.Provider>
    )
}

export { UserContext, userContext }