//setupPatient.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import UserData from "../controllers/userData.js"
import DocPatient from "../controllers/doc_patient.js"
import { queryYesNoMenu, querySetupMenu, queryDocSelect} from '../keyboards/keyboards.js'

const setupPatient = new Scenes.BaseScene('SETUP_PATIENT')
//--------------------------------------
setupPatient.start( ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
setupPatient.enter(async ctx => {
    const dp = new DocPatient(ctx)
    const ud = new UserData(ctx)
    const fio = await ud.getFio()
    const docs = await dp.getDocs()
    if(docs.length > 0){
        let str = 'C Вами ' + (docs.length == 1? 'работает доктор ': 'работают:\n') + '<b>'
        for(let doc of docs){
            str += doc.fio + '\n' 
        }
        str += '</b>'
        ctx.replyWithHTML(str)
    }
    ctx.session.fio = fio
    ctx.session.docs = docs
    const strFio = fio == undefined? 'Что настраиваем?': fio + ', что настраиваем?'
    ctx.reply( strFio, querySetupMenu())
})
//--------------------------------------
setupPatient.help( ctx => {
    ctx.reply('Советую выбрать знакомого доктора, если он зарегистрирован.')
})
//--------------------------------------
setupPatient.action('appendDoc', async ctx => {
    await ctx.answerCbQuery('Loading')
    const user = new Users(ctx.session.userId)
    const list = await user.getListByRole();
    const diff = list.filter(el => {!ctx.session.docs.some(el2 => el2.doc_id === el.user_id)})
    console.log("list =", list)
    console.log("diff =", diff)
    if(diff.length > 0){
        let str = ''
        str = 'C Вами ' + (list.length == 1? 'работает доктор ': 'работают:\n') + '<b>'
        for(let doc of diff){
            str += doc.fio + '\n' 
        }
        str += (diff.length == list.length? '</b>Других докторов не зарегистрировано.': '')
        await ctx.replyWithHTML(str)
        if(diff.length == list.length){
            ctx.scene.enter('INPUT_VALUES')
        }
    } 
    if(list.length == 1){
        ctx.reply("В системе зарегистрирован один доктор. Если Ваш, кликайте смело.", queryDocSelect(list))
    } else if(list.length < 10){
        ctx.reply("В системе есть несколько зарегистрированных докторов. Выберите Вашего.", queryDocSelect(list))
    } else {
        ctx.reply("В системе много зарегистрированных докторов. Введите фамилию желаемого врача:")
    }
})
//--------------------------------------
setupPatient.action(/^docSelect\d{1,4}$/, async ctx => {
    await ctx.answerCbQuery('Loading')
    const doc_id = parseInt(ctx.match[0].slice(9))
    ctx.session.doc_id = doc_id
    const dp = new DocPatient(ctx)
    let arrDocs = await dp.getDocs()
    const ids = arrDocs.map(el => el.doc_id)
    if(arrDocs.length == 0 || ids.includes(doc_id) === false){
        if(await dp.appendDoc(doc_id) > 0)
            await ctx.reply("Доктор успешно привязан к пациенту.")
        else
            await ctx.reply("Доктор не привязан к пациенту.")
    }
    ctx.scene.enter('FIO_PATIENT')
})
//--------------------------------------
setupPatient.action('remembers', async ctx => {
    await ctx.answerCbQuery('')
    ctx.reply('Напоминалки пока не работают. Сделаю, если кому-нибудь будут нужны.')
    ctx.scene.reenter()
})
//--------------------------------------
setupPatient.on('text', ctx => {
    console.log("ctx =", ctx.message.text)
})

export default setupPatient