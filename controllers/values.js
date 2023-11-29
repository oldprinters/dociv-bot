import { call_q } from '../config/query.js'
// import Users from './users.js';

class VALUES {
    #user_id;
    #id;
    #date;
    constructor(ctx) {
        const tlg_id = ctx.message.from.id;
        this.#date = new Date();
        this.#user_id = ctx.session.userId;
        this.#id = ctx.session.id;
        this.#date = new Date();
        console.log("VALUES constructor ", this.#user_id, this.#id, this.#date)
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
}

export default VALUES;