//pressure.js
import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";
import { getRazdel, getDateForBD } from "../utils.js";

class Pressure extends VALUES {
    #value;
    #upper
    #lower
    constructor(ctx) {
        super(ctx);
    }
    //-----------------------
    getValue() {
        return this.#value;
    }
    //-----------------------
    async saveValue(){
        const sql = `INSERT INTO ivdoc_bot.pressure (user_id, val) VALUES (${this.getUserId()}, '${this.#value}');`
        return await call_q(sql, 'Сохранение давления')
    }
    //-----------------------
    async setValue(ctx) {
        this.#value = ctx.match[0].replace(getRazdel(), '/');
        let arr = this.#value.split('/');
        this.#upper = parseInt(arr[0]);
        this.#lower = parseInt(arr[1]);
        if(this.#upper <= this.#lower) {
            return errors[0];
        } else if(this.#upper > 250 || this.#upper < 70 || this.#lower > 140 || this.#lower <= 20 ) {
            return errors[1];
        } else {
            try {
                const res = await this.saveValue()
                ctx.session.last_id = res.insertId
                console.log("ctx.session =", ctx.session)

                return messageOk[0];
            } catch(e) {
                return errors[2];
            }
        }
    }
    //-----------------------
    async getStatistic(nDays = 7) {
        const tD = new Date();
        tD.setDate(tD.getDate() - nDays);
        const sql = `SELECT val, dataTime `+
                    `FROM ivdoc_bot.pressure `+
                    `WHERE active = 1 AND user_id = ${this.getUserId()}  AND dataTime > '${getDateForBD(tD) + "T23:59:59.000Z"}';`
        console.log('sql =', sql)
        return await call_q(sql);
    }
    //------------------------
    async delete(id){
        const sql = `DELETE FROM 'ivdoc_bot'.'pressure' WHERE ('id_pressure' = ${id});`
        console.log("sql =", sql)
        return await call_q(sql);
    }
}

export default Pressure