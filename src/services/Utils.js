export default function getCurrentWeek() {
    let todaydate = new Date();
    var oneJan =  new Date(todaydate.getFullYear(), 0, 1);
    var numberOfDays =  Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( todaydate.getDay() + 1 + numberOfDays) / 7);
    return result;
}