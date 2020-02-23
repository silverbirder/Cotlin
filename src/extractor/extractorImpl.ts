import IExtractor from "./iExtractor";

export default class ExtractorImpl implements IExtractor {
    rule: RegExp;

    constructor(rule: RegExp) {
        this.rule = rule;
    }

    extract(textList: Array<string>): Array<any> {
        const result: Array<any> = [];
        textList.forEach((text: string) => {
            const matchedText: RegExpMatchArray | null = text.match(this.rule);
            if (matchedText !== null) {
                result.push(matchedText[1]);
            }
        });
        const uniq: Array<string> = Array.from(new Set(result));
        return uniq;
    }
}