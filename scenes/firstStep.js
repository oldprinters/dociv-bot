import {Telegraf, Markup, Scenes, session} from "telegraf"
import { setCommands } from '../utils.js'
import Users from '../controllers/users.js'

const firstStep = new Scenes.BaseScene('FIRST_STEP')
//--------------------------------------
firstStep.enter(async ctx => {
    await ctx.reply("Для сохранения значений введите давление верхнее и нижнее, разделив их наклонной чертой, пульс, температуру. Значение температуры должно содержать точку или запятую.")
    setCommands(ctx)
    const user = new Users(ctx)
    let us = await user.readUserTlg()
    console.log("us =", us)
    if(us == undefined){
        ctx.scene.enter('SELECT_ROLE')
    } else {
        console.log("us =", us)
        if(user.getRole() == "patient"){
            ctx.scene.enter('INPUT_VALUES')
        } else {
            ctx.scene.enter('SELECT_PATIENT')
        }
    }

})
//---------------------------------------


export default firstStep