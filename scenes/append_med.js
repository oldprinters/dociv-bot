//append_med.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import {queryMedicamentSelectMenu, queryYesNoMenu} from "../keyboards/keyboards.js"

const append_med = new Scenes.BaseScene('APPEND_MED')
//--------------------------------------
append_med.start(async ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
append_med.help(ctx => {
    ctx.reply('Надо что-то назначить.')
})
//--------------------------------------
append_med.enter(async ctx => {
    ctx.session.pr.clear()
    const fio = await ctx.session.pr.getInfo()
    ctx.reply(`Пациент ${fio}. Введите название препарата`)
})
//---------------------------------------
append_med.action('queryYes2', async ctx => {
    ctx.answerCbQuery('Loading')
    await ctx.session.pr.setName()
    await ctx.reply("Название препарата записано.")
    ctx.scene.enter('MED_PERIOD')
})
//---------------------------------------
append_med.action('queryNo2', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.enter('SELECT_PATIENT')
})
//--------------------------------------------
append_med.action(/^medicamentSelect\d{1,4}$/, async ctx => {
    await ctx.answerCbQuery('Loading')
    const med_id = parseInt(ctx.match[0].slice(16))
    ctx.session.pr.setMedId(med_id)
    ctx.scene.enter('MED_PERIOD')
})
//--------------------------------------
append_med.on('text', async ctx => {
    const name = ctx.message.text
    ctx.session.pr.setTmpName(name)
    const res = await ctx.session.pr.searchName(name)
    // console.log("res =", res)
    if(res.t == 0){  //препарат отсутствует в БД
        ctx.scene.session.medName = name
        ctx.reply(`Название ${name} незнакомо программе. Добавить название препарата ${name} в БД?`, queryYesNoMenu())
    } else if(res.t == 2){
        ctx.reply(`Выберите нужный или введите название полностью:`, queryMedicamentSelectMenu(res.r))
    } else {
        ctx.session.pr.setMedId(res.r)
        ctx.scene.enter('MED_PERIOD')
    }
})
//---------------------------------------

export default append_med