//med_period.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import {queryYesNoMenu1, queryYesNoMenu} from "../keyboards/keyboards.js"

const med_period = new Scenes.BaseScene('MED_PERIOD')
//--------------------------------------
med_period.start(async ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
med_period.help(ctx => {
    ctx.reply('Необходимо определить частоту приема препарата. Каждый ли день, с каким периодом, сколько раз в день.')
})
//--------------------------------------
med_period.enter(async ctx => {
    const list = await ctx.session.pr.list()
    const resSome = list.some(el => el.med_id == ctx.session.pr.med_id)
    if(!resSome)
        ctx.reply('Каждый день нужно принимать препарат?', queryYesNoMenu())
    else {
        ctx.reply('Данный препарат находится в списке назначений. Удалить перед новой записью?', queryYesNoMenu1())
    }
})
//---------------------------------------
med_period.action('queryYes1', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.enter('DELETE_MED')
})
//---------------------------------------
med_period.action('queryYes2', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.reply('Сколько раз в день нужно принимать? Введите число:')
})
//---------------------------------------
med_period.hears(/^\d$/gm, async ctx => {
    ctx.session.pr.setKRD(ctx.match[0])
    ctx.scene.enter('INP_NOTE')
    //подтвердить и записать
})
//---------------------------------------
med_period.action('queryNo1', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.enter('PRESCRIPTION')
})
//---------------------------------------
med_period.action('queryNo2', async ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.enter('MED_PERIOD_KD')
})
//--------------------------------------
med_period.on('text', async ctx => {
    await ctx.reply('Введите однозначное число.')
})
//--------------------------------------

export default med_period