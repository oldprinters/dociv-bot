import { call_q } from '../config/query.js'
import { getDateForBD, outDate, outDateTime, outTimeDate } from "../utils.js";
// import Users from './users.js';

class VALUES {
    #user_id;
    #id;
    #date;
    constructor(ctx) {
        this.#date = new Date();
        this.#user_id = ctx.session.userId;
        this.#id = ctx.session.id;
        this.#date = new Date();
        // this.#id
    }
    //-----------------------------
    async init(){

    }
    //-----------------------------
    get user_id() {
        return this.#user_id;
    }
   //-----------------------------
    getUserId() {
        return this.#user_id;
    }
    //-----------------------------
    get id() {
        return this.#id;
    }
    //-----------------------------
    get date() {
        return this.#date;
    }
    //-----------------------------
    async delete(id, table_name){
        const sql = `UPDATE ivdoc_bot.${table_name} SET active = 0 WHERE (id_${table_name} = ${id});`
        return await call_q(sql);
    }
    //-----------------------
    async getStatistic(nDays = 7, table_name) {
        let whDays = ''
        if(nDays > 0){
            const tD = new Date();
            tD.setDate(tD.getDate() - nDays);
            whDays = `AND dataTime > '${getDateForBD(tD) + "T23:59:59"}';` //"T23:59:59" может T00:00:00 ?????
        }
        const sql = `SELECT val, dataTime `+
                    `FROM ivdoc_bot.${table_name} `+
                    `WHERE active = 1 AND user_id = ${this.getUserId()}  ${whDays}`
        return await call_q(sql);
    }
    //--------------------------------------------
    outArr (arr, head) {
        let strOut = head
        let cD = new Date('2011-05-20')
        for( let el of arr ){
            if(outDate(cD) == outDate(el.dataTime)){
                strOut += '           ' + outTimeDate(el.dataTime) + '  '
            } else {
                cD = el.dataTime
                strOut += outDateTime(el.dataTime) + '  '
            }
            strOut += el.val + '\n'
        }
        // strOut += '</pre>'
        return strOut;
    }
    //--------------------------------------------
    async outStr (ctx, arr, head) {
        if(arr.length > 0){
            let str = '<pre>' + this.outArr(arr, head) + '</pre>'
            await ctx.replyWithHTML(str)
        } else {
            await ctx.replyWithHTML(`${head}<i>Данные не вводились.</i>`)
        }
    }
}

export default VALUES;