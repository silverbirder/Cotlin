import IArchive, {ICompressed} from "./iArchive";
import {IResponseStack} from "../twitter/iTwitter";

export default class ArchiveMock implements IArchive {
    extract(responseStacks: Array<IResponseStack>): Array<IResponseStack> {
        return []
    };

    compress(responseStacks: Array<IResponseStack>): Array<ICompressed> {
        return [];
    };

}