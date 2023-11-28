//pressure.js

import VALUES from "./values.js";
import { getRazdel } from "../utils.js";

class Pressure extends VALUES {
    #value;
    #upper
    #lower
    constructor(ctx) {
        super(ctx);
    }
    //-----------------------
    getValue() {
        return this.#value;
    }
    //-----------------------
    setValue(str) {
        this.#value = str.replace(getRazdel(), '/');
        let arr = this.#value.split('/');
        this.#upper = arr[0];
        this.#lower = arr[1];
        console.log(this.#value, this.#upper, this.#lower)
    }
    //-----------------------
    
}

export default Pressure