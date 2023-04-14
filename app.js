import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config()

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', () => {
    console.log('로그인 완료!' + new Date())
    client.user?.setActivity('이드봇은 뒹굴뒹굴')
});

client.on("messageCreate", (msg) => {
    if (msg.content == "d") {
        axios({
            url: 'https://open.neis.go.kr/hub/mealServiceDietInfo?SD_SCHUL_CODE=7010096&ATPT_OFCDC_SC_CODE=B10&Type=json&MLSV_YMD=20230414',
            method: 'GET'
        }).then(res => {
            if(res.status==200 && res.data.RESULT.CODE=="INFO-000"){
                console.log(JSON.stringify(res.data,null,4))
                const result = res.data.mealServiceDietInfo[1].row[0];
                const dish = result.DDISH_NM.replace(/\<br\/\>/g,"\n");
                const orplc = result.ORPLC_INFO;
                const cal = result.CAL_INFO;
                const ntr = result.NTR_INFO;
                msg.reply(dish)
            }else{
                msg.reply("업서 돌아가.")
            }
        });
    }
});

client.login(process.env.TOKEN);