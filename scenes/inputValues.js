//inputValues.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import VALUES from "../controllers/values.js"

const inputValues = new Scenes.BaseScene('INPUT_VALUES')
//--------------------------------------
inputValues.enter(async ctx => {
    const val = new VALUES(ctx, "temper")
    await ctx.reply("Введите результаты измерений:")
    const user = new Users(ctx)
    let us = await user.readUserTlg()
    // console.log("us =", us)
})
//--------------------------------------
inputValues.start(ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
inputValues.hears(/^\d{2,3}[\/\\ -\*]\d{2,3}$/, async ctx => {
    await ctx.reply("Вы ввели давление." + ctx.match[0])

    // console.log("pressure =>", ctx.match[0])
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