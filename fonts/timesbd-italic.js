﻿import { jsPDF } from "jspdf"
var callAddFont = function () {
this.addFileToVFS('timesbd-italic.ttf', font);
this.addFont('timesbd-italic.ttf', 'timesbd', 'italic');
};
jsPDF.API.events.push(['addFonts', callAddFont])