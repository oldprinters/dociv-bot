//medicament

import BaseName from "./basename.js";
import { call_q } from "../config/query.js";

class Medicament extends BaseName {
    med_id
    #name_id = 0
    #note_id = 0
    #doc_id
    constructor(doc_id){
        super('medicament')
        this.#doc_id = doc_id
    }
  //------------------------------------------------------
  async searchByInp(str){
    const sql = ` SELECT m.id med_id, bn.id name_id, bn.name medName
      FROM medicament m 
      LEFT JOIN basename bn ON bn.id = m.name_id
      WHERE name LIKE '${str}%' COLLATE utf8mb4_unicode_ci 
      AND class_name = '${this.class_name}';
    `
    try {
      let res = await call_q(sql)
      return res
    } catch (err) {
      console.error("ERROR basename searchByInp catch", err)
      throw err
    }
}
  //-----------------------------------
  async searchName(name){
    if(name != undefined){
      let arRes = await this.searchByInp(name)
      // console.log("arRes =", arRes)
      if(arRes.length == 0)
        return { 't': 0, 'r': undefined }
      else if(arRes.length == 1){
        this.med_id = arRes[0].med_id
        this.name_id = arRes[0].name_id
        this.str = arRes[0].medName
        return { 't': 1, 'r': arRes[0].med_id}
      } else 
        return {'t': 2, 'r': arRes}
    }
    return undefined
  }
    //-----------------------------------
    async insert_med(){ //сохранение названия лекарства
        if(this.#name_id){
            const sql = `INSERT INTO ivdoc_bot.medicament (name_id, author_id, note_id) VALUES (${this.#name_id}, ${this.#doc_id}, ${this.#note_id});`
            // console.log("medicament sql =", sql)
            const res = await call_q(sql, 'Medicament insert')
            // console.log("medicament res =", res)
            this.med_id = res.insertId
        } else {
          throw 'THROW!!! insert: this.#name_id =' + this.#name_id
        }
        return this.med_id
    }
    //------------------------------------
    async read (med_id) {
        if(med_id != undefined && med_id > 0){
            const sql = `SELECT m.id med_id, name, bn.id name_id FROM medicament m
            LEFT JOIN basename bn ON bn.id = m.name_id
            WHERE m.id = ${med_id};`
            const res = (await call_q(sql, 'medicament read'))[0]
            this.str = res.name
            this.name_id = res.name_id
            this.med_id = res.med_id
        }
    } 
    //-----------------------------------
    getName(){
      return this.str
  }
    //-----------------------------------
    async setName(name){
      this.#name_id = await super.setName(name)
      return await this.insert_med()
  }
//-------------------------------------------

};

export default Medicament