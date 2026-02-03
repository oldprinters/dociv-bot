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
import { errors, messageOk } from './errors.js';


export default class UserCategoryController {
  constructor() {
  }

  /* =========================
     Получение данных
     ========================= */

  async getActiveCategories(userId) {
    const [rows] = await call_q(
      `SELECT *
       FROM user_category
       WHERE user_id = ${userId}
         AND enabled_from <= CURDATE()
         AND (enabled_until IS NULL OR enabled_until >= CURDATE())`,
      'Get active categories'
    );
    return rows;
  }

  async isCategoryActive(userId, basenameId) {
    const [[row]] = await call_q(
      `SELECT id
       FROM user_category
       WHERE user_id = ${userId}
         AND basename_id = ${basenameId}
         AND enabled_from <= CURDATE()
         AND (enabled_until IS NULL OR enabled_until >= CURDATE())
       LIMIT 1`,
      'Check if category is active'
    );
    return !!row;
  }

  async getLastCategoryChangeDate(userId) {
    const [[row]] = await call_q(
      `SELECT MAX(enabled_from) AS last_enabled
       FROM user_category
       WHERE user_id = ${userId}`,
      'Get last category change date'
    );
    return row?.last_enabled ?? null;
  }

  async getActiveCategoryCount(userId) {
    const [[row]] = await call_q(
      `SELECT COUNT(*) AS cnt
       FROM user_category
       WHERE user_id = ${userId}
         AND enabled_from <= CURDATE()
         AND (enabled_until IS NULL OR enabled_until >= CURDATE())`,
      'Get active category count'
    );
    return row.cnt;
  }

  /* =========================
     Проверки
     ========================= */

  canChangeCategory(lastEnabledDate) {
    if (!lastEnabledDate) return true;

    const last = new Date(lastEnabledDate);
    last.setMonth(last.getMonth() + 1);

    return new Date() >= last;
  }

  /* =========================
     Мутации
     ========================= */

  async enableCategory(userId, basenameId) {
    await call_q(
      `INSERT INTO user_category (user_id, basename_id)
       VALUES (${userId}, ${basenameId})`,
      'Enable category'
    );
  }

  async disableCategory(userId, basenameId) {
    await call_q(
      `UPDATE user_category
       SET enabled_until = CURDATE()
       WHERE user_id = ${userId}
         AND basename_id = ${basenameId}
         AND enabled_until IS NULL`,
      'Disable category'
    );
  }
}
