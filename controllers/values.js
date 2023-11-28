import { call_q } from '../config/query.js'
// import Users from './users.js';

class VALUES {
    #user_id;
    #id;
    #date;
    constructor(ctx) {
        // super(ctx)
        console.log("VALUES constructor")
        const tlg_id = ctx.message.from.id;
        // this.#user_id = super.getUserByTlgId(tlg_id);
        this.#date = new Date();
        console.log("VALUES constructor ", tlg_id)
        this.#user_id = ctx.session.user_id;
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
    get id() {
        return this.#id;
    }
    //-----------------------------
    get date() {
        return this.#date;
    }
}

export default VALUES;