import IController from "./iController";
import TwitterImpl from "../twitter/twitterImpl";
import AppsScriptHttpRequestEvent = GoogleAppsScript.Events.AppsScriptHttpRequestEvent;

export default class ControllerImpl implements IController {
    doGet(e: AppsScriptHttpRequestEvent): any {
        Logger.log(e);
        const twitter: TwitterImpl = new TwitterImpl();
        twitter.auth();
        const result = twitter.search('devsumi', new Date(2020, 1, 13), new Date(2020, 1, 14));
        ContentService.createTextOutput();
        const output = ContentService.createTextOutput();
        output.setMimeType(ContentService.MimeType.JSON);
        output.setContent(result);
        return output;
    }
}