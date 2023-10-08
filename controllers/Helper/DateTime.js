const today = new Date();
const yyyy = today.getFullYear({ timeZone: 'Asia/Kolkata' });
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

let hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
let minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
let seconde = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

let time = `${hours}:${minutes}:${seconde}`;

const date = yyyy + '-' + mm + '-' + dd;

module.exports = { date: date, time: time };