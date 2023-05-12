import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { sendMeal } from './utils/meal.js';

dotenv.config();

String.prototype.trimAll=function () {
    return String(this).replace(/ /g,"");
}

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', () => {
    console.log('로그인 완료!' + new Date())
    client.user?.setActivity('이드봇은 뒹굴뒹굴')
});

client.on("messageCreate", (message) => {
    const msg = message.content;
    const trimMsg = msg.trimAll();
    const koMsg = msg.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/gi,"");
    function msgStarts(arr){
        return arr.filter(e=>koMsg.startsWith(e)).length!=0
    }
    function msgEnds(arr){
        return arr.filter(e=>koMsg.endsWith(e)).length!=0
    }
    function msgHas(arr){
        return arr.filter(e=>koMsg.includes(e)).length!=0
    }
    
    if (msgStarts(["이드","이드야"])) {
        let cmd = koMsg.split("이드")[1]
        console.log(cmd)
        if(cmd.startsWith("야")) cmd=cmd.substr(1)
        
        if(cmd=="급식"||msgHas(["급식"]) && msgEnds(["알려줘","뭐야","뭐임","머임","모임","머야","모야"])) sendMeal(message)

    }
});

client.login(process.env.TOKEN);