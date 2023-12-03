import {Telegraf, Markup, Scenes, session} from "telegraf"
import dotenv from 'dotenv'
import firstStep from './scenes/firstStep.js'
import selectRole from './scenes/selectRole.js'
import inputValues from './scenes/inputValues.js'
import selectPatient from './scenes/selectPatient.js'
import setupPatient from './scenes/setupPatient.js'
import fio_patient from "./scenes/fio_patient.js"

import * as cron from 'node-cron'
import Users from "./controllers/users.js"
// import { getNotesTime } from './utils.js'

dotenv.config()

const stage = new Scenes.Stage([firstStep, inputValues, selectPatient, selectRole, setupPatient, fio_patient])

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
