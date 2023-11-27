//selectPatient.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import VALUES from "../controllers/values.js"

const selectPatient = new Scenes.BaseScene('SELECT_PATIENT')
//--------------------------------------
selectPatient.enter(async ctx => {
    ctx.reply('Выберите пациента:')
})

selectPatient.on('message', async ctx => {
    const {id} = ctx.message.from
})

export default selectPatient