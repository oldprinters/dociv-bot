import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import {queryDocPatient} from '../keyboards/keyboards.js'
// import { selectShedActionMenu, selectActionAdminMenu, selectActionUserMenu } from '../keyboards/keyboards.js'
// import { 
//     dayToRem, getRoleName, getSheduleToday, helpForSearch, everyMonth, everyYear,
//     fullToRem, dmhmToRem, nHoursToRem, nHMtoRem, nMinutesToRem, outSelectedDay, outDateTime, 
//     remForDay, searchByLessonName, tomorrowRem 
// } from '../utils.js'

const selectRole = new Scenes.BaseScene('SELECT_ROLE')
//--------------------------------------
selectRole.enter(async ctx => {
    ctx.reply("Выберите Вашу роль:", queryDocPatient())
    
})
//--------------------------------------
selectRole.action('doctor',  async ctx => {
    await ctx.answerCbQuery('Loading')
    const user = new Users(ctx)
    user.setRole('doc')
    user.init()
    ctx.reply("Ok")
    // await ctx.scene.enter('SEND_QUERY_ADMIN')
})
//--------------------------------------
selectRole.action('patient',  async ctx => {
    await ctx.answerCbQuery('Loading')
    const user = new Users(ctx)
    user.setRole('patient')
    user.init()
    ctx.reply("Ok")
    // await ctx.scene.enter('SEND_QUERY_ADMIN')
})

export default selectRole