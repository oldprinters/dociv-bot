//prescription.js
import {Telegraf, Markup, Scenes, session} from "telegraf"
import { jsPDF } from "jspdf"
import * as fs from 'fs/promises'
import axios from 'axios'
import {font} from '../fonts/times-normal.js'
import Prescription from "../controllers/prescription.js"
import { appendMedMenu, queryRepeat, queryPatientSelect, queryPeriodMenu, queryPeriodMenuNaz} from '../keyboards/keyboards.js'
import UserData from "../controllers/userData.js"
import { raz, outDateTime, getTlgIdById } from "../utils.js";

const prescription = new Scenes.BaseScene('PRESCRIPTION')
//--------------------------------------
prescription.start(async ctx => {
    ctx.scene.enter('FIRST_STEP')
})
//--------------------------------------
prescription.help(ctx => {
    ctx.reply('При необходимости измените курс лечения.')
})
//--------------------------------------
prescription.enter(async ctx => {
    if(ctx.session.pr == undefined){
        ctx.session.pr = new Prescription(ctx.session.patient_id, ctx.session.doc_id)
    } else {
        ctx.session.pr.clear()
    }
    const listMed = await ctx.session.pr.list()
    let str = ''
    if(listMed.length > 0){
        for (let el of listMed){
            str += el.medName + ` <i>(${el.docFio})</i>` + '\n'
        }
    } else {
        str = 'Лечение не назначено.'
    }
    await ctx.replyWithHTML(str, appendMedMenu())
})
//--------------------------------------------
prescription.action('saveToPDFMed', async ctx => {
    ctx.answerCbQuery('Loading')
    const ud = new UserData(ctx)
    let ats = { patient_id: ctx.session.patient_id,
        doc_name: await ud.getFio(),
         doc_id: ctx.session.doc_id 
        }
    ud.setUserId(ctx.session.patient_id)
    ats.patient_name = await ud.readUserData()
    const pr = new Prescription(ctx.session.patient_id, ctx.session.doc_id)
    const list = await pr.list()
    const doc = new jsPDF()
    doc.addFileToVFS('times-normal.ttf', font);
    doc.addFont('times-normal.ttf', 'times', 'normal');
    doc.setFont('times')
    doc.setFontSize(24)
    doc.text("Рекомендации", 20, 15)
    doc.setFontSize(12)
    doc.text(outDateTime(new Date), 160, 15)
    doc.setFontSize(14)
    doc.text(`Пациент: ${ats.patient_name}`, 20, 25)
    doc.text(`Доктор: ${ats.doc_name}`, 20, 30)
    let y = 40
    for (let el of list){
        doc.line(20, y - 5, 190, y -5)
        doc.setFontSize(12)
        doc.text(`Препарат: ${el.medName}`, 20, y)
        doc.setFontSize(10)
        const kd = el.kd == 1? 'каждый': `на ${el.kd}`
        doc.text(`\nПринимать ${kd} день\n${el.krd} ${raz(el.krd)} в день${el.note.length == 0? '': ', ' + el.note}.\n`, 20, y)
        y += 18
    }
    const fName = `./prescriptions/pr_${ctx.session.patient_id}.pdf`
    doc.save(fName)
    const file = await fs.readFile(fName)

    const resBot = await ctx.sendDocument({ source: fName, filename: `pr_${ctx.session.patient_id}.pdf`, caption: 'Сохраните Ваши рекомендации.' })
    const file_id = resBot.document.file_id

    const chat_id = await getTlgIdById(ctx.session.patient_id)
    const url = `https://api.telegram.org/bot${process.env.KEY}/sendDocument`
    const resSend = await axios.post(url, {
        'chat_id': chat_id, 
        'document': file_id,
        'caption': 'Сохраните рекомендации доктора',
    })
})
//--------------------------------------------
prescription.action('appendMed', ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.enter('APPEND_MED')
})
//--------------------------------------------
prescription.action('deleteMed', ctx => {
    ctx.answerCbQuery('Loading')
    ctx.scene.enter('DELETE_MED')
})

export default prescription