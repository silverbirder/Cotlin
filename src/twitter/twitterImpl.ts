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

    constructor(consumerApiKey: string, consumerApiSecretKey: string) {
        this.ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty(this.PROP_ACCESS_TOKEN_NAME)!;
        this.CONSUMER_API_KEY = consumerApiKey;
        this.CONSUMER_API_SECRET_KEY = consumerApiSecretKey;
    }

    isSetAccessToken(): boolean {
        return this.ACCESS_TOKEN !== null;
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
        const buildQuery: string = encodeURIComponent(`(#${hashTag}) until:${this._format(end)} since:${this._format(start)} filter:links -filter:replies`);
        let response: HTTPResponse = UrlFetchApp.fetch(`${this.SEARCH_TWEETS_URL}?count=100&q=${buildQuery}`, options);
        const responseCode: number = response.getResponseCode();
        if (responseCode !== 200) {
            Logger.log(responseCode);
        }
        const textStack: Array<string> = [];
        while (true) {
            const content: { statuses: Array<{ text: string }>, search_metadata: { next_results: string } } = JSON.parse(response.getContentText());
            content.statuses.forEach((status: { text: string }) => {
                return textStack.push(status.text);
            });
            if (content.search_metadata.next_results) {
                response = UrlFetchApp.fetch(`${this.SEARCH_TWEETS_URL}${content.search_metadata.next_results}`, options);
                const responseCode: number = response.getResponseCode();
                if (responseCode !== 200) {
                    Logger.log(responseCode);
                }
            } else {
                break;
            }
        }
        return textStack;
    }

    _format(d: Date): string {
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
}