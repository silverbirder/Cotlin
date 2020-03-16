import IArchive, {ICompressed} from "./iArchive";
import {IResponseStack} from "../twitter/iTwitter";

export default class ArchiveImpl implements IArchive {
    _rule: RegExp;

    constructor(rule: RegExp) {
        this._rule = rule;
    }

    extract(responseStacks: Array<IResponseStack>): Array<IResponseStack> {
        const result: Array<IResponseStack> = [];
        responseStacks.forEach((responseStack: IResponseStack) => {
            const matchedText: RegExpMatchArray | null = responseStack.url.match(this._rule);
            if (matchedText === null) {
                return;
            }
            result.push(responseStack);
        });
        return result;
    }

    compress(responseStacks: Array<IResponseStack>): Array<ICompressed> {
        const dict: any = {};
        const deleteParamsReg: RegExp = new RegExp(`(#|\\?).+$`);
        responseStacks.forEach((responseStack: IResponseStack) => {
            const normalizedUrl: string = responseStack.url.replace(deleteParamsReg, '');
            if (!(normalizedUrl in dict)) {
                dict[normalizedUrl] = [];
            }
            dict[normalizedUrl].push(responseStack.id);
        });
        const result: Array<ICompressed> = [];
        Object.keys(dict).forEach(function (key) {
            result.push({
                url: key,
                idList: dict[key]
            });
        });
        return result;
    }
}