import ITwitter from "./iTwitter";
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;

export default class TwitterImpl implements ITwitter {
    CONSUMER_API_KEY: string;
    CONSUMER_API_SECRET_KEY: string;
    ACCESS_TOKEN: string = '';
    DOMAIN: string = 'https://api.twitter.com';
    AUTH_URL: string = `${this.DOMAIN}/oauth2/token`;
    SEARCH_URL: string = `${this.DOMAIN}/1.1/search`;
    TWEET_URL: string = `${this.DOMAIN}/1.1/tweets/search`;
    LABEL: string = 'dev';
    SEARCH_30_URL: string = `${this.TWEET_URL}/30day/${this.LABEL}.json`;
    SEARCH_ARCH_URL: string = `${this.TWEET_URL}/fullarchive/${this.LABEL}.json`;
    SEARCH_STANDARD_URL: string = `${this.SEARCH_URL}/tweets.json`;
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

    premiumSearch(keyword: string, since: Date, until: Date, daysDiff: number): any {
        // https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/operators-by-product
        const commonQuery: string = 'lang:ja has:links';
        const utcSince: Date = new Date(since.getUTCFullYear(), since.getUTCMonth(), since.getUTCDate(), since.getUTCHours(), since.getUTCMinutes(), since.getUTCSeconds());
        const utcUntil: Date = new Date(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate(), until.getUTCHours(), until.getUTCMinutes(), until.getUTCSeconds());
        const payload: IPayload = {
            query: `${keyword} ${commonQuery}`,
            fromDate: this._formatSeq(utcSince),
            toDate: this._formatSeq(utcUntil),
            maxResults: 100,
        };
        const options: URLFetchRequestOptions = {
            method: 'post',
            payload: JSON.stringify(payload),
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`
            }
        };
        const url: string =  daysDiff <= 30 ? this.SEARCH_30_URL : this.SEARCH_ARCH_URL;
        let response: HTTPResponse = UrlFetchApp.fetch(url, options);
        const responseCode: number = response.getResponseCode();
        if (responseCode !== 200) {
            Logger.log(responseCode);
        }
        const urlStack: Array<string> = [];
        while (true) {
            const content: IPremiumSearchResponse = JSON.parse(response.getContentText());
            content.results.forEach((status: IStatus) => {
                status.entities.urls.forEach((url: { expanded_url: string }) => {
                    urlStack.push(url.expanded_url);
                });
            });
            if (content.next) {
                payload.next = content.next;
                options.payload = JSON.stringify(payload);
                response = UrlFetchApp.fetch(url, options);
                const responseCode: number = response.getResponseCode();
                if (responseCode !== 200) {
                    Logger.log(responseCode);
                }
            } else {
                break;
            }
        }
        return urlStack;
    }

    search(keyword: string, since: Date, until: Date): any {
        const options: URLFetchRequestOptions = {
            method: 'get',
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`
            }
        };
        const commonQuery: string = 'url:"https://speakerdeck.com" OR url:"https://docs.google.com/presentation" OR url:"https://www.slideshare.net" lang:ja filter:links -filter:replies -filter:retweets';
        const buildQuery: string = encodeURIComponent(`${keyword} until:${this._formatHyphen(until)} since:${this._formatHyphen(since)} ${commonQuery}`);
        let response: HTTPResponse = UrlFetchApp.fetch(`${this.SEARCH_STANDARD_URL}?count=100&q=${buildQuery}`, options);
        const responseCode: number = response.getResponseCode();
        if (responseCode !== 200) {
            Logger.log(responseCode);
        }
        const urlStack: Array<string> = [];
        while (true) {
            const content: ISearchResponse = JSON.parse(response.getContentText());
            content.statuses.forEach((status: IStatus) => {
                status.entities.urls.forEach((url: { expanded_url: string }) => {
                    urlStack.push(url.expanded_url);
                });
            });
            if (content.search_metadata.next_results) {
               response = UrlFetchApp.fetch(`${this.SEARCH_STANDARD_URL}${content.search_metadata.next_results}`, options);
                const responseCode: number = response.getResponseCode();
                if (responseCode !== 200) {
                    Logger.log(responseCode);
                }
            } else {
                break;
            }
        }
        return urlStack;
    }

    _formatHyphen(d: Date): string {
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    _formatSeq(d: Date): string {
        const fillZero = function (number: number) {
            return ('0' + number).slice(-2);
        };

        const year: number = d.getFullYear();
        const month: string = fillZero(d.getMonth() + 1);
        const date: string = fillZero(d.getDate());
        const hour: string = fillZero(d.getHours());
        const minute: string = fillZero(d.getMinutes());
        return `${year}${month}${date}${hour}${minute}`;
    }
}

export interface ISearchResponse {
    statuses: Array<IStatus>,
    search_metadata: {
        next_results: string
    }
}

export interface IStatus {
    entities: {
        urls: Array<{
            expanded_url: string
        }>
    }
}

export interface IPremiumSearchResponse {
    results: Array<IStatus>,
    next: string,
}

export interface IPayload {
    query: string,
    fromDate: string,
    toDate: string,
    maxResults: number,
    next?: string,
}