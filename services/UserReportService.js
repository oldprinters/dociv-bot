export default class UserReportService {

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

}
