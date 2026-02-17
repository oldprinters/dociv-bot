export default class UserCategoryService {

  constructor(userCategoryController) {
    this.uc = userCategoryController
  }
  //----------------------------------------------------------------------
  async list(userId) {
    return this.uc.getActiveList(userId)
  }
  //----------------------------------------------------------------------
  async disableByIndex(userId, index) {
    const list = await this.list(userId)

    if (!list.length)
      return { ok: false, message: 'Активных категорий нет' }

    if (index < 1 || index > list.length)
      return { ok: false, message: 'Неверный номер категории' }

    const cat = list[index - 1]

    await this.uc.disable(cat.id)

    return {
      ok: true,
      message: `Категория "${cat.name}" отключена`
    }
  }

}
