/*
CREATE TABLE `ivdoc_bot`.`aliases` (
    `id` INT UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    `item_id` INT UNSIGNED NULL,
    `name_id` INT UNSIGNED NOT NULL,
    `active` TINYINT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC),
    INDEX `aliases_basename_idx` (`name_id` ASC),
    CONSTRAINT `aliases_basename`
      FOREIGN KEY (`name_id`)
      REFERENCES `ppk_node`.`basename` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION)
  COMMENT = 'Псевдонимы названий';
  */
  import { call_q } from '../config/query.js'
  import { BaseName } from './basename.js'
//----------------------------------------------------
  class Aliases {
    #id = 0
    #item_id = 0
    #name_id = 0
    #active = 1
    //--------------------------
    constructor(id = 0){
      this.#id = id
    }
    //*********************** */
    setId(id){
      this.#item_id = id
    }
    //*********************** поиск по item_id
    async getById(id){
      try {
        let sql=` SELECT a.id, bn.name 
                  FROM aliases a 
                  LEFT JOIN basename bn ON bn.id = a.name_id 
                  WHERE a.active = 1 
                     AND item_id = ${id};`
        return await call_q(sql)
      } catch(e){
        console.log("!!!!aliases.js getById err:", e)
      }
    }
    //----------------------------------------------------
    async getByNameId(name_id){
      let sql = ` SELECT item_id id FROM aliases WHERE name_id = ${name_id}`
      // console.log("aliases.js getByNameId sql =", sql)
      try {
        let res = await call_q(sql)
        return res[0]
      }
      catch(err){
        console.error("aliases.js getByNameId sql =", sql)
        return 0
      }
    }
    //--------------------------------------
    async searchByInp(str){
      let bn = new BaseName("aliases")
      try {
        const res = await bn.searchByInp(str)
        return res
      } catch(err){
        throw 'searchByInp catch!!! ' + err
      }
    }
    //*********************** req, res */
    // async update(req, res){
    //   // async updateItem(item){
    //   const item = req.body.item
    //   const aM = new Aliases()
    //   let result = await aM.getNameIdById(item.id)
    //   // console.log("aliases updateItem item =", item, result)
    //   let sql = "UPDATE `basename` SET `name`='" + item.name + "' WHERE `id`= " + result.name_id + ";"
    //   let res1 = await call_q(sql)
    //   if(res1.affectedRows == 0){
    //     console.error("Ошибка записи в таблицу basename. aliases.js updateItem")
    //   }
    //   res.status(200).json(result)
    //   // console.log(res1)
    // }
    //************************ */
    async insert_name(name){
      let sql = "INSERT INTO `basename` (`name`, `active`, `class_name`) VALUES ('" + name.trim() + "', '1', 'aliases');"
      let res = await call_q(sql)
      // console.log("aliases.js insert_name res =", res)
      if(res.affectedRows == 0){
        console.error("Ошибка записи в таблицу basename. aliases.js updateItem")
      }
      return res.insertId
    }
    //***********************/
    async insert(name){
      try {
        let bn = new BaseName("aliases")
        // const aM = new AliasesModel()
        // console.log("aliases/insert.js insert:", req.body )
        const name_id = await bn.search(name)
        // console.log("aliases/insert.js insert name_id =", name_id)
        if(name_id > 0){
            let sName = await aM.getStationNameId(name_id)
            if(sName != undefined){
              // console.log("aliases/insert.js sName =", sName)
              res.status(200).json({error: true, 'station_name': sName.name})
            } else {
              // console.log("aliases.js insert имя есть а записи нет", sName)
              req.body.name_id = name_id
              let r = aM.insert_item(req.body)
              res.status(200).json({error: false, id: r.insertId})
            }
        } else {
          let name_id = await bn.insert_str(req.body.name)
          // console.log("aliases.js name_id =", name_id)
          req.body.name_id = name_id
          let r = aM.insert_item(req.body)
          res.status(200).json({error: false, id: r.insertId})
        }
      } catch (e){
        console.log("aliases/insert.js insert catch 1", e)
        next(e)
      }
    }
    //*********************** 
    async insert_item(item){
      let sql = "INSERT INTO `aliases` (`item_id`, `name_id`, `active`) VALUES ('"+item.station_id+"', '"+item.name_id+"', '1');"
      let res = await call_q(sql)
      // console.log("aliases insert res =", res)
      if(res.affectedRows == 0){
        console.error("Ошибка записи в таблицу basename. aliases.js updateItem")
      }
      return res.insertId
    }
    // //************************ */
    // async #del_name(){
    //   let name_id = (await this.#getNameIdById(this.#id)).name_id
    //   // console.log(name_id)
    //   let sql = "DELETE FROM `basename` WHERE `id`=" + name_id + ";"
    //   // console.log("aliases del_name sql =", sql)
    //   let res = await call_q(sql)
    //   // console.log("aliases del_name res =", res)
    //   if(res.affectedRows == 0){
    //     console.error("Ошибка удаления в таблице basename. aliases.js del_name res =", res)
    //   }
    //   return res.affectedRows
    // }
    //************************ */
    async delete(req, res){
      const id = req.params.id
      const bn = new BaseName("aliases")
      const aM = new AliasesModel()
      const name_id = (await aM.getNameIdById(id)).name_id
      let tt = await bn.delete(name_id)
      let result
      if(tt > 0){
        result = await aM.delete(id)
      } else result = 0
      if(result !== undefined && result != 0){
        res.status(200).json(result)
      } else {
        res.status(510).send("Ошибка удаления псевдонима. Отсутствует нужная запись в БД.")
      }
    }
  }

export default Aliases