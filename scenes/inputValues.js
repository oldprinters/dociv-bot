//inputValues.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
//import Users from '../controllers/users.js'
import Health from "../controllers/health.js";
import Puls from "../controllers/puls.js"
import Pressure from "../controllers/pressure.js"
import {outDateTime, outDate, outTimeDate, getRazdel} from "../utils.js"
import {queryPeriodMenu, queryDeleteMenu, querySetupMenu} from "../keyboards/keyboards.js"
import Temper from "../controllers/temper.js"
import { errors, messageOk } from '../controllers/errors.js';

const inputValues = new Scenes.BaseScene('INPUT_VALUES')
//--------------------------------------
inputValues.enter(async ctx => {
    await ctx.reply("Введите результаты измерений:")
})
//--------------------------------------
inputValues.start(ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
inputValues.help( ctx => {
    ctx.replyWithHTML("<i>Для того, что бы бот понимал смысл введенных данных, следует придерживаться следующих правил:</i>\n\n"
    +"<b>Давление</b> - два целых числа разделенных пробелом, звездочкой или наклонной чертой;\n\n"
    +"<b>Пульс</b> - целое число, может вводиться после давления (разделитель тот же) или отдельно;\n\n"
    +"<b>Температура</b> - дробное число, разделителем может быть точка или запятая.\n"
    )
})
//--------------------------------------
inputValues.hears(/^\d{2,3}[\/\\ -\*]\d{2,3}$/, async ctx => {
    await ctx.reply("Вы ввели давление: " + ctx.match[0])
    const pressure = new Pressure(ctx)
    const message = await pressure.setValue(ctx, ctx.match[0])
    await ctx.reply(message)
    const arr = await pressure.getStatistic(1, 'pressure')
    await pressure.outStr(ctx, arr)
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.hears(/^\d{2,3}[\/\\ -\*]\d{2,3}[\/\\ -\*]\d{2,3}$/, async ctx => {
    await ctx.reply("Вы ввели давление и пульс: " + ctx.match[0])
    let str = ctx.match[0].replaceAll(getRazdel(), '/')
    const pressure = new Pressure(ctx)
    // console.log("str =", str)
    // console.log("**** ", str.slice(str.lastIndexOf('/') + 1))
    let message = await pressure.setValue(ctx, str.slice(0, str.lastIndexOf('/')))
    await ctx.reply(message)
    let arr = await pressure.getStatistic(1, 'pressure')
    await pressure.outStr(ctx, arr)
    const puls = new Puls(ctx);
    message = await puls.setValue(ctx, str.slice(str.lastIndexOf('/') + 1))
    await ctx.reply(message)
    arr = await puls.getStatistic(1, 'puls')
    await puls.outStr(ctx, arr)
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.hears(/^\d{2,3}$/, async ctx => {
    await ctx.reply("Вы ввели пульс: " + ctx.match[0])
    const puls = new Puls(ctx);
    let message = await puls.setValue(ctx, ctx.match[0])
    await ctx.reply(message)
    let arr = await puls.getStatistic(1, 'puls')
    await puls.outStr(ctx, arr)
    ctx.scene.reenter()
})
//---------------------------------------
inputValues.hears(/^[*]+$/, async ctx => {
    const val = ctx.match[0]? ctx.match[0].length : 0;
    const health = new Health(ctx);
    const lastDate = await health.getLastDate()
    let d = new Date(lastDate.date)
    const dN = new Date()
    const dT = (dN - d)/3600000 //период в часах
    if(((dT > 2) && (val != lastDate.val)) || (dT > 5)){
        let text = `Вы ввели показатель общего состояния: ${val} `
        if (val == 1) {
            text += '\n...Вам так плохо... '
            const aver = await health.getAverage();
            const count = await health.getCount();
            if(count > 2) {
                if(aver > 2.50) 
                    text += `\nСкоро будет улучшение. Это временно, желаю Вам благополучия! `
                else
                    text += `Наберитесь терпения. Все плохое заканчивается. Не теряйте надежду. `
            }
        }
        if(val > 5){
            text += '\n<b>Ура!!!</b>    :-)    я счастлив вместе с Вами!!!'
        }
        await ctx.replyWithHTML(text)
        try {
            await health.setValue(ctx, val)
        } catch (e) {
            console.log(`Ввод состояния пациента. Ошибка: ${e.message}`)
        }
        setTimeout(() => {
            ctx.scene.reenter();
        }, val == 1? 1500: 10);
    } else {
        await ctx.reply("Вы ввели показатель общего состояния.")
        setTimeout(() => {
            ctx.scene.reenter();
        }, 15000);
    }
})
//--------------------------------------
inputValues.hears(/^\d{2}[.,]\d{0,2}$/, async ctx => {
    await ctx.reply("Вы ввели температуру: " + ctx.match[0])
    const temper = new Temper(ctx)
    const message = await temper.setValue(ctx, ctx.match[0])
    await ctx.reply(message)
    const arr = await temper.getStatistic(1, 'temper')
    await temper.outStr(ctx, arr)
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.hears('list', async ctx => {
    ctx.reply("Выберите период", queryPeriodMenu())
    ctx.scene.reenter()
})
//-------------------------------------- 
inputValues.command('setup', async ctx => {
    ctx.scene.enter('SETUP_PATIENT')
})
//-------------------------------------- 
inputValues.command('list', async ctx => {
    ctx.reply("Выберите период", queryPeriodMenu())
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.hears(/^del$/i, async ctx => {
        await ctx.reply("Какую последнюю запись удалить?", queryDeleteMenu())
    // else {
    //     await ctx.reply("Нет записей для удаления.")
    //     ctx.scene.reenter()
    // }
})
//--------------------------------------
inputValues.action('queryDays', async ctx => {
    await ctx.answerCbQuery('Loading')
    const pressure = new Pressure(ctx)
    let arr = await pressure.getStatistic(3, 'pressure')
    await pressure.outStr(ctx, arr)
    const puls = new Puls(ctx)
    arr = await puls.getStatistic(3, 'puls')
    await puls.outStr(ctx, arr)
    const temper = new Temper(ctx)
    arr = await temper.getStatistic(3, 'temper')
    await temper.outStr(ctx, arr)
    const health = new Health(ctx)
    arr = await health.getStatistic(3, 'health')
    await health.outStr(ctx, arr)
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.action('queryWeek', async ctx => {
    await ctx.answerCbQuery('Loading')
    const pressure = new Pressure(ctx)
    let arr = await pressure.getStatistic(7, 'pressure')
    await pressure.outStr(ctx, arr)
    const puls = new Puls(ctx)
    arr = await puls.getStatistic(7, 'puls')
    await puls.outStr(ctx, arr)
    const temper = new Temper(ctx)
    arr = await temper.getStatistic(7, 'temper')
    await temper.outStr(ctx, arr)
    const health = new Health(ctx)
    arr = await health.getStatistic(7, 'health')
    await health.outStr(ctx, arr)
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.action('queryMonth', async ctx => {
    await ctx.answerCbQuery('Loading')
    const pressure = new Pressure(ctx)
    let arr = await pressure.getStatistic(30, 'pressure')
    await pressure.outStr(ctx, arr)
    const puls = new Puls(ctx)
    arr = await puls.getStatistic(30, 'puls')
    await puls.outStr(ctx, arr)
    const temper = new Temper(ctx)
    arr = await temper.getStatistic(30, 'temper')
    await temper.outStr(ctx, arr)
    const health = new Health(ctx)
    arr = await health.getStatistic(30, 'health')
    await health.outStr(ctx, arr)
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.action('queryPress', async ctx => {
    await ctx.answerCbQuery('Loading')
    if(ctx.session.press_last_id > 0){
        const pressure = new Pressure(ctx)
        pressure.delete(ctx.session.press_last_id, 'pressure')
        ctx.session.press_last_id = 0
        const arr = await pressure.getStatistic(1, 'pressure')
        await pressure.outStr(ctx, arr)
    } else {
        await ctx.reply(errors[5])
    }
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.action('queryPuls', async ctx => {
    await ctx.answerCbQuery('Loading')
    if(ctx.session.puls_last_id > 0){
        const puls = new Puls(ctx)
        await puls.delete(ctx.session.puls_last_id, 'puls')
        ctx.session.puls_last_id = 0
        const arr = await puls.getStatistic(1, 'puls')
        await puls.outStr(ctx, arr)
    } else {
        await ctx.reply(errors[5])
    }
    ctx.scene.reenter()

})
//--------------------------------------
inputValues.action('queryTemper', async ctx => {
    await ctx.answerCbQuery('Loading')
    if(ctx.session.temper_last_id > 0){
        const temper = new Temper(ctx)
        temper.delete(ctx.session.temper_last_id, 'temper')
        ctx.session.temper_last_id = 0
        const arr = await temper.getStatistic(1, 'temper')
        await temper.outStr(ctx, arr)
    } else {
        await ctx.reply(errors[5])
    }
    ctx.scene.reenter()
})
//--------------------------------------
inputValues.on('text', async ctx => {
    await ctx.replyWithHTML("<i>Для того, что бы бот понимал смысл введенных данных, следует придерживаться следующих правил:</i>\n\n"
        +"<b>Давление</b> - два целых числа разделенных пробелом, звездочкой или наклонной чертой;\n\n"
        +"<b>Пульс</b> - целое число, может вводиться после давления (разделитель тот же) или отдельно;\n\n"
        +"<b>Температура</b> - дробное число, разделителем может быть точка или запятая.\n\n120*78*65\n120 78\n120/78/65\nКак-то так. "
        )
    ctx.scene.reenter()
})

export default inputValues