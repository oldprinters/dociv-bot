//userData.js
/*
ALTER TABLE `ivdoc_bot`.`userData`
  ADD COLUMN `tariff` TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER `birth`,
  ADD COLUMN `category_limit` TINYINT UNSIGNED NOT NULL DEFAULT 3 AFTER `tariff`,
  ADD COLUMN `tariff_until` DATE NULL AFTER `category_limit`,
  ADD UNIQUE INDEX `user_id_UNIQUE` (`user_id`);
*/

import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";
// import { getRazdel, getDateForBD } from "../utils.js";

class UserData {
    #id
    #user_id;
    #fio
    #category_limit = 3
    #tariff_until = null
    #tariff = 0
    #birth = null
    constructor(ctx) {
        this.#user_id = ctx.session.userId
    }
    //----------------------------------------
    setUserId(user_id){
        this.#user_id = user_id
    }
    //----------------------------------------
    async getUser() {
        return await this.readUserData()
    }
    //----------------------------------------
    async readUserData() {
        if(this.#user_id > 0){
            const userData = await call_q(
                `SELECT * FROM userData WHERE user_id = ?`,
                [this.#user_id],
                'Read user data'
                )
            if (userData.length > 0) {
                this.#id = userData[0].id
                this.#fio = userData[0].fio
                this.#category_limit = userData[0].category_limit
                this.#tariff_until = userData[0].tariff_until
                this.#tariff = userData[0].tariff
                this.#birth = userData[0].birth
                return userData[0]
            }
        }
        return null
    }
    //----------------------------------------
    get category_limit() { return this.#category_limit}
    //----------------------------------------
    get tariff_until() { return this.#tariff_until}
    //----------------------------------------
    get tariff() { return this.#tariff}
    //----------------------------------------
    get birth() { return this.#birth}
    //----------------------------------------
    async getId() {
        return this.#id
    }
    //----------------------------------------
    async getFio() {
        if(this.#fio == undefined)
            await this.readUserData()
        return this.#fio
    }

    //----------------------------------------
    async getUserId() {
        if(this.#user_id == undefined)
            await this.readUserData()
        return this.#user_id
    }
    //----------------------------------------
    async getCategoryLimit() {
        if(this.#category_limit == undefined)
            await this.readUserData()
        return this.#category_limit
    }
    //----------------------------------------
    async getTariffUntil() {
        if(this.#tariff_until == undefined)
            await this.readUserData()
        return this.#tariff_until
    }
    //----------------------------------------
    async getTariff() {
        if(this.#tariff == undefined)
            await this.readUserData()
        return this.#tariff
    }
    //----------------------------------------
    async getBirth() {
        if(this.#birth == undefined)
            await this.readUserData()
        return this.#birth
    }
    //----------------------------------------
    async setFio(fio) {
        const sql = `INSERT INTO ivdoc_bot.userData (user_id, fio) VALUES (?, ?);`
        const res = await call_q(sql, [this.#user_id, fio], 'Save user data')
        if (res.insertId > 0) {
            this.#id = res.insertId
        } else {
            console.log("Ошибка сохранения: ", sql)
        } 
        return this.#id
    }
    //----------------------------------------
    async SetBirthDay(birthDay){
        const sql = `UPDATE ivdoc_bot.userData SET birth = ? WHERE (id = ?);`
        await call_q(sql, [birthDay, this.#id], 'Set birth day')
    }
    //----------------------------------------
    async updateUserData(fio) {
        
    }
}

export default UserData