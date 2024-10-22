import {Telegraf, Markup, Scenes, session} from "telegraf"
import { setCommands } from '../utils.js'
// import Users from '../controllers/users.js'

const firstStep = new Scenes.BaseScene('FIRST_STEP')
//--------------------------------------
firstStep.start( ctx => {
    ctx.scene.reenter()
})
//--------------------------------------
firstStep.enter(async ctx => {
    setCommands(ctx)
        if(ctx.session.role == "patient"){
            await ctx.reply("Для сохранения значений введите давление верхнее и нижнее, разделив их наклонной чертой, пульс, температуру."+
                " Значение температуры должно содержать точку или запятую.\nВы можете сохранить оценку своего текущего состояния введя от 1 до 5 звездочек (*).")
            ctx.scene.enter('INPUT_VALUES')
        } else {
            ctx.scene.enter('SELECT_PATIENT')
        }
    // }

})
//---------------------------------------


export default firstStep