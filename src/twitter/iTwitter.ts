export default interface ITwitter {
    keyword: string;
    since: Date;
    until: Date;
    domains: Array<string>;

    isSetAccessToken(): boolean;

    auth(): boolean;

    whichType(): SEARCH_TYPE;

    standardSearch(): Array<IResponseStack>;

    premium30DaySearch(): Array<IResponseStack>;

    premiumFullArchiveSearch(): Array<IResponseStack>;
}

export interface ISearchResponse {
    statuses: Array<IStatus>,
    search_metadata: {
        next_results: string
    }
}

export interface IStatus {
    id_str: string,
    entities: IEntities
}

export interface IEntities {
    urls: Array<{
        expanded_url: string;
    }>
}
export interface IPremiumSearchResponse {
    results: Array<IStatus>,
    next: string,
}

export interface IPayload {
    query: string,
    fromDate: string,
    toDate: string,
    next?: string,
}

export interface IResponseStack {
    id: string,
    url: string,
}

export enum SEARCH_TYPE {
    STANDARD,
    PREMIUM_30DAY,
    PREMIUM_FULL_ARCHIVE,
}