//keyboards.js
import { Markup } from "telegraf";
import { outDateTime } from "../utils.js";

//------------------------------------------
const queryDelCancelMenu = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Удалить", "queryDel"),
        Markup.button.callback("Отказаться", "queryCancel")
    ])
}
//------------------------------------------
const queryYesNoMenu = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Да", "queryYes2"),
        Markup.button.callback("Нет", "queryNo2")
    ])
}
//------------------------------------------
const queryDocPatient = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Доктор", "doctor"),
        Markup.button.callback("Пациент", "patient")
    ])
}

export { queryDelCancelMenu, queryYesNoMenu, queryDocPatient }