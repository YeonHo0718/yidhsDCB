import axios from 'axios'
import { MessageEmbed } from 'discord.js'

const embed = new MessageEmbed()
const denyMsg = [
    "시러요ㅗ",
    "싫ㅋ",
    "왜 명령이지?",
    "ㅗ",
    "ㄲㅈ",
    "시른디",
    ";;",
    "ㅎ"
]

function random(min,max){
    return Math.floor(Math.random()*(max-min)) + min
}

async function getMeal(){
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()+1
    const date = today.getDate()
    const yyyymmdd = [year,month<10?"0"+month:month,date].join("")

    const res = await axios({
        url: 'https://open.neis.go.kr/hub/mealServiceDietInfo?SD_SCHUL_CODE=7010096&ATPT_OFCDC_SC_CODE=B10&Type=json&MLSV_YMD='+yyyymmdd,
        method: 'GET'
    })
    
    if(res.status==200 && res.data.mealServiceDietInfo[0].head[1].RESULT.CODE=="INFO-000"){
        const result = res.data.mealServiceDietInfo[1].row[0]
        const dish = result.DDISH_NM.split("<br/>").map(e=>"- "+e).join("\n")  //메뉴
        /*
        const orplc = result.ORPLC_INFO  //원산지
        const cal = result.CAL_INFO  //칼로리
        const ntr = result.NTR_INFO  //영양정보
        */
        return dish
    }else{
        return false
    }
}

export async function sendMeal(msg){
    const meal = await getMeal()
    if(!meal){  //정보없음
        msg.reply("오늘의 급식 정보를 찾을 수 없네요!")
    }else{
        const ran = random(1,100)
        embed.setColor('#c4302b')
            .setTitle(`:rice: **오늘의 급식!**`)
            .setDescription(meal)
        if(ran<=30){
            const m = await msg.reply(denyMsg[random(0,denyMsg.length-1)])
            setTimeout(()=>m.edit({content: null, embeds: [embed]}),3500)
        }else{
            msg.reply({content: null, embeds: [embed]})
        }
    }
}