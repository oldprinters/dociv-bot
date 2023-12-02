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
const queryDeleteMenu = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Давление", "queryPress"),
        Markup.button.callback("Пульс", "queryPuls"),
        Markup.button.callback("Температуру", "queryTemper")
    ])
}
//------------------------------------------
const queryPeriodMenu = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Три дня", "queryDays"),
        Markup.button.callback("Неделя", "queryWeek"),
        Markup.button.callback("Месяц", "queryMonth")
    ])
}
//------------------------------------------
const queryDocPatient = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Доктор", "doctor"),
        Markup.button.callback("Пациент", "patient")
    ])
}

export { queryDeleteMenu, queryDelCancelMenu, queryPeriodMenu, queryYesNoMenu, queryDocPatient }