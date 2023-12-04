//userData.js
import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";
// import { getRazdel, getDateForBD } from "../utils.js";

class UserData {
    #id
    #user_id;
    #fio
    constructor(ctx) {
        this.#user_id = ctx.session.userId
    }
    //----------------------------------------
    async readUserData() {
        if(this.#user_id > 0){
            const userData = await call_q(
                `SELECT * FROM userData WHERE user_id = ${this.#user_id}`
                )
            if (userData.length === 0) {
                this.#fio = undefined
            } else {
                this.#id = userData[0].id
                this.#fio = userData[0].fio
            }
        }
        return this.#fio
    }
    //----------------------------------------
    async getId() {
        return this.#id
    }
    //----------------------------------------
    async getFio() {
        if(this.#id == undefined)
            this.readUserData()
        return this.#fio
    }
    //----------------------------------------
    async setFio(fio) {
        const sql = `INSERT INTO ivdoc_bot.userData (user_id, fio) VALUES (${this.#user_id}, '${fio}');`
        const res = await call_q(sql)
        if (res.insertId > 0) {
            this.#id = res.insertId
        } else {
            console.log("Ошибка сохранения: ", sql)
        } 
        return this.#id
    }
    //----------------------------------------
    async SetBirthDay(birthDay){
        const sql = `UPDATE ivdoc_bot.userData SET birth = '${birthDay}' WHERE (id = ${this.#id});`
    }
    //----------------------------------------
    async updateUserData(fio) {
        
    }
}

export default UserData