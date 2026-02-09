export default class UserInputService {

  constructor({ basenameController, userCategoryController, userValueController, userController }) {
    this.basename = basenameController
    this.userCategory = userCategoryController
    this.userValue = userValueController
    this.user = userController
  }

  // Главная точка входа
  async process(userId, text) {
    const parsed = this.parse(text)

    if (!parsed)
      return { ok: false, message: 'Не понял формат. Пример: вес 82.5' }

    const { key, value } = parsed

    const basename = await this.basename.search(key)
    if (!basename)
      return { ok: false, message: `Параметр "${key}" не найден` }

    const canUse = await this.checkUserCategory(userId, basename.id)
    if (!canUse.ok) return canUse

    await this.userValue.insert({
      user_id: userId,
      basename_id: basename.id,
      value
    })

    return {
      ok: true,
      message: `${basename.name}: ${value} сохранено`
    }
  }

  // --------------------
  // Парсинг ввода
  // --------------------
  parse(text) {
    text = text.trim().replace(',', '.')

    const m = text.match(/^([\p{L}\w]+)\s+([-+]?\d+(?:\.\d+)?)$/iu)
    if (!m) return null

    return {
      key: m[1].toLowerCase(),
      value: parseFloat(m[2])
    }
  }

  // --------------------
  // Проверка доступности категории
  // --------------------
  async checkUserCategory(userId, basenameId) {
    const isActive = await this.userCategory.isCategoryActive(userId, basenameId)
    if (isActive) return { ok: true }

    const user = await this.user.getUser(userId)

    if (user.tariff > 0) {
      await this.userCategory.enable(userId, basenameId)
      return { ok: true }
    }

    const activeCount = await this.userCategory.countActive(userId)

    if (activeCount >= user.category_limit) {
      return {
        ok: false,
        message: `Лимит ${user.category_limit} категорий. Можно сменить не чаще 1 раза в месяц.`
      }
    }

    const canChange = await this.userCategory.canChangeCategory(userId)
    if (!canChange) {
      return {
        ok: false,
        message: 'Менять категории можно не чаще 1 раза в месяц'
      }
    }

    await this.userCategory.enable(userId, basenameId)
    return { ok: true }
  }

}
