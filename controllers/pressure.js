//pressure.js
import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";
import { getRazdel } from "../utils.js";

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
    async setValue(ctx, str) {
        this.#value = str.replace(getRazdel(), '/');
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
                ctx.session.press_last_id = res.insertId
                // console.log("ctx.session =", ctx.session)

                return messageOk[0];
            } catch(e) {
                return errors[2];
            }
        }
    }
    //-----------------------
    async outStr (ctx, arr) {
        await super.outStr(ctx, arr, "Давление:\n")
    }
}

export default Pressure