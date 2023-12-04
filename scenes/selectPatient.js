//selectPatient.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import VALUES from "../controllers/values.js"
import DocPatient from "../controllers/doc_patient.js"
import { queryRepeat } from '../keyboards/keyboards.js'

const selectPatient = new Scenes.BaseScene('SELECT_PATIENT')
//--------------------------------------
selectPatient.enter(async ctx => {
    const dp = new DocPatient(ctx)
    const list = await dp.getPatients()
    if(list.length > 0){
        ctx.reply('Выберите пациента:')
        console.log("list =", list)
    } else {
        ctx.reply('У Вас пока отсутствуют пациенты.', queryRepeat())
    }
})
//--------------------------------------------
selectPatient.action('repeatK', ctx => {
    ctx.scene.reenter()
})
//--------------------------------------------
selectPatient.on('message', async ctx => {
    const {id} = ctx.message.from
})

export default selectPatient