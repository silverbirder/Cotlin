import IExtractor from "./iExtractor";

export default class ExtractorImpl implements IExtractor {
    rule: RegExp;

    constructor(rule: RegExp) {
        this.rule = rule;
    }

    extract(textList: Array<{id: number, url: string}>): Array<any> {
        const result: Array<any> = [];
        textList.forEach((text: {id: number, url: string}) => {
            const matchedText: RegExpMatchArray | null = text.url.match(this.rule);
            if (matchedText !== null) {
                result.push(text);
            }
        });
        return result;
    }
    compress(textList: Array<{id: number, url: string}>): any {
        const result: any = {};
        textList.forEach((text: {id: number, url: string}) => {
            if (!(text.url in result)) {
                result[text.url] = [];
            }
            result[text.url].push(text.id);
        });
        const reverse: Array<any> = [];
        Object.keys(result).forEach(function (key) {
            reverse.push({
                url: key,
                ids: result[key]
            });
        });
        return reverse;
    }
}