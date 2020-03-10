import IController, {IParameter} from "./iController";
import ITwitter, {IResponseStack, SEARCH_TYPE} from "../twitter/iTwitter";
import IArchive, {ICompressed} from "../archive/iArchive";

export default class ControllerImpl implements IController {
    twitter: ITwitter;
    archive: IArchive;

    constructor(twitter: ITwitter, archive: IArchive) {
        this.twitter = twitter;
        this.archive = archive;
    }

    parseParams(parameter: { q?: string, s?: string, u?: string }): IParameter {
        let keyword: string = '';
        let since: Date = new Date();
        since.setDate(since.getDate() - 1);
        since.setHours(0);
        since.setMinutes(0);
        since.setSeconds(0);
        let until: Date = new Date();
        until.setHours(0);
        until.setMinutes(0);
        until.setSeconds(0);

        if (parameter.q !== undefined) {
            keyword = parameter.q;
        }
        if (parameter.s !== undefined) {
            const sinceAry: Array<string> = parameter.s.split('-');
            if (sinceAry.length === 3) {
                since = this._parseStrDateToDate(parameter.s);
            }
        }
        if (parameter.u !== undefined) {
            const untilAry: Array<string> = parameter.u.split('-');
            if (untilAry.length === 3) {
                until = this._parseStrDateToDate(parameter.u);
            }
        }
        return {keyword: keyword, since: since, until: until}
    }

    _parseStrDateToDate(ds: string): Date {
        const ary: Array<string> = ds.split('-');
        const dd: Date = new Date(parseInt(ary[0]), parseInt(ary[1]) - 1, parseInt(ary[2]), 0, 0, 0);
        return dd;
    }

    run(): Array<any> {
        let result: Array<IResponseStack> = [];
        if (!this.twitter.isSetAccessToken()) {
            if (!this.twitter.auth()) {
                return result;
            }
        }
        switch (this.twitter.whichType()) {
            case SEARCH_TYPE.STANDARD:
                result = this.twitter.standardSearch();
                break;
            case SEARCH_TYPE.PREMIUM_30DAY:
                result = this.twitter.premium30DaySearch();
                break;
            case SEARCH_TYPE.PREMIUM_FULL_ARCHIVE:
                result = this.twitter.premiumFullArchiveSearch();
                break;
        }
        const extractedResult: Array<IResponseStack> = this.archive.extract(result);
        const compressedResult: Array<ICompressed> = this.archive.compress(extractedResult);
        return compressedResult;
    }
}