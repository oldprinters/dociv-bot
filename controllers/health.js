//health.js
/*
CREATE TABLE `health` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `val` smallint(1) NOT NULL,
  `dataTime` datetime DEFAULT current_timestamp(),
  `active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci
*/
import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";

class Health extends VALUES {
    #value;
    constructor(ctx) {
        super(ctx);
    }
    //-----------------------
    get value() {
        return this.#value;
    }
    //-----------------------
    async setValue(ctx, str) {
        this.#value = parseInt(str);
        if( this.#value > 5 ){
            this.#value = 5;
        }
        try {
            const res = await this.saveValue()
            ctx.session.puls_last_id = res.insertId
            return messageOk[0];
        } catch(e) {
            return errors[2];
        }
    }
    //-----------------------------
    async getLastDate(){
        const sql = `SELECT dataTime date, val FROM ivdoc_bot.health WHERE user_id = ${super.user_id} AND active = 1 ORDER BY id DESC LIMIT 1;`
        return (await call_q(sql, 'Сохранение health'))[0];
    }
    //------------------------------
    async getAverage(lim = 0){
        let w = '';
        if(lim)w = ` LIMIT ${lim}`;
        const sql = `SELECT AVG(val) avr FROM ivdoc_bot.health WHERE user_id = ${super.user_id}${w} AND active = 1;`
        return (await call_q(sql, 'Сохранение health'))[0].avr;
    }
    //-----------------------
    async getCount(){
        const sql = `SELECT COUNT(*) count FROM ivdoc_bot.health WHERE user_id = ${super.user_id} AND active = 1;`
        return (await call_q(sql, 'health.getCount()'))[0].count;
    }
    //-----------------------
    async saveValue(){
        const sql = `INSERT INTO ivdoc_bot.health (user_id, val) VALUES (${super.user_id}, '${this.#value}');`
        console.log('health saveValue', sql)
        return await call_q(sql, 'Сохранение health')
    }
    //-----------------------
    async outStr (ctx, arr) {
        await super.outStr(ctx, arr, "Общее состояние:\n")
    }
}

export default Health;
