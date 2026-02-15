export default class UserInputService {

  constructor({
    basenameService,
    userCategoryController,
    userValueController,
    userController,
    userDataController
  }) {
    this.basename = basenameService
    this.userCategory = userCategoryController
    this.userValue = userValueController
    this.user = userController
    this.userData = userDataController
  }

  // ========================
  // Главная точка входа
  // ========================
  async process(userId, text) {
    const parsed = this.parse(text)

    if (!parsed)
      return { ok: false, message: '' }

    const { key, value, raw } = parsed

    let basename = { id: 0, name: key }

    basename.id = await this.basename.findByPrefix(key) //поиск категории по префиксу

    if (!basename.id) {
      const allow = await this.canCreateCategory(userId)  //проверка возможности создать новую категорию
      if (!allow.ok) return allow

      const id = await this.basename.create(key)  //создание новой категории
      basename = { id, name: key }
    }

    const catResult = await this.ensureCategory(userId, basename.id)
    if (!catResult.ok) return catResult

    await this.userValue.insert({
      user_category_id: catResult.user_category_id,
      value,
      raw_value: raw
    })

    return {
      ok: true,
      message: `${basename.name}: ${value} сохранено`
    }
  }

  // ========================
  // Парсер пользовательского ввода
  // ========================
  parse(text) {
    text = text.trim().replace(',', '.')

    const m = text.match(/^([\p{L}\w]+)\s+(.+)$/iu)
    if (!m) return null

    const key = m[1].toLowerCase()
    const raw = m[2].trim()

    const value = parseFloat(raw)
    return {
      key,
      raw,
      value: Number.isFinite(value) ? value : null
    }
  }

  // ========================
  // Проверка возможности создать новую категорию
  // ========================
  async canCreateCategory(userId) {
    const user = await this.user.getUser(userId)

    if (user.tariff > 0) return { ok: true }

    const activeCount = await this.userCategory.getActiveCategoryCount(userId)

    if (activeCount >= user.category_limit) {
      return {
        ok: false,
        message: `Доступно ${user.category_limit} категорий. Чтобы добавить новую, отключите одну из старых.`
      }
    }

    const canChange = await this.userCategory.canChangeCategory(userId)

    if (!canChange) {
      return {
        ok: false,
        message: 'Менять категории можно не чаще одного раза в месяц.'
      }
    }

    return { ok: true }
  }

  // ========================
  // Активация категории
  // ========================
  async ensureCategory(userId, basenameId) {
    // Проверяем, есть ли уже активная категория для данного базового имени
    const active = await this.userCategory.isCategoryActive(userId, basenameId)

    if (active) return { ok: true, user_category_id: active.id }

    const allow = await this.canCreateCategory(userId)
    if (!allow.ok) return allow

    const id = await this.userCategory.enableCategory(userId, basenameId)

    return { ok: true, user_category_id: id }
  }

}
