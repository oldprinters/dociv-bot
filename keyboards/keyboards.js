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
const queryYesNoMenu1 = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Да", "queryYes1"),
        Markup.button.callback("Нет", "queryNo1")
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
const appendMedMenu = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback("Добавить препарат", "appendMed")],
        [Markup.button.callback("Удалить препарат", "deleteMed")],
        [Markup.button.callback("Сохранить назначение", "saveToPDFMed")],
    ])
}
//------------------------------------------
const queryPeriodMenuNaz = () => {
    return Markup.inlineKeyboard([
        [
            Markup.button.callback("Три дня", "queryDays"),
            Markup.button.callback("Неделя", "queryWeek"),
            Markup.button.callback("Месяц", "queryMonth")
        ],
        [Markup.button.callback("Назначение", "prescription")]
    ])
}
//------------------------------------------
const queryDocPatient = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Доктор", "doctor"),
        Markup.button.callback("Пациент", "patient")
    ])
}
//-------------------------------------------
const querySetupMenu = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback("Выбрать доктора", "appendDoc"),
        Markup.button.callback("Настроить уведомления", "remembers")],
        [Markup.button.callback("Скачать историю данных", "downloadData")]
    ])
}
//--------------------------------------------
const queryDocSelect = (arr) => {
    let arrButtons = [];
    for(let el of arr){
        arrButtons.push(Markup.button.callback(el.fio, "docSelect" + el.user_id))
    }
    return Markup.inlineKeyboard(arrButtons)
}
//--------------------------------------------
const queryPatientSelect = (arr) => {
    let arrButtons = [];
    for(let el of arr){
        arrButtons.push(Markup.button.callback(el.fio, "patientSelect" + el.patient_id))
    }
    return Markup.inlineKeyboard(arrButtons)
}
//--------------------------------------------
const queryMedicamentSelectMenu = (arr) => {
    let arrButtons = [];
    for(let el of arr){
        arrButtons.push([Markup.button.callback(el.medName, "medicamentSelect" + el.med_id)])
    }
    return Markup.inlineKeyboard(arrButtons)
}
//--------------------------------------------
const queryMedicamentDeleteMenu = (arr) => {
    let arrButtons = [];
    for(let el of arr){
        arrButtons.push([Markup.button.callback(el.medName, "medicamentDelete" + el.id)])
    }
    return Markup.inlineKeyboard(arrButtons)
}
//--------------------------------------------
const queryRepeat = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("Обновить", "repeatK"),
    ])
}

export { appendMedMenu, queryDeleteMenu, queryDelCancelMenu, queryDocSelect, queryMedicamentSelectMenu, queryMedicamentDeleteMenu,
        queryPatientSelect, queryPeriodMenu, queryPeriodMenuNaz,
        queryRepeat, queryYesNoMenu, queryYesNoMenu1, queryDocPatient, querySetupMenu }