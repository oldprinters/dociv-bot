//doc_patient.js
import { call_q } from '../config/query.js'
import { errors, messageOk } from './errors.js';
import VALUES from "./values.js";
// import { getRazdel, getDateForBD } from "../utils.js";

class DocPatient {
    #id;
    #user_id;
    #patient_id;
    #doc_id;
    //-------------------
    constructor(ctx) {
        this.#user_id = ctx.session.userId;
    }
    //-------------------
    async getDocs() {
        const docs = await call_q(
            `SELECT dp.doc_id, fio 
            FROM ivdoc_bot.doc_patient dp
            LEFT JOIN userData ud ON ud.user_id = dp.doc_id
            WHERE dp.active = 1
            AND dp.patient_id = ${this.#user_id}
            ORDER BY fio;
            `
        );
        return docs;
    }
    //-------------------
    async getPatients() {
        const patients = await call_q(
            `SELECT dp.patient_id, fio 
            FROM ivdoc_bot.doc_patient dp
            LEFT JOIN userData ud ON ud.user_id = dp.patient_id
            WHERE dp.active = 1
            AND dp.doc_id = ${this.#user_id}
            ORDER BY fio;
            `
        );
        return patients;
    }
    //-------------------
    async appendDoc(doc_id) {
        this.#doc_id = doc_id
        const docs = await call_q(
            `INSERT INTO ivdoc_bot.doc_patient (doc_id, patient_id) VALUES (${this.#doc_id}, ${this.#user_id});`
        );
        return docs.insertId;
    }
    //-------------------
    async deletePatient(doc_id, patient_id){
        const sql = `UPDATE doc_patient SET active = 0 WHERE doc_id = ${doc_id} AND patient_id = ${patient_id};`
        const res = await call_q(sql, 'doc_patient / deletePatient')
        return res.affectedRows
    }
}

export default DocPatient;