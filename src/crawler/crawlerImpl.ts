import ICrawler from "./iCrawler";
import URLFetchRequest = GoogleAppsScript.URL_Fetch.URLFetchRequest;
import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;

export default class CrawlerImpl implements ICrawler {
    craw(urlList: Array<string>): Array<string> {
        const locationList: Array<string> = [];
        while (true) {
            const requestList: Array<URLFetchRequest> = this._buildRequestList(urlList);
            const responseList: Array<HTTPResponse> = UrlFetchApp.fetchAll(requestList);
            urlList = [];
            responseList.forEach((response: HTTPResponse) => {
                const allHeaders: any = response.getAllHeaders();
                const location: string = allHeaders['Location'];
                if (location) {
                    locationList.push(location);
                    urlList.push(location);
                }
            });
            if (urlList.length === 0) {
                break;
            }
        }
        return locationList;
    }

    _buildRequestList(urlList: Array<string>): Array<URLFetchRequest> {
        return urlList.map((url: string) => {
            return {
                url: url,
                method: 'get',
                followRedirects: false,
            }
        });
    }
}