import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import UserData from "../controllers/userData.js"
import {queryDocPatient, queryYesNoMenu} from '../keyboards/keyboards.js'

const selectRole = new Scenes.BaseScene('SELECT_ROLE')
//--------------------------------------
selectRole.enter(async ctx => {
    ctx.reply("Выберите Вашу роль:", queryDocPatient())
})
//--------------------------------------
selectRole.start(ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
selectRole.action('doctor',  async ctx => {
    await ctx.answerCbQuery('Loading')
    const user = new Users(ctx.from.id)
    user.setRole('doc')
    await user.init(ctx)
    await ctx.reply("Введите ФИО:")
    // ctx.scene.enter('SELECT_PATIENT')
    // await ctx.scene.enter('SEND_QUERY_ADMIN')
})
//--------------------------------------
selectRole.action('patient',  async ctx => {
    await ctx.answerCbQuery('Loading')
    const user = new Users(ctx.from.id)
    user.setRole('patient')
    await user.init(ctx)
    await ctx.reply("Ok")
    ctx.scene.enter('INPUT_VALUES')
    // await ctx.scene.enter('SEND_QUERY_ADMIN')
})
//--------------------------------------
selectRole.on('text', async ctx => {
    console.log(ctx.message.text)
    ctx.session.fio =  ctx.message.text
    await ctx.reply(`Правильно ввели? Сохраняем?`, queryYesNoMenu())
})
//--------------------------------------
selectRole.action('queryYes2', async ctx => {
    await ctx.answerCbQuery('Loading')
    const userData = new UserData(ctx)
    const insertedId = await userData.setFio(ctx.session.fio)
    if(insertedId > 0){
        await ctx.reply("Ok")
    }
})
//--------------------------------------
selectRole.action('queryNo2', async ctx => {
    await ctx.answerCbQuery('Loading')
    await ctx.reply("Введите ФИО:")
})

export default selectRole