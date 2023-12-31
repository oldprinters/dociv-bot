//fio_patient.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import UserData from "../controllers/userData.js"

const fio_patient = new Scenes.BaseScene('FIO_PATIENT')
//-----------------------------------
fio_patient.enter(async ctx => {
    let patient = new UserData(ctx)
    let fio = await patient.getFio()
    if(fio == undefined)
        ctx.reply('Введите Ваши фамилию, имя, отчество:')
    else
        ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
fio_patient.help(ctx => {
    ctx.replyWithHTML('Учитывая то, что программой ни кто не пользуется, можете набрать даже детское прозвище. :-)')
})
//--------------------------------------
fio_patient.on('message', async ctx => {
    let patient = new UserData(ctx)
    patient.setFio(ctx.message.text)
    ctx.scene.enter('FIRST_STEP')
})


export default fio_patient
