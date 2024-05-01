import { getRank, prefix } from "../../BloomCore/utils/Utils"
import Promise from "../../PromiseV2"
import request from "../../requestV2"

import Config from "../config"

prefix = "§6[§cAutoKick§6]§r"

const makeRequest = (address) => request({
    url: address,
    headers: {
        'User-Agent': ' Mozilla/5.0',
        'Content-Type': 'application/json'
    },
    json: true
})

export const chat = (msg) => ChatLib.chat(msg)
export const chatid = (msg, id) => new Message(msg).setChatLineId(id).chat()
export const hover = (msg, value) => new TextComponent(msg).setHoverValue(value).chat()
export const breakchat = () => ChatLib.chat(ChatLib.getChatBreak(" "))

const getPlayerUuid = (username, out) => {
    chatid(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        return out({
            uuid: response.id,
            username: response.name
        })
    }).catch(error => {
        ChatLib.chat(error)
    })
}

const getPlayerRank = ({uuid, username}, out) => {
    chatid(`${prefix} &fGetting &6${username} &fRank...`, 1515)
    Promise.resolve(makeRequest(`https://api.hypixel.net/player?uuid=${uuid}&key=${Config.apiKey}`)).then(response => {
        ChatLib.clearChat(1515)
        return out([getRank(response), response.player?.achievements?.skyblock_treasure_hunter])
    }).catch(error => {
        ChatLib.chat(error)
    })
}

const getPlayerProfileData = ({uuid, username}, out) => {
    chatid(`${prefix} &fGetting &6${username} &fPlayer Profile...`, 1515)
    Promise.resolve(makeRequest(`https://api.hypixel.net/skyblock/profiles?key=${Config.apiKey}&uuid=${uuid}`)).then(response => {
        const profile = !response.profiles || !response.profiles.length ? null : response.profiles.find(a => a.selected) ?? response[0]
        if(!profile) return
        ChatLib.clearChat(1515)
        return out([profile["members"][uuid], profile])
    }).catch(error => {
        ChatLib.chat(error)
    })
    
}

export const getPlayerData = (username, out) => {
    let playerData = {
        uuid: null,
        username: null,
        rank: null,
        secrets: null,
        profileApi: null
    }

    getPlayerUuid(username, (response) => {
        playerData.uuid = response.uuid
        playerData.username = response.username

        getPlayerRank(response, (rank) => {
            playerData.rank = rank[0]
            playerData.secrets = rank[1]

            getPlayerProfileData(response, (profileData) => {
                playerData.profileApi = profileData
                return out(playerData)
            })
        })
    })
}


export const isBetween = (number, [a, b]) => number >= a && number <= b
export const getSbLevelPrefix = (number) => Object.keys(sbLevelsPrefix).filter(pref => isBetween(number, sbLevelsPrefix[pref]))
export const sbLevelsPrefix = {
    "&7": [1, 39],
    "&f": [40, 79],
    "&e": [80, 119],
    "&a": [120, 159],
    "&2": [160, 199],
    "&b": [200, 239],
    "&3": [240, 279],
    "&9": [280, 319],
    "&d": [320, 359],
    "&5": [360, 399],
    "&6": [400, 439],
    "&c": [440, 479]
}