const encryption = 'https://'
const node_url = encryption + 'protealive.com:1102/'
const url = node_url + 'api/'

function getConvertDate(unOrganisedDate) {
    const date = new Date(unOrganisedDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}


export { node_url, url, getConvertDate }