import IController, {IParameter} from "./iController";
import IArchive from "../archive/iArchive";
import ITwitter from "../twitter/iTwitter";
import ArchiveMock from "../archive/archiveMock";
import TwitterMock from "../twitter/twitterMock";

export default class ControllerMock implements IController {
    parseParams(e: any): IParameter {
        return {keyword: '', since: new Date(), until: new Date()};
    }

    run(): Array<any> {
        return [];
    }

    archive: IArchive;
    twitter: ITwitter;

    constructor() {
        this.archive = new ArchiveMock();
        this.twitter = new TwitterMock();
    }
}