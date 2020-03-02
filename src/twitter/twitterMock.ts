import ITwitter, {SEARCH_TYPE} from "./iTwitter";

export default class TwitterMock implements ITwitter {
    domains: Array<string> = [];
    keyword: string = '';
    since: Date = new Date();
    until: Date = new Date();

    auth(): boolean {
        return false;
    }

    isSetAccessToken(): boolean {
        return false;
    }

    isWithinStandard(): boolean {
        return false;
    }

    premiumSearch(): any {
    }

    standardSearch(): any {
    }

    premium30DaySearch(): any {
    }

    premiumFullArchiveSearch(): any {
    }

    whichType(): SEARCH_TYPE {
        return SEARCH_TYPE.STANDARD;
    }

}