function getConvertDate(unOrganisedDate) {
    const date = new Date(unOrganisedDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
} 

function getConvertTime(unOrganisedTime) {
    const time = new Date(unOrganisedTime);

    const hours = time.getHours();
    const minutes = time.getMinutes();

    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    const timeString = `${formattedHours}:${formattedMinutes}`;

    return timeString;
}

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based, so add 1
    const day = today.getDate();

    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedDay = day < 10 ? "0" + day : day;

    const todayDateString = `${year}-${formattedMonth}-${formattedDay}`;

    return todayDateString;
}


export { getConvertDate, getConvertTime, getTodayDate }