var COTLIN_API_URL = ''; // ex. https:// ... /exec

function myFunction() {
    // Fetch api
    var until = new Date();
    var untilStr = getDateStr(until);
    var since = new Date();
    since.setDate(since.getDate()-1);
    var sinceStr = getDateStr(since);
    var requestUrl = COTLIN_API_URL+"?u="+untilStr+"&s="+sinceStr;
    var redirectResponse = UrlFetchApp.fetch(requestUrl, {'followRedirects': false, 'muteHttpExceptions': false});
    var location = redirectResponse.getHeaders()['Location'];
    var response = UrlFetchApp.fetch(location);
    var contents = JSON.parse(response.getContentText());
    Logger.log(contents);
}