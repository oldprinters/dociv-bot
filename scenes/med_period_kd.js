//MED_PERIOD_KD
import {Telegraf, Markup, Scenes, session} from "telegraf"
import {queryMedicamentSelectMenu, queryYesNoMenu} from "../keyboards/keyboards.js"

const med_period_kd = new Scenes.BaseScene('MED_PERIOD_KD')
//--------------------------------------
med_period_kd.start(async ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
med_period_kd.help(ctx => {
    ctx.reply('Необходимо определить периодичность приема препарата. На какой по счету день нужно принимать препарат?')
})
//--------------------------------------
med_period_kd.enter(async ctx => {
    ctx.replyWithHTML('Введите на какой по счету день нужно принимать препарат в следующий раз? <i>(2 - через день)</i>')
})
//--------------------------------------
med_period_kd.hears(/^\d{1,2}$/gm, async ctx => {
    ctx.session.pr.setKD(ctx.match[0])
    ctx.scene.enter('INP_NOTE')
})
//--------------------------------------
med_period_kd.on('text', async ctx => {
    await ctx.reply('Введите число.')
})

export default med_period_kd