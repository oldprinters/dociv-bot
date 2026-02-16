/*
CREATE TABLE ivdoc_bot.user_values (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_category_id BIGINT NOT NULL,

  value DECIMAL(10,2),
  raw_value VARCHAR(32),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_category_id) REFERENCES user_category(id)
) ENGINE=InnoDB;
*/
import { call_q } from '../config/query.js'

export default class UserValueController {
  //------------------------------------------------------------------------
  async insert({ user_category_id, value = null, raw_value = null }) {
    const sql = `
      INSERT INTO user_values
        (user_category_id, value, raw_value)
      VALUES (?, ?, ?)
    `

    const res = await call_q(sql, [
      user_category_id,
      value,
      raw_value
    ], 'Insert user value')

    return res.insertId
  }
  //------------------------------------------------------------------------
  async getLast(user_category_id) {
    const sql = `
      SELECT *
      FROM user_values
      WHERE user_category_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `

    const [row] = await call_q(sql, [user_category_id], 'Get last value')
    return row || null
  }
  //------------------------------------------------------------------------
  async getPeriod(user_category_id, from, to) {
    const sql = `
      SELECT *
      FROM user_values
      WHERE user_category_id = ?
        AND created_at BETWEEN ? AND ?
      ORDER BY created_at ASC
    `

    return call_q(sql, [user_category_id, from, to], 'Get period values')
  }
  //------------------------------------------------------------------------
  async getAllForUser(user_id) {
    const sql = `
      SELECT
        uv.*,
        b.name AS category_name,
        uc.enabled_from,
        uc.enabled_until
      FROM user_values uv
      JOIN user_category uc ON uc.id = uv.user_category_id
      JOIN basename b ON b.id = uc.basename_id
      WHERE uc.user_id = ?
      ORDER BY uv.created_at ASC
    `

    return call_q(sql, [user_id], 'Get all user values')
  }
  //------------------------------------------------------------------------
  async getDays(user_category_id, days) {
    const sql = `
      SELECT *
      FROM user_values
      WHERE user_category_id = ?
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY created_at ASC
    `

    return call_q(sql, [user_category_id, days], 'Get values by days')
  }
  //------------------------------------------------------------------------
  async getLastN(user_category_id, limit) {
    const sql = `
      SELECT *
      FROM user_values
      WHERE user_category_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `

    const rows = await call_q(sql, [user_category_id, limit], 'Get last N values')

    return rows.reverse() // чтобы вывод шёл от старых к новым
  }

}
