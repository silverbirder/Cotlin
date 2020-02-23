import IController from "./iController";
import TwitterImpl from "../twitter/twitterImpl";
import AppsScriptHttpRequestEvent = GoogleAppsScript.Events.AppsScriptHttpRequestEvent;
import ExtractorImpl from "../extractor/extractorImpl";
import CrawlerImpl from "../crawler/crawlerImpl";

export default class ControllerImpl implements IController {

    run(e: AppsScriptHttpRequestEvent): any {
        const parameter: { h?: string, s?: string, e?: string } = e.parameter;
        let hashTag: string = '';
        let startDate: Date = new Date();
        let endDate: Date = new Date();
        if (parameter.h !== undefined) {
            hashTag = parameter.h;
        }
        if (parameter.s !== undefined) {
            const startDateAry: Array<string> = parameter.s.split('-');
            if (startDateAry.length === 3) {
                startDate = new Date(parseInt(startDateAry[0]), parseInt(startDateAry[1]) - 1, parseInt(startDateAry[2]));
            }
        }
        if (parameter.e !== undefined) {
            const endDateAry: Array<string> = parameter.e.split('-');
            if (endDateAry.length === 3) {
                endDate = new Date(parseInt(endDateAry[0]), parseInt(endDateAry[1]) - 1, parseInt(endDateAry[2]));
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
        const result = twitter.search(hashTag, startDate, endDate);
        const extractor: ExtractorImpl = new ExtractorImpl(/(https:\/\/t\.co\/.{10})/);
        const urlList: Array<string> = extractor.extract(result);
        const crawler: CrawlerImpl = new CrawlerImpl();
        const locationList: Array<string> = crawler.craw(urlList);

        Logger.log(locationList);
        ContentService.createTextOutput();
        const output = ContentService.createTextOutput();
        output.setMimeType(ContentService.MimeType.JSON);
        output.setContent(result);
        return output;
    }
}