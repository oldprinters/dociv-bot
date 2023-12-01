//inputValues.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import VALUES from "../controllers/values.js"
import Pressure from "../controllers/pressure.js"
import {outDateTime, outDate, outTimeDate} from "../utils.js"
import {queryYesNoMenu} from "../keyboards/keyboards.js"

const inputValues = new Scenes.BaseScene('INPUT_VALUES')
//--------------------------------------
inputValues.enter(async ctx => {
    await ctx.reply("Введите результаты измерений:")
})
//--------------------------------------
inputValues.start(ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
inputValues.hears(/^\d{2,3}[\/\\ -\*]\d{2,3}$/, async ctx => {
    await ctx.reply("Вы ввели давление: " + ctx.match[0])
    const pressure = new Pressure(ctx)
    const message = await pressure.setValue(ctx)
    await ctx.reply(message)
    const arr = await pressure.getStatistic(1)
    if(arr.length > 0){
        let strOut = '<pre>'
        let cD = new Date('2011-05-20')
        for( let el of arr ){
            if(outDate(cD) == outDate(el.dataTime)){
                strOut += '           ' + outTimeDate(el.dataTime) + '  '
            } else {
                cD = el.dataTime
                strOut += outDateTime(el.dataTime) + '  '
            }
            strOut += el.val + '\n'
        }
        strOut += '</pre>'
        await ctx.replyWithHTML(strOut)
    }
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.hears(/^\d{2,3}[\/\\ -\*]\d{2,3}[\/\\ -\*]\d{2,3}$/, async ctx => {
    await ctx.reply("Вы ввели давление и пульс." + ctx.match[0])

    // console.log("pressure =>", ctx.match[0])
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.hears(/^del$/i, async ctx => {
    await ctx.reply("Удалить последнюю запись?", queryYesNoMenu())
})
//--------------------------------------
inputValues.action('queryYes2', async ctx => {
    console.log("session =", ctx.session)
    const pressure = new Pressure(ctx)
    if(ctx.session.last_id > 0)
        pressure.delete(ctx.session.last_id)
})
//--------------------------------------
inputValues.action('queryNo2', async ctx => {
    
})
//--------------------------------------
inputValues.on('text', async ctx => {
    await ctx.reply("????? text")
    ctx.scene.reenter()
})

export default inputValues