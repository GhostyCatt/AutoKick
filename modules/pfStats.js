import { calcSkillLevel, convertToPBTime, prefix } from "../../BloomCore/utils/Utils";
import PogObject from "../../PogData";
import config from "../config";
import { getPlayerData, getSbLevelPrefix, chat} from "../utils/apiInteract";

const savedData = new PogObject("AutoKick", {
    blacklist: [],
    whitelist: []
}, "data/data.json")

prefix = "§6[§cAutoKick§6]§r"

export function pbCheck(pb) {
    switch ( config.minPB ) {
        case 0: // 4:40 = 280000
            if ( parseInt(pb) > 280000) {
                return false
            } else return true;
        case 1: // 5:00 = 300000
            if ( parseInt(pb) > 300000) {
                return false
            } else return true;
        case 2: // 5:30 = 330000
            if ( parseInt(pb) > 330000) {
                return false
            } else return true;
        case 3: // 6:00 = 360000
            if ( parseInt(pb) > 360000) {
                return false
            } else return true;
        case 4: // Custom PB
            if ( parseInt(pb) > parseInt(config.customMinPB)) {
                return false
            } else return true;
    }
}
function checkKick(data) {
    if (config.BlacklistUse) {
        if (savedData.blacklist.includes(data.ign.toLowerCase())) {
            return [true, `&6Blacklisted Player.`]
        }
    }
    if (config.WhitelistUse) {
        if (savedData.whitelist.includes(data.ign.toLowerCase())) {
            return [false, `&aWhitelisted Player`]
        }
    }
    if (data.cata < config.minCata) { // Cata Check
        return [true, `&cLow Cata.`]
    } else if (parseInt(data.class.level) < config.minClass) { 
        return [true, `&cLow Class Level.`]
    } else if (parseInt(data.mp) < config.minMP) {
        return [true, `&6Low Magical Power.`]
    } else if (parseInt(data.sbLevel) < config.minLvl) {
        return [true, `&6Low Skyblock Level.`]
    } else if (parseInt(data.secrets) < parseInt(config.minSecrets)) {
        return [true, `&6Low Secret Count.`]
    } else if (!pbCheck(data.pb)) {
        return [true, `&6Slow Personal Best.`]
    } 
    return [false, "&aGood Player"]
}

register("chat", (player, classs, level) => {
    // Main Toggle
    if (!config.toggle) return

    // Sound
    if ( config.PFSound ) { World.playSound( config.PFSoundID, config.PFSoundVolume, 1.0) }

    // Getting Data
    if(Config.apiKey == "null") return chat(`${prefix} &cError Invalid Api Key`)
    const impData = {
        ign: null,
        cata: null,
        class: {
            name: classs,
            level: level
        },
        mp: null,
        sbLevel: null,
        pb: null,
        secrets: null,
        spr: null
    }

    getPlayerData(player, (profileData) => {
        const playerProfile = profileData.profileApi?.[0]
        
        impData.ign = profileData.username
        impData.cata = calcSkillLevel("catacombs", playerProfile.dungeons?.dungeon_types?.catacombs?.experience)
        impData.mp = playerProfile?.accessory_bag_storage?.highest_magical_power
        impData.sbLevel = (playerProfile?.leveling?.experience)/100
        let masterSPlusPB = Object.keys(playerProfile?.dungeons?.dungeon_types?.master_catacombs?.fastest_time_s_plus ?? {})
        .reduce((accumulative, floorName) => {
            accumulative[`M${floorName}`] = playerProfile.dungeons.dungeon_types.master_catacombs.fastest_time_s_plus[floorName]
            return accumulative
        }
        , {})
        impData.pb = masterSPlusPB["M7"]  // Other Floor support coming soon tm
        impData.secrets = profileData.secrets
        impData.spr = profileData.secrets/(playerProfile?.dungeons?.dungeon_types?.catacombs?.times_played?.total + playerProfile?.dungeons?.dungeon_types?.master_catacombs?.times_played?.total)


        // Send Message
        const toKick = checkKick(impData);
        let msg = `${prefix} &8[${getSbLevelPrefix(impData.sbLevel)}${parseInt(impData.sbLevel)}&8] &6${impData.ign} &f| Suggested Kick: ${toKick[0] ? "&cTrue":"&aFalse"} &f| Reason: ${toKick[1]}`
        new Message(new TextComponent(msg).setHover(
            "show_text", 
            `&6Catacombs Level: &c${impData.cata}\n&6Magical Power: &c${impData.mp}\n&6PB: &c${convertToPBTime(impData.pb)}\n&6Total Secrets: &c${impData.secrets}`
        )).chat()

        // Party Message
        
        if (config.SendStats) {
            setTimeout(() => {
                ChatLib.command(
                    `pc Skyblock Level: ${parseInt(impData.sbLevel)} | M7 PB: ${convertToPBTime(impData.pb)} | Highest Magical Power: ${impData.mp}`
                )
            }, 500);
        }

        // Auto Kick 
        if (config.AutoKick && toKick) {
            setTimeout(() => {
                ChatLib.command(
                    `p kick ${impData.ign}`
                )
            }, 1000);
        }
    })

}).setCriteria("Party Finder > ${player} joined the dungeon group! (${classs} Level ${level})")

export function addWhitelist(ign) {
    const username = ign.toLowerCase()
    if (savedData.whitelist.includes(username)) {
        ChatLib.chat(`${prefix} &6${username} &cis already whitelisted.`)
    } else {
        savedData.whitelist.push(username);
        savedData.save()
        ChatLib.chat(`${prefix} &6${username} &aadded to Whitelist!`)
        return 0
    }
}
export function unWhitelist(ign) {
    const username = ign.toLowerCase()
    const index = savedData.whitelist.indexOf(username)
    if (index !== -1) {
        savedData.whitelist.splice(index, 1)
        savedData.save()
        ChatLib.chat(`${prefix} &6${username} &aremoved from Whitelist!`)
        return 0
    } else {
        ChatLib.chat(`${prefix} &6${username} &cis not in the whitelist.`)
    }
}
export function addBlacklist(ign) {
    const username = ign.toLowerCase()
    if (savedData.blacklist.includes(username)) {
        ChatLib.chat(`${prefix} &6${username} &cis already blacklisted.`)
    } else {
        savedData.blacklist.push(username);
        savedData.save()
        ChatLib.chat(`${prefix} &6${username} &aadded to Blacklist!`)
        return 0
    }
}
export function unBlacklist(ign) {
    const username = ign.toLowerCase()
    const index = savedData.blacklist.indexOf(username)
    if (index !== -1) {
        savedData.blacklist.splice(index, 1)
        savedData.save()
        ChatLib.chat(`${prefix} &6${username} &aremoved from Blacklist!`)
        return 0
    } else {
        ChatLib.chat(`${prefix} &6${username} &cis not in the blacklist.`)
    }
}

register("command", (...args) => {
    try {
        if (args[0].toLowerCase() == "help") {
            let messages = [
                `&6&m${ChatLib.getChatBreak(" ")}`,
                `&c&lParty Finder List Commands.`,
                `&7/pf whitelist&8- Displays whitelist`,
                `&7/pf whitelist add {user}&8- Adds user to whitelist`,
                `&7/pf whitelist remove {user}&8- Removes user from whitelist`,
                `&7/pf blacklist&8- Displays Blacklist`,
                `&7/pf blacklist add {user}&8- Adds user to whitelist`,
                `&7/pf blacklist remove {user}&8- Removes User from whitelist`,
                `&6&m${ChatLib.getChatBreak(" ")}`
            ]
            ChatLib.chat(messages.join("\n"))
        } else if (args[0].toLowerCase() == "blacklist") {
            if ( !args[1] ) {
                ChatLib.chat(`${prefix} &cBlacklisted Players: &7` + savedData.blacklist.join(", ")) 
                return
            } else if (args[1].toLowerCase() == "add") {
                addBlacklist(args[2])
            } else if ( args[1].toLowerCase() == "remove") {
                unBlacklist(args[2])
            } 
        } else if ( args[0].toLowerCase() == "whitelist") {
            if ( !args[1] ) {
                ChatLib.chat(`${prefix} &aWhitelisted Players: &7` + savedData.whitelist.join(", "))
                return
            } else if ( args[1].toLowerCase() == "add") {
                addWhitelist(args[2])
            } else if ( args[1].toLowerCase() == "remove") {
                unWhitelist(args[2])
            }
        } 
    } catch (e) {
        ChatLib.chat(e);
    }
}).setName("pf")