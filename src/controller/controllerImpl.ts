import IController from "./iController";
import TwitterImpl from "../twitter/twitterImpl";
import AppsScriptHttpRequestEvent = GoogleAppsScript.Events.AppsScriptHttpRequestEvent;

export default class ControllerImpl implements IController {

    static Get(e: AppsScriptHttpRequestEvent): any {
        const parameter: { h?: string, s?: string, e?: string } = e.parameter;
        let hashtag: string = '';
        let startDate: Date = new Date();
        let endDate: Date = new Date();
        if (parameter.h !== undefined) {
            hashtag = parameter.h;
        }
        if (parameter.s !== undefined) {
            startDate = new Date(parameter.s);
        }
        if (parameter.e !== undefined) {
            endDate = new Date(parameter.e);
        }

        const twitter: TwitterImpl = new TwitterImpl();
        if (!twitter.isSetAccessToken()) {
            twitter.auth();
        }
        const result = twitter.search(hashtag, startDate, endDate);
        ContentService.createTextOutput();
        const output = ContentService.createTextOutput();
        output.setMimeType(ContentService.MimeType.JSON);
        output.setContent(result);
        return output;
    }
}