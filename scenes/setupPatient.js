//setupPatient.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import Users from '../controllers/users.js'
import UserData from "../controllers/userData.js"
import DocPatient from "../controllers/doc_patient.js"
import { queryYesNoMenu, querySetupMenu, queryDocSelect} from '../keyboards/keyboards.js'

const setupPatient = new Scenes.BaseScene('SETUP_PATIENT')
//--------------------------------------
setupPatient.enter(async ctx => {
    ctx.reply("Что настраиваем?", querySetupMenu())
})
//--------------------------------------
setupPatient.action('appendDoc', async ctx => {
    await ctx.answerCbQuery('Loading')
    const user = new Users(ctx.session.userId)
    const list = await user.getListByRole();
    console.log("list =", list)
    if(list.length == 0){
        ctx.reply("В системе нет зарегистрированных докторов.")
    } else if(list.length < 10){
        ctx.reply("В системе есть несколько зарегистрированных докторов. Выбирите.", queryDocSelect(list))
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
    console.log(doc_id, ids)
    console.log(ids.includes(doc_id))
    if(arrDocs.length == 0 || ids.includes(doc_id) === false){
        console.log("arrDoc = ", arrDocs)
        if(await dp.appendDoc(doc_id) > 0)
            await ctx.reply("Доктор успешно привязан к пациенту.")
        else
            await ctx.reply("Доктор не привязан к пациенту.")
    }
    ctx.scene.enter('FIO_PATIENT')
})
//--------------------------------------
setupPatient.on('text', ctx => {
    console.log("ctx =", ctx.message.text)
})

export default setupPatient