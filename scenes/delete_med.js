//delete_med.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import {queryMedicamentDeleteMenu, queryYesNoMenu} from "../keyboards/keyboards.js"

const delete_med = new Scenes.BaseScene('DELETE_MED')
//--------------------------------------
delete_med.start(async ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
delete_med.help(ctx => {
    ctx.reply('Нажимая кнопки с названием препарата, Вы вычеркиваете их из списка.')
})
//--------------------------------------
delete_med.enter(async ctx => {
    const list = await ctx.session.pr.list()
    ctx.reply(`Выберите название удаляемого препарата`, queryMedicamentDeleteMenu(list))
})
//--------------------------------------------
delete_med.action(/^medicamentDelete\d{1,4}$/, async ctx => {
    await ctx.answerCbQuery('Loading')
    const med_id = parseInt(ctx.match[0].slice(16))
    // console.log("=====>", med_id)
    const res = await ctx.session.pr.delete(med_id)
    ctx.scene.enter('SELECT_PATIENT')
})

export default delete_med