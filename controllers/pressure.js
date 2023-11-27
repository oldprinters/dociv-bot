//pressure.js

import VALUES from "./values";

class Pressure extends VALUES {
    #value =0;
    constructor(ctx, value) {
        super(ctx);
        this.#value = value;
    }
}