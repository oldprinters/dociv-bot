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
    saveValue(){
        console.log("this.user_id", this.getUserId())
        const sql = `INSERT INTO ivdoc_bot.pressure (user_id, val) VALUES (${this.getUserId()}, '${this.#value}');`
        return call_q(sql, 'Сохранение давления')
    }
    //-----------------------
    setValue(str) {
        this.#value = str.replace(getRazdel(), '/');
        let arr = this.#value.split('/');
        this.#upper = parseInt(arr[0]);
        this.#lower = parseInt(arr[1]);
        console.log(this.#value, this.#upper, this.#lower)
        if(this.#upper <= this.#lower) {
            return errors[0];
        } else if(this.#upper > 250 || this.#upper < 70 || this.#lower > 140 || this.#lower <= 20 ) {
            return errors[1];
        } else {
            try {
                this.saveValue()
                return messageOk[0];
            } catch(e) {
                return errors[2];
            }
        }
    }
    //-----------------------
    
}

export default Pressure