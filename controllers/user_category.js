/*
CREATE TABLE ivdoc_bot.user_category (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  basename_id INT UNSIGNED NOT NULL,

  enabled_from DATE NOT NULL DEFAULT CURRENT_DATE,
  enabled_until DATE DEFAULT NULL,   -- NULL = активна

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_user_category_active (user_id, basename_id, enabled_from),
  FOREIGN KEY (basename_id) REFERENCES basename(id)
) ENGINE=InnoDB;
*/

import { call_q } from '../config/query.js'
// import { errors, messageOk } from './errors.js';


export default class UserCategoryController {

  constructor() {
  }

  /* =========================
     Получение данных
     ========================= */
  //-----------------------------------------------------------------
  async getActiveList(userId) {
    const sql = `
      SELECT
        uc.id,
        b.name,
        uc.enabled_from
      FROM user_category uc
      JOIN basename b ON b.id = uc.basename_id
      WHERE uc.user_id = ?
        AND (uc.enabled_until IS NULL OR uc.enabled_until >= CURDATE())
      ORDER BY uc.enabled_from ASC
    `
    return call_q(sql, [userId], 'Get active categories')
  }
  //-----------------------------------------------------------------
  async disable(userCategoryId) {
    const sql = `
      UPDATE user_category
      SET enabled_until = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      WHERE id = ?
        AND (enabled_until IS NULL OR enabled_until >= CURDATE())
    `

    return call_q(sql, [userCategoryId], 'Disable category')
  }
  //-----------------------------------------------------------------
  // Получить все активные категории пользователя
  async getActiveCategories(userId) {
    const rows = await call_q(
      `SELECT *
       FROM user_category
       WHERE user_id = ?
         AND enabled_from <= CURDATE()
         AND (enabled_until IS NULL OR enabled_until >= CURDATE())`,
      [userId],
      'Get active categories'
    );
    return rows;
  }
//-----------------------------------------------------------------
// Проверить, активна ли конкретная категория для пользователя по basename_id
  async isCategoryActive(userId, basenameId) {
    const rows = await call_q(
      `SELECT id
       FROM user_category
       WHERE user_id = ?
         AND basename_id = ?
         AND enabled_from <= CURDATE()
         AND (enabled_until IS NULL OR enabled_until >= CURDATE())
       LIMIT 1`,
      [userId, basenameId],
      'Check if category is active'
    );
    const row = rows[0];
    return row;
  }
//-----------------------------------------------------------------
// Получить дату последнего изменения категории (включения/отключения) для пользователя
  async getLastCategoryChangeDate(userId) {
    const rows = await call_q(
      `SELECT MAX(enabled_from) AS last_enabled
       FROM user_category
       WHERE user_id = ?`, 
      [userId],
      'Get last category change date'
    );
    const row = rows[0];
    return row?.last_enabled ?? null;
  }
//-----------------------------------------------------------------
// Получить количество активных категорий для пользователя
  async getActiveCategoryCount(userId) {
    const rows = await call_q(
      `SELECT COUNT(*) AS cnt
       FROM user_category
       WHERE user_id = ?
         AND enabled_from <= CURDATE()
         AND (enabled_until IS NULL OR enabled_until >= CURDATE())`,
      [userId],
      'Get active category count'
    );
    const row = rows[0];
    return row?.cnt ?? 0;
  }

  /* =========================
     Проверки
     ========================= */
// Проверить, можно ли включить категорию (не чаще 1 раза в месяц)
  canChangeCategory(lastEnabledDate) {
    if (!lastEnabledDate) return true;

    const last = new Date(lastEnabledDate);
    last.setMonth(last.getMonth() + 1);

    return new Date() >= last;
  }

  /* =========================
     Мутации
     ========================= */
// Добавить категорию для пользователя
  async enableCategory(userId, basenameId) {
    const res = await call_q(
      `INSERT INTO user_category (user_id, basename_id)
       VALUES (?, ?)`,
      [userId, basenameId],
      'Enable category'
    );
    return res.insertId;
  }
// Отключить категорию для пользователя (установить enabled_until)
  async disableCategory(userId, basenameId) {
    await call_q(
      `UPDATE user_category
       SET enabled_until = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
       WHERE user_id = ?
         AND basename_id = ?
         AND enabled_until IS NULL`,
      [userId, basenameId],
      'Disable category'
    );
  }
}
