import ITwitter from "../twitter/iTwitter";
import IArchive from "../archive/iArchive";

export default interface IController {
    twitter: ITwitter;
    archive: IArchive;

    parseParams(e: any): IParameter;

    run(): Array<any>;
}

export interface IParameter {
    keyword: string;
    since: Date;
    until: Date;
}