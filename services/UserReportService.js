import { jsPDF } from 'jspdf'
import fs from 'fs/promises'
import {font} from '../fonts/times-normal.js'
import {font_m} from '../fonts/NotoMono-Regular-normal.js'
import { outDateTime } from '../utils.js'
import UserData from '../controllers/userData.js'


export default class UserReportService {
  //------------------------------------------------------------------------
  constructor(userCategoryController, userValueController) {
    this.uc = userCategoryController
    this.uv = userValueController
  }
  //----------------------------------------------------------------------
  formatRows(rows) {
    let out = ''
    let lastDate = null

    for (const r of rows) {
      const d = new Date(r.created_at)

      const date = d.toLocaleDateString('ru-RU')
      const time = d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })

      const value = r.value ?? r.raw_value

      if (date !== lastDate) {
        out += `${date} ${time}   ${value}\n`
        lastDate = date
      } else {
        out += `           ${time}   ${value}\n`
      }
    }

    return out
  }
  //----------------------------------------------------------------------
  async build(userId, { days = null, last = null }) {
    const categories = await this.uc.getActiveList(userId)

    if (!categories.length)
      return 'Нет активных категорий'

    // let result = '📊 *Ваши показатели:*\n\n'
    let result = []

    for (const cat of categories) {
      let rows

      if (last) {
        rows = await this.uv.getLastN(cat.id, last)
      } else {
        rows = await this.uv.getDays(cat.id, days)
      }

      if (!rows.length) continue

      // result += `<pre>${cat.name}:\n`
      // result += this.formatRows(rows)
      // result += '</pre>\n'
      result.push({
        name: cat.name,
        rows: this.formatRows(rows)
      })
    }

    return result
  }
  //------------------------------------------------------------------------
  formatDate(dt) {
    return new Date(dt).toLocaleDateString('ru-RU')
  }
  //-----------------------------------------------
  async outPdf(ctx, arr) {
    console.log('ctx =', ctx.session)
    ctx.session.userId = ctx.session.patient_id
    const ud = new UserData(ctx)
    const fName = `./prescriptions/list_${ctx.session.patient_id}.pdf`

    let ats = { 
        patient_id: ctx.session.patient_id,
    }
    ud.setUserId(ctx.session.patient_id)
    ats.patient_name = (await ud.readUserData())?.fio ?? null

    const tId = ctx.session.userId
    ctx.session.userId = ctx.session.patient_id
    let str = 'Результаты измерений за весь период\n\n'

     // const pressure = new Pressure(ctx)
    // let arr = await pressure.getStatistic(nDay, 'pressure')
    // if(arr.length > 0)
    //     str += await pressure.outArr(arr, 'Давление:\n\n')
    // else
    //     str += '\n\nДанные давления не вводились.\n\n'

    // const puls = new Puls(ctx)
    // arr = await puls.getStatistic(nDay, 'puls')
    // if(arr.length > 0)
    //     str += await puls.outArr(arr, '\n\nПульс:\n\n')
    // else
    //     str += '\n\nДанные пульса не вводились.\n\n'

    // const temper = new Temper(ctx)
    // arr = await temper.getStatistic(nDay, 'temper')
    // if(arr.length > 0)
    //     str += await temper.outArr(arr, '\n\nТемпература:\n\n')
    // else
    //     str += '\n\nДанные температуры не вводились.\n'
    ctx.session.userId = tId

    await this.saveToFile(ats, fName, arr)

    const file = await fs.readFile(fName)
    await ctx.sendDocument({ source: fName, filename: fName, caption: 'Сохраните Ваши данные измерений.' })

    return str
  }
  //-----------------------------------------------
  async saveToFile (ats, fName, arr) {
    const doc = new jsPDF()
    doc.addFileToVFS('times-normal.ttf', font);
    doc.addFont('times-normal.ttf', 'times', 'normal');
    doc.addFileToVFS('NotoMono-Regular-normal.ttf', font_m);
    doc.addFont('NotoMono-Regular-normal.ttf', 'NotoMono-Regular', 'normal');
    doc.setFont('times')
    doc.setFontSize(24)
    doc.text("Вывод сохраненных данных", 20, 15)
    doc.setFontSize(12)
    doc.text(outDateTime(new Date), 160, 15)
    doc.setFontSize(14)
    doc.text(`Пациент: ${ats.patient_name}`, 20, 25)
    doc.setFont('NotoMono-Regular')
    doc.setFontSize(11)

    let Y = 40 // Начальная Y-позиция после заголовков
    const pageHeight = 780 // Высота страницы с отступами
    const lineHeight = 12 // Высота строки для шрифта 11
    let nPage = 0

    for(const cat of arr) {
      // Печать заголовка категории
      if(nPage++){
          doc.addPage()
          Y = 20
      }
      doc.setFont('times')
      doc.setFontSize(14)
      doc.text(cat.name, 20, Y)
      doc.setFontSize(11)
      Y += 10 // Отступ после заголовка

      doc.setFont('NotoMono-Regular')
      doc.setFontSize(11)

      let lines = cat.rows.split('\n')
      while(lines.length > 0){
        let availableHeight = pageHeight - Y
        let availableLines = Math.floor(availableHeight / lineHeight)
        let chunkSize = Math.min(availableLines, 50 + 5 * (nPage > 1))
        if (chunkSize <= 0) {
          doc.addPage()
          Y = 20
          continue
        }
        let chunk = lines.splice(0, chunkSize)
        let text = chunk.join('\n')
        doc.text(text, 20, Y)
        Y += chunk.length * lineHeight + 5
      }

      Y += 10 // Дополнительный отступ между категориями
    }
    doc.save(fName)
  }
  //------------------------------------------------------------------------
}
