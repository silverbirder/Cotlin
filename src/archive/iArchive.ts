import {IResponseStack} from "../twitter/iTwitter";

export default interface IArchive {
    extract(responseStacks: Array<IResponseStack>): Array<IResponseStack>;

    compress(responseStacks: Array<IResponseStack>): Array<ICompressed>;
}

export interface ICompressed {
    url: string;
    idList: Array<string>;
}