//inp_note.js
import {Telegraf, Markup, Scenes, session} from "telegraf"

const inp_note = new Scenes.BaseScene('INP_NOTE')
//--------------------------------------
inp_note.enter(async ctx => {
    await ctx.reply("Расскажите как принимать препарат:")
})
//--------------------------------------
inp_note.start(ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
inp_note.help( ctx => {
    ctx.replyWithHTML(`Как, в какое время и в каких количествах принимать преперат ${ctx.session?.pr.getName()}?`)
})
//--------------------------------------
inp_note.leave(ctx => {
    ctx.reply("Спасибо за информацию!")
})
//-------------------------------------- запись в бд
inp_note.on('message', async ctx => {
    ctx.session.pr.setNote(ctx.message.text)
    const str = await ctx.session.pr.insert()
    await ctx.reply(str)
    ctx.scene.enter('PRESCRIPTION')
})
//--------------------------------------

export default inp_note