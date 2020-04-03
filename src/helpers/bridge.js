import { COOKIES } from "./../constants"
import Cookies from "js-cookie"
import Gateway from "./../gateway";

export default {
    isBridgeDiscovered: () => {
        const HUE_BRIDGE_IP = Cookies.get(COOKIES.HUE_BRIDGE_IP)
        const HUE_BRIDGE_USER = Cookies.get(COOKIES.HUE_BRIDGE_USER)
        return !!HUE_BRIDGE_IP && !!HUE_BRIDGE_USER
    },
    createBridgeUser: async clientName => {
        const { data } = await Gateway.findBridgeIp();
        const { data: newUserData } = await Gateway.createNewUser(data[0].internalipaddress, clientName)
        const { username } = newUserData[0].success
        Cookies.set(COOKIES.HUE_BRIDGE_IP, data[0].internalipaddress)
        Cookies.set(COOKIES.HUE_BRIDGE_USER, username)
        window.location.reload()
    }
}
