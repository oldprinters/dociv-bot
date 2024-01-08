import {Telegraf, Markup, Scenes, session} from "telegraf"
import dotenv from 'dotenv'
import firstStep from './scenes/firstStep.js'
import selectRole from './scenes/selectRole.js'
import inputValues from './scenes/inputValues.js'
import selectPatient from './scenes/selectPatient.js'
import setupPatient from './scenes/setupPatient.js'
import fio_patient from "./scenes/fio_patient.js"
import prescription from "./scenes/prescription.js"
import med_period from "./scenes/med_period.js"
import med_period_kd from "./scenes/med_period_kd.js"
import delete_med from './scenes/delete_med.js'
import inp_note from './scenes/inp_note.js'
import append_med from "./scenes/append_med.js"

import * as cron from 'node-cron'
import Users from "./controllers/users.js"
// import { getNotesTime } from './utils.js'

dotenv.config()

const stage = new Scenes.Stage([firstStep, inputValues, selectPatient, selectRole, setupPatient, 
    fio_patient, prescription, med_period, med_period_kd, delete_med, inp_note, append_med])

const bot = new Telegraf(process.env.KEY);
bot.use(session())
bot.use(stage.middleware())

bot.start(async ctx => {
    await ctx.replyWithHTML('Для понимания логики работы бота пользуйтесь подсказками\n<b>Меню -> Вызов справки</b> или /help.')

    if(typeof ctx === 'object' && !Array.isArray(ctx) !== null){
            ctx.session.tlg_user_id = ctx.from.id
            if(ctx.message?.chat.id != undefined)
                ctx.session.chat_id = ctx.message.chat.id
            else
                tx.session.chat_id = ctx.chat.id
    }
    const user = new Users(ctx.from.id)
    // await user.init()
    let us = await user.readUserTlg()
    if(us == undefined){
        ctx.scene.enter('SELECT_ROLE')
    } else {
        ctx.session.role = user.getRole()
        ctx.session.userId = user.getUserId()
        if(user.getRole() == "patient"){
            ctx.session.patient_id = user.getUserId()
            ctx.scene.enter('INPUT_VALUES')
        } else {
            ctx.scene.enter('SELECT_PATIENT')
        }
    }
    // await ctx.scene.enter('FIRST_STEP')
});

bot.on('text', async (ctx) => {
    await ctx.replyWithHTML(`<b>Перезапустите бот нажав /start</b>`);
});

// cron.schedule('* * * * *', () => {getNotesTime()});

bot.launch()
    .then(res => {
        console.log('Started')
    }).catch ( err => {
        console.log('Error', err)
    })
