import ITwitter, {
    IPayload,
    IPremiumSearchResponse,
    IResponseStack,
    ISearchResponse,
    IStatus,
    SEARCH_TYPE
} from "./iTwitter";
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;

export default class TwitterImpl implements ITwitter {
    CONSUMER_API_KEY: string;
    CONSUMER_API_SECRET_KEY: string;
    keyword: string = '';
    since: Date = new Date();
    until: Date = new Date();
    domains: Array<string>;

    LABEL: string = 'dev';
    ACCESS_TOKEN: string = '';
    PROP_ACCESS_TOKEN_NAME: string = 'ACCESS_TOKEN';

    DOMAIN: string = 'https://api.twitter.com';
    AUTH_URL: string = `${this.DOMAIN}/oauth2/token`;
    SEARCH_URL: string = `${this.DOMAIN}/1.1/search`;
    TWEET_URL: string = `${this.DOMAIN}/1.1/tweets/search`;
    SEARCH_30_URL: string = `${this.TWEET_URL}/30day/${this.LABEL}.json`;
    SEARCH_ARCH_URL: string = `${this.TWEET_URL}/fullarchive/${this.LABEL}.json`;
    SEARCH_STANDARD_URL: string = `${this.SEARCH_URL}/tweets.json`;

    constructor(consumerApiKey: string, consumerApiSecretKey: string, domains: Array<string>) {
        this.ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty(this.PROP_ACCESS_TOKEN_NAME)!;
        this.CONSUMER_API_KEY = consumerApiKey;
        this.CONSUMER_API_SECRET_KEY = consumerApiSecretKey;
        this.domains = domains;
    }

    whichType(): SEARCH_TYPE {
        let now: Date = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        const msDiff: number = now.getTime() - this.since.getTime();
        const daysDiff: number = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;

        // request parameter: until
        // @see https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
        if (daysDiff <= 7) {
            return SEARCH_TYPE.STANDARD;
        } else if (daysDiff <= 30) {
            return SEARCH_TYPE.PREMIUM_30DAY;
        } else {
            return SEARCH_TYPE.PREMIUM_FULL_ARCHIVE;
        }
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
        const content: { access_token: string } = JSON.parse(response.getContentText());
        PropertiesService.getScriptProperties().setProperty(this.PROP_ACCESS_TOKEN_NAME, content.access_token);
        this.ACCESS_TOKEN = content.access_token;
        return true;
    }

    premium30DaySearch(): Array<IResponseStack> {
        return this._premiumSearch(this.SEARCH_30_URL);
    }

    premiumFullArchiveSearch(): Array<IResponseStack> {
        return this._premiumSearch(this.SEARCH_ARCH_URL);
    }

    _premiumSearch(url: string): Array<IResponseStack> {
        // @see premium operators (sandbox)
        // https://developer.twitter.com/en/docs/tweets/search/guides/premium-operators
        const commonQuery: string = 'has:links';
        const utcSince: Date = this._toUtcDate(this.since);
        const utcUntil: Date = this._toUtcDate(this.until);
        const payload: IPayload = {
            query: `${this.keyword} ${commonQuery}`,
            fromDate: this._formatSeq(utcSince),
            toDate: this._formatSeq(utcUntil),
        };
        const options: URLFetchRequestOptions = {
            method: 'post',
            payload: JSON.stringify(payload),
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`
            }
        };
        let response: HTTPResponse = UrlFetchApp.fetch(url, options);
        const result: Array<IResponseStack> = [];
        while (true) {
            const content: IPremiumSearchResponse = JSON.parse(response.getContentText());
            content.results.forEach((status: IStatus) => {
                status.entities.urls.forEach((url: { expanded_url: string }) => {
                    result.push({id: status.id_str, url: url.expanded_url});
                });
            });
            if (content.next) {
                payload.next = content.next;
                options.payload = JSON.stringify(payload);
                response = UrlFetchApp.fetch(this.SEARCH_30_URL, options);
            } else {
                break;
            }
        }
        return result;
    }

    standardSearch(): Array<IResponseStack> {
        const options: URLFetchRequestOptions = {
            method: 'get',
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`
            }
        };
        // @see standard operators
        // https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators
        const domainQuery: string = this.domains.map((domain: string) => {
            return `url:${domain}`
        }).join(' OR ');
        const filterQuery: string = `filter:links -filter:replies -filter:retweets`;
        const argsQuery: string = `${this.keyword} until:${this._formatHyphen(this.until)} since:${this._formatHyphen(this.since)}`;
        const buildQuery: string = encodeURIComponent(`${argsQuery} ${domainQuery} ${filterQuery}`);
        let response: HTTPResponse = UrlFetchApp.fetch(`${this.SEARCH_STANDARD_URL}?q=${buildQuery}`, options);
        const result: Array<IResponseStack> = [];
        while (true) {
            const content: ISearchResponse = JSON.parse(response.getContentText());
            content.statuses.forEach((status: IStatus) => {
                status.entities.urls.forEach((url: { expanded_url: string }) => {
                    result.push({id: status.id_str, url: url.expanded_url});
                });
            });
            if (content.search_metadata.next_results) {
                response = UrlFetchApp.fetch(`${this.SEARCH_STANDARD_URL}${content.search_metadata.next_results}`, options);
            } else {
                break;
            }
        }
        return result;
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

    _toUtcDate(d: Date) {
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds())
    }
}