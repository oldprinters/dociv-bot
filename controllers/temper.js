//temper.js
import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";
// import { getRazdel, getDateForBD } from "../utils.js";

class Temper extends VALUES {
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
        // console.log("str =", str)
        str = str.trim().replace(',', '.');
        
        this.#value = parseFloat(str);
        if(this.#value < 30 || this.#value > 45){
            return errors[4];
        } else {
            try {
                const res = await this.saveValue()
                ctx.session.temper_last_id = res.insertId
                return messageOk[0];
            } catch(e) {
                return errors[2];
            }
        }
    }
    //-----------------------
    async saveValue(){
        const sql = `INSERT INTO ivdoc_bot.temper (user_id, val) VALUES (${this.getUserId()}, '${this.#value}');`
        return await call_q(sql, 'Сохранение температуры')
    }
    //-----------------------
    async outStr (ctx, arr) {
        await super.outStr(ctx, arr, "Температура:\n")
    }
    //-----------------------
    // async getStatistic(nDays = 7) {
    //     const tD = new Date();
    //     tD.setDate(tD.getDate() - nDays);
    //     const sql = `SELECT val, dataTime `+
    //                 `FROM ivdoc_bot.temper `+
    //                 `WHERE active = 1 AND user_id = ${this.getUserId()}  AND dataTime > '${getDateForBD(tD) + "T23:59:59"}';`
    //     return await call_q(sql);
    // }
}

export default Temper;
