import { call_q } from '../config/query.js'
/*
CREATE TABLE `ivdoc_bot`.`basename` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `active` TINYINT NULL DEFAULT 1,
  PRIMARY KEY (`id`));

*/
//------------------------------------------
class BaseName {
  constructor( class_name, id = 0, str = '', active){
    this.active = active || 1
    this.name_id = id
    this.str = str
    this.class_name = class_name.trim()
  }
  //*********************************** */
  async insert_bn(str){
    if(str.length > 0){
        const searchRegExp = /'/g
        const sql = `INSERT INTO basename SET name = '${str.replace(searchRegExp ,'"').trim()}', class_name = '${this.class_name.trim()}';`
        let res = await call_q(sql, 'basename insert')
        let res_id = res.insertId
        return res_id
    } else {
        return 0
    }
  }
  //-------------------------------------------
  async getListByClass(className){
    try{
      return await call_q(`SELECT * FROM basename WHERE class_name = '${className}'`)
    } catch(err){
      console.log("ERROR!!! basename.js getListByClass:", err)
    }
  }
  //***********************************************************//
  async list(){
    return await call_q(`SELECT * FROM basename WHERE active > 0 AND class_name = '${this.class_name}' ORDER BY name`)
  }
  //*********************************** */
  async delete(id){ //TODO сделать уменьшение счетчика active
    this.active = 0
    try {
      let res = await call_q(`DELETE FROM basename WHERE id = ${id}`)
    //   console.log("basename delete res =", res)
      return res.affectedRows
    } catch (e){
      console.log("basename delate catch:", e)
    }
  }
  //*********************************** */
  async update_name(item){
    // console.log("update_name", item)
    try{
      return await call_q(`UPDATE basename SET name = '${item.name}' WHERE id = ${item.name_id}`)
    } catch(err){
      console.log("ERROR!!! basename.js update_name:", err)
    }
  }
  //------------------------------------------------------
  async searchByInp(str){
    const sql = ` SELECT id, name 
      FROM basename 
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
//***************************************************** */
  async search(str){
    try {
      const searchRegExp = /'/g
      const sql = ` SELECT id, name 
                    FROM basename 
                    WHERE name = '${str.replace(searchRegExp ,'"')}' 
                     AND class_name = '${this.class_name}';`
      let rows = await call_q(sql)
      // console.log("search rows =", rows)
      if(rows[0] == undefined)
        return 0 //rows[0] = {id : 0}  //TODO проверить: разные возвращаемые значения
      else 
        return rows[0].id
    } catch (err) {
      console.error("ERROR basename search catch", err)
      throw err
    }
  }
  //***************************************************** */
  async read(id){
    const rows = await call_q("SELECT * FROM `basename` WHERE `id` = " + id)
    this.str = rows[0].name
    this.name_id = rows[0].id
    this.active = rows[0].active
    this.class_name = rows[0].class_name
    return rows[0]
  }
  //************************************** */
  getName(){ 
    return this.str
  }
  //************************************************* TODO дописать учет числа испрользуемых записей
  async add_used(id){
    let res = await call_q("SELECT `active` FROM `basename` WHERE `id` = " + id + ";")
    const count = res[0].active++
    res = await call_q(`UPDATE basename SET active=${res[0].active} WHERE id = ${id};`)
    return count
  }
  //************************************************* */
  async setName(name){
    if((name != undefined) && (name.length > 0))
      this.str = name
    if(this.str.length > 0){
      let id = await this.search(this.str)
      if(id == 0){
        try {
          id = await this.insert_bn(this.str)
          this.name_id = id
          return id
        } catch(err) {
          throw `basename/setName catch: ${err}`
        }
      } else {
        return id
      }
    } else {
      return 0
    }
  }
  //************************************************** */
  getId(){
    return this.name_id
  }
}
//*********************************** */

export default BaseName