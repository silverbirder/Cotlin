import ITwitter from "./iTwitter";
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;

export default class TwitterImpl implements ITwitter {
    CONSUMER_API_KEY: string;
    CONSUMER_API_SECRET_KEY: string;
    ACCESS_TOKEN: string = '';
    AUTH_URL: string = 'https://api.twitter.com/oauth2/token';
    SEARCH_TWEETS_URL: string = 'https://api.twitter.com/1.1/search/tweets.json';
    PROP_ACCESS_TOKEN_NAME: string = 'ACCESS_TOKEN';
    PROP_CONSUMER_API_KEY_NAME: string = 'CONSUMER_API_KEY';
    PROP_CONSUMER_API_SECRET_KEY_NAME: string = 'CONSUMER_API_SECRET_KEY';

    constructor() {
        this.CONSUMER_API_KEY = PropertiesService.getScriptProperties().getProperty(this.PROP_CONSUMER_API_KEY_NAME)!;
        this.CONSUMER_API_SECRET_KEY = PropertiesService.getScriptProperties().getProperty(this.PROP_CONSUMER_API_SECRET_KEY_NAME)!;
        this.ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty(this.PROP_ACCESS_TOKEN_NAME)!;
    }

    isSetAccessToken(): boolean {
        return  this.ACCESS_TOKEN !== null;
    }

    auth(): boolean {
        const options: URLFetchRequestOptions = {
            method: 'post',
            headers: {
                Authorization: 'Basic ' + Utilities.base64Encode(`${this.CONSUMER_API_KEY}:${this.CONSUMER_API_SECRET_KEY}`)
            },
            payload: {
                grant_type: 'client_credentials'
            }
        };
        const response: HTTPResponse = UrlFetchApp.fetch(this.AUTH_URL, options);
        const responseCode: number = response.getResponseCode();
        if (responseCode === 403) {
            Logger.log('Too many request. response code is 403.');
            return false;
        }
        const content: { access_token: string } = JSON.parse(response.getContentText());
        PropertiesService.getScriptProperties().setProperty(this.PROP_ACCESS_TOKEN_NAME, content.access_token);
        this.ACCESS_TOKEN = content.access_token;
        return true;
    }

    search(hashTag: string, start: Date, end: Date): any {
        const options: URLFetchRequestOptions = {
            method: 'get',
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`
            }
        };
        const buildQuery: string = encodeURIComponent(`(#${hashTag}) until:${this._format(end)} since:${this._format(start)}`);
        const response: HTTPResponse = UrlFetchApp.fetch(`${this.SEARCH_TWEETS_URL}?q=${buildQuery}`, options);
        const responseCode: number = response.getResponseCode();
        if (responseCode !== 200) {
            Logger.log(responseCode);
        }
        const content: { statuses: Array<{ text: string }>, search_metadata: any } = JSON.parse(response.getContentText());
        return content.statuses.map((status: { text: string }) => {
            return status.text;
        });
    }

    _format(d: Date): string {
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
}