//selectPatient.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import { outResults, outResultsFile } from '../utils.js'
import DocPatient from "../controllers/doc_patient.js"
import { queryYesNoMenu, queryRepeat, queryPatientSelect, queryPeriodMenuNaz} from '../keyboards/keyboards.js'
import Pressure from "../controllers/pressure.js"
import Puls from "../controllers/puls.js"
import Temper from "../controllers/temper.js"
import Prescription from "../controllers/prescription.js"

const selectPatient = new Scenes.BaseScene('SELECT_PATIENT')
//--------------------------------------
selectPatient.start(async ctx => {
    ctx.scene.reenter()
})
//--------------------------------------
selectPatient.help(ctx => {
    ctx.reply('В данной ситуации, я не могу Вам помочь, извиниите.')
})
//--------------------------------------
selectPatient.enter(async ctx => {
    const dp = new DocPatient(ctx)
    const list = await dp.getPatients()
    if(list.length > 0){
        ctx.reply('Выберите пациента:', queryPatientSelect(list))
    } else {
        ctx.reply('У Вас пока отсутствуют пациенты.', queryRepeat())
    }
})
//--------------------------------------------
selectPatient.command('list', async ctx => {
    ctx.reply('Сохранить данные пациента в файл?', queryYesNoMenu())
})
//--------------------------------------------
selectPatient.action('queryYes2', async ctx => {
    await ctx.answerCbQuery('Loading')
    outResultsFile(ctx)
})
//--------------------------------------------
selectPatient.action('queryNo2', async ctx => {
    await ctx.answerCbQuery()
    ctx.scene.reenter()
})
//--------------------------------------------
selectPatient.action(/^patientSelect\d{1,4}$/, async ctx => {
    await ctx.answerCbQuery('Loading')
    const patient_id = parseInt(ctx.match[0].slice(13))
    ctx.session.doc_id = ctx.session.userId
    ctx.session.userId = patient_id
    ctx.session.patient_id = patient_id
    await outResults(ctx, 1)
    ctx.session.userId = ctx.session.doc_id
    await ctx.reply("Можно посмотреть другой период: ", queryPeriodMenuNaz())
})
//--------------------------------------------
selectPatient.action('queryDays', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.session.userId = ctx.session.patient_id
    await outResults(ctx, 3)
    ctx.session.userId = ctx.session.doc_id
    ctx.scene.reenter()
})
//--------------------------------------------
selectPatient.action('queryWeek', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.session.userId = ctx.session.patient_id
    await outResults(ctx, 7)
    ctx.session.userId = ctx.session.doc_id
    ctx.scene.reenter()
})
//--------------------------------------------
selectPatient.action('queryMonth', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.session.userId = ctx.session.patient_id
    await outResults(ctx, 30)
    ctx.session.userId = ctx.session.doc_id
    ctx.scene.reenter()
})
//--------------------------------------------
selectPatient.action('prescription', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.enter('PRESCRIPTION')
})
//--------------------------------------------
selectPatient.action('repeatK', ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.reenter()
})
//--------------------------------------------
selectPatient.on('message', async ctx => {
    ctx.reply('Выберите действие.')
})
//--------------------------------------------
// selectPatient.on('message', async ctx => {
//     const {id} = ctx.message.from
// })

export default selectPatient