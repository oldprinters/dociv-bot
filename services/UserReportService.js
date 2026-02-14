export default class UserReportService {

  constructor(userCategoryController, userValueController) {
    this.uc = userCategoryController
    this.uv = userValueController
  }

  async build(userId, { days = null, last = null }) {
    const categories = await this.uc.getActiveList(userId)

    if (!categories.length)
      return 'Нет активных категорий'

    let result = '📊 Ваши показатели:\n\n'

    for (const cat of categories) {
      let rows

      if (last) {
        rows = await this.uv.getLastN(cat.id, last)
      } else {
        rows = await this.uv.getDays(cat.id, days)
      }

      if (!rows.length) continue

      result += `*${cat.name}:*\n`

      for (const r of rows) {
        result += `${this.formatDate(r.created_at)} — ${r.value ?? r.raw_value}\n`
      }

      result += '\n'
    }

    return result || 'Нет данных за выбранный период'
  }

  formatDate(dt) {
    return new Date(dt).toLocaleDateString('ru-RU')
  }

}
