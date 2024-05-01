import Config from './config'
import "./modules/pfStats"

register("command", (...args) => {
    try {
        if (!args || !args[0]) return Config.openGUI()
    } catch (e) {
        ChatLib.chat(e);
    }
}).setName("autokick").setAliases("ak")