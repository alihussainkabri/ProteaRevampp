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

function getTimeZoneOffsetISOString() {
    var timezone_offset_min = new Date().getTimezoneOffset(),
        offset_hrs = parseInt(Math.abs(timezone_offset_min / 60)),
        offset_min = Math.abs(timezone_offset_min % 60),
        timezone_standard;

    if (offset_hrs < 10) offset_hrs = "0" + offset_hrs;

    if (offset_min < 10) offset_min = "0" + offset_min;

    // Add an opposite sign to the offset
    // If offset is 0, it means timezone is UTC
    if (timezone_offset_min < 0)
        timezone_standard = "+" + offset_hrs + ":" + offset_min;
    else if (timezone_offset_min > 0)
        timezone_standard = "-" + offset_hrs + ":" + offset_min;
    else if (timezone_offset_min == 0) timezone_standard = "Z";

    return timezone_standard;
}


export { getConvertDate, getConvertTime, getTodayDate,getTimeZoneOffsetISOString }