//inputValues.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import VALUES from "../controllers/values.js"
import Pressure from "../controllers/pressure.js"

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
    console.log("pressure =>", pressure)
    pressure.setValue(ctx.match[0])

    console.log("pressure =>", pressure.getValue())
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.hears(/^\d{2,3}[\/\\ -\*]\d{2,3}[\/\\ -\*]\d{2,3}$/, async ctx => {
    await ctx.reply("Вы ввели давление и пульс." + ctx.match[0])

    // console.log("pressure =>", ctx.match[0])
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.on('text', async ctx => {
    await ctx.reply("????? text")
    ctx.scene.reenter()
})

export default inputValues