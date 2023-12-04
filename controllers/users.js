import { call_q } from '../config/query.js'

class Users {
    #id         //DB
    #tlg_user = {}
    #role = "patient"
    #active = 1
    #isAdmin    //администратор бота
    #classes = []
    //---------------------------------------
    constructor(tlg_user_id) {
//        if(typeof ctx === 'object' && !Array.isArray(ctx) !== null){
        // if(typeof ctx.from === 'object' && !Array.isArray(ctx.from) !== null){
        //    console.log("users constructor ctx =", ctx.message)
        const user = {"id": tlg_user_id}
            this.#tlg_user = user
        //     if(ctx.message?.chat.id != undefined)
        //         this.#tlg_user.chat_id = ctx.message.chat.id
        //     else
        //         this.#tlg_user.chat_id = ctx.chat.id
        // } else {
        //     throw 'id пользователя telegram не определен.'
        // }
        //console.log(" not OBJECT this =", this.#tlg_user)
    }
    //---------------------------------------
    async init(ctx) {
        const user = await this.readUserTlg()
        if(user == undefined){
            const sql = `INSERT INTO ivdoc_bot.users (tlg_id, role) VALUES ('${this.#tlg_user.id}', '${this.#role}');`
            this.#id = (await call_q(sql)).insertId
            this.#isAdmin = false
            this.#active = 1
            ctx.session.role = this.#role
            ctx.session.userId = this.#id
        } else {
            this.#id = user.id
            this.#isAdmin = user.isAdmin
            this.#active = user.active
            ctx.session.role = user.getRole()
            ctx.session.userId = user.getUserId()
        }
        return this.#id
    }
    //---------------------------------------
    async getUserByTlgId (tlg_id) {
        const sql = `
            SELECT * 
            FROM ivdoc_bot.users
            WHERE tlg_id = ${tlg_id}
            AND active = 1
            ;
        `
        return (await call_q(sql))[0]
    }
    //---------------------------------------
    isAdmin(){return this.#isAdmin}
    //---------------------------------------
    getUserId(){return this.#id}
    //---------------------------------------
    setRole(role){
        this.#role = role
    }
    //---------------------------------------
    getRole(){return this.#role}
    //---------------------------------------
    async getListByRole(role = 'doc'){
        const sql = `
            SELECT user_id, fio
            FROM ivdoc_bot.users u
            LEFT JOIN ivdoc_bot.userData d ON u.id = d.user_id
            WHERE role = '${role}'
            AND u.active = 1
            AND d.active = 1
            ;
        `
        return (await call_q(sql))
    }
    //---------------------------------------
    async readUserTlg() {
        if(this.#tlg_user?.id){
            const sql = `
                SELECT * 
                FROM ivdoc_bot.users 
                WHERE tlg_id = ${this.#tlg_user.id};
            `
            const user = (await call_q(sql))[0]
            if(user != undefined) {
                this.#id = user.id
                this.#isAdmin = user.isAdmin
                this.#active = user.active
                this.#role = user.role
            }
            // console.log(user)
            return user
        } else {
            throw 'Не определен пользователь'
        }
    }
    //----------------------------------------
    
    //----------------------------------------
}

export default Users