import {Telegraf, Markup, Scenes, session} from "telegraf"
import dotenv from 'dotenv'
import firstStep from './scenes/firstStep.js'
import selectRole from './scenes/selectRole.js'

import * as cron from 'node-cron'
// import { getNotesTime } from './utils.js'

dotenv.config()

const stage = new Scenes.Stage([firstStep, selectRole])

const bot = new Telegraf(process.env.KEY);
bot.use(session())
bot.use(stage.middleware())

bot.start(async ctx => {
    await ctx.replyWithHTML('Для понимания логики работы бота пользуйтесь подсказками\n<b>Меню -> Вызов справки</b> или /help.')
    await ctx.scene.enter('FIRST_STEP')
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
