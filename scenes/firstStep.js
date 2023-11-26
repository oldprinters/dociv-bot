import {Telegraf, Markup, Scenes, session} from "telegraf"
import { setCommands } from '../utils.js'
import Users from '../controllers/users.js'

const firstStep = new Scenes.BaseScene('FIRST_STEP')
//--------------------------------------
firstStep.enter(async ctx => {
    ctx.reply("First step")
    setCommands(ctx)
    const user = new Users(ctx)
    let us = await user.readUserTlg()
    console.log("us =", us)
    if(us == undefined){
        ctx.scene.enter('SELECT_ROLE')
    }

})

export default firstStep