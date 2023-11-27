import { call_q } from '../config/query.js'

class VALUES {
    #user_id;
    #id;
    #date;
    #type;
    constructor(ctx, id, type) {
        console.log("ctx", ctx);
        // this.#user_id = ctx.;
        this.#id = id;
        this.#date = new Date();
        this.#type = type;
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
    //-----------------------------
    get type() {
        return this.#type;
    }
}

export default VALUES;