/*
CREATE TABLE `prescription` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int(10) unsigned NOT NULL,
  `doc_id` int(10) unsigned NOT NULL,
  `name_id` int(10) unsigned NOT NULL,
  `dn` tinyint(4) DEFAULT 127 COMMENT 'дни недели приема',
  `kd` tinyint(1) unsigned DEFAULT 1 COMMENT 'кратность дней приема: каждый день (1), через день (2) и т.д.',
  `krd` tinyint(3) unsigned DEFAULT 1 COMMENT 'число приемов в день',
  `date_create` date DEFAULT current_timestamp(),
  `active` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci
*/

import { call_q } from "../config/query.js";
import { raz } from "../utils.js";
import Medicament from "./medicament.js";

class Prescription extends Medicament {
  #id
  #patient_id
  #doc_id
  // #med_id
  #note = ''
  #dn = 127 //маска дней недели
  #kd = 1   //коэффициент дней !; - раз в две недели
  #krd = 1  //количество раз в день
  //************************************
  constructor(patient_id, doc_id){
    super(doc_id)
    this.#patient_id = patient_id
    this.#doc_id = doc_id
  }
  //-----------------------------------
  clear () {
    this.#dn = 127
    this.#kd = 1
    this.#krd = 1
    this.med_id = 0
    this.#id = 0
    this.#note = ''
  }
  //-----------------------------------
  async getInfo(){
    const sql = `SELECT fio FROM ivdoc_bot.userData WHERE user_id = ${this.#patient_id};`
    return (await call_q(sql, 'Prescription getInfo'))[0].fio
  }
  //-----------------------------------
  setMedId(med_id){
    if(med_id != undefined && med_id > 0){
        this.med_id = med_id
        super.read(med_id)
    }
  }
//-----------------------------------
  setTmpName(name){
    this.str = name
  }
  //-----------------------------------
  async setName(){
    const med_id = await super.setName(this.str)
    // console.log("med_id =", med_id)
    if(med_id != undefined && med_id > 0){
      // this.#med_id = med_id
    } else {
      console.log("Ошибка сохранения medicament")
    }
    return med_id
  }
  //-----------------------------------
  setKRD(krd){  //число раз в день
    if(krd != undefined && krd > 0)
      this.#krd = krd
  }
  //-----------------------------------
  setKD(kd){  //число раз в день
    if(kd != undefined && kd > 0)
      this.#kd = kd
  }
  //-----------------------------------
  setNote(note) {
    if(note != undefined)
      this.#note = note
    else
    this.#note = ''
  }
  //-----------------------------------
  async delete(id){ //удаление рецепта
    const sql = `UPDATE prescription SET active = '0' WHERE (id = '${id}');`
    return (await call_q(sql, 'prescription delete')).affectedRows
  }
  //-----------------------------------
  async allInfo() {
    const fio = await this.getInfo()
    const kd = this.#kd == 1? 'каждый': `на ${this.#kd}`
    return `Пациент: ${fio}\nПрепарат: ${this.str}\nПринимать ${kd} день\n${this.#krd} ${raz(this.#krd)} в день, ${this.#note}\n\nДанные сохранены.`
  }
  //-----------------------------------
  async insert(){
    // this.med_id = await super.insert()
    // console.log("prescription this =", this)
    if( this.med_id > 0){
      const sql = `INSERT INTO prescription (patient_id, doc_id, med_id, note, dn, kd, krd) VALUES \
                  (${this.#patient_id}, ${this.#doc_id}, ${this.med_id}, '${this.#note}', ${this.#dn}, ${this.#kd}, ${this.#krd});`
      // console.log("prescription sql =", sql)
      call_q(sql, 'prescription insert')
      return this.allInfo()
    } else {
      return undefined
    }
  }
  //-----------------------------------
  async list(doc_id = 0) {  //список выписанных лекарств пациенту
    let doc = ''
    if(doc_id > 0){
      doc = 'AND doc_id = ' + doc_id
    }
    const sql = `
      SELECT p.id, med.id med_id, bn.name medName, ud.fio docFio, dn, kd, krd, note FROM prescription p
      LEFT JOIN medicament med ON p.med_id = med.id
      LEFT JOIN basename bn ON med.name_id = bn.id
      LEFT JOIN userData ud ON p.doc_id = ud.user_id
      WHERE patient_id = ${this.#patient_id}
        ${doc}
        AND p.active = 1
        AND med.active = 1;
    `
    return await call_q(sql, 'Prescription list')
  }
};

export default Prescription