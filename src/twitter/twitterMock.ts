import ITwitter, {SEARCH_TYPE} from "./iTwitter";

export default class TwitterMock implements ITwitter {
    domains: Array<string> = [];
    keyword: string = '';
    since: Date = new Date();
    until: Date = new Date();
    SEARCH_30_URL: string = '';
    SEARCH_ARCH_URL: string = '';
    SEARCH_STANDARD_URL: string = '';

    auth(): boolean {
        return true;
    }

    isSetAccessToken(): boolean {
        return false;
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