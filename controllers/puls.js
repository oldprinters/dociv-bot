//puls.js
import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";
import { getRazdel, getDateForBD } from "../utils.js";

class Puls extends VALUES {
    #value;
    constructor(ctx) {
        super(ctx);
    }
    //-----------------------
    getValue() {
        return this.#value;
    }
    //-----------------------
    async setValue(ctx, str) {
        this.#value = parseInt(str);
        if(this.#value < 20 || this.#value > 140){
            return errors[3];
        } else {
            try {
                const res = await this.saveValue()
                ctx.session.puls_last_id = res.insertId
                return messageOk[0];
            } catch(e) {
                return errors[2];
            }
        }
    }
    //-----------------------
    async saveValue(){
        const sql = `INSERT INTO ivdoc_bot.puls (user_id, val) VALUES (${this.getUserId()}, '${this.#value}');`
        return await call_q(sql, 'Сохранение пульса')
    }
    //-----------------------
    async outStr (ctx, arr) {
        await super.outStr(ctx, arr, "Пульс:\n")
    }
    // //-----------------------
    // async getStatistic(nDays = 7) {
    //     const tD = new Date();
    //     tD.setDate(tD.getDate() - nDays);
    //     const sql = `SELECT val, dataTime `+
    //                 `FROM ivdoc_bot.puls `+
    //                 `WHERE active = 1 AND user_id = ${this.getUserId()}  AND dataTime > '${getDateForBD(tD) + "T23:59:59"}';`
    //     return await call_q(sql);
    // }
}

export default Puls;
