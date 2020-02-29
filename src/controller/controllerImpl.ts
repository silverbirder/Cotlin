import IController from "./iController";
import TwitterImpl from "../twitter/twitterImpl";
import AppsScriptHttpRequestEvent = GoogleAppsScript.Events.AppsScriptHttpRequestEvent;

export default class ControllerImpl implements IController {

    run(e: AppsScriptHttpRequestEvent): any {
        const parameter: { q?: string, s?: string, u?: string } = e.parameter;
        let keyword: string = '';
        let since: Date = new Date();
        since.setDate(since.getDate() - 1);
        since.setHours(0);
        since.setMinutes(0);
        since.setSeconds(0);
        let now: Date = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        let until: Date = new Date(now.getTime());

        if (parameter.q !== undefined) {
            keyword = parameter.q;
        }
        if (parameter.s !== undefined) {
            const sinceAry: Array<string> = parameter.s.split('-');
            if (sinceAry.length === 3) {
                since = new Date(parseInt(sinceAry[0]), parseInt(sinceAry[1]) - 1, parseInt(sinceAry[2]), 0, 0, 0);
            }
        }
        if (parameter.u !== undefined) {
            const untilAry: Array<string> = parameter.u.split('-');
            if (untilAry.length === 3) {
                until = new Date(parseInt(untilAry[0]), parseInt(untilAry[1]) - 1, parseInt(untilAry[2]), 0, 0, 0);
            }
        }
        const consumerApiKey: string = PropertiesService.getScriptProperties().getProperty('CONSUMER_API_KEY')!;
        const consumerApiSecretKey: string = PropertiesService.getScriptProperties().getProperty('CONSUMER_API_SECRET_KEY')!;
        if (consumerApiKey === undefined || consumerApiSecretKey === undefined) {
            throw Error('Not set the CONSUMER_API_KEY or CONSUMER_API_SECRET_KEY');
        }
        const twitter: TwitterImpl = new TwitterImpl(consumerApiKey, consumerApiSecretKey);
        if (!twitter.isSetAccessToken()) {
            twitter.auth();
        }
        const msDiff: number = now.getTime() - since.getTime();
        const daysDiff: number = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
        // https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
        if (daysDiff > 7) {
            const result2 = twitter.premiumSearch(keyword, since, until, daysDiff);
            Logger.log(result2);
            return;
        }
        const result = twitter.search(keyword, since, until);
        ContentService.createTextOutput();
        const output = ContentService.createTextOutput();
        output.setMimeType(ContentService.MimeType.JSON);
        output.setContent(result);
        return output;
    }
}