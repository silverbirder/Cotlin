import ITwitter, {IResponseStack, SEARCH_TYPE} from "../../../src/twitter/iTwitter";
import TwitterImpl from "../../../src/twitter/twitterImpl";
import {advanceTo, clear} from 'jest-date-mock';
import * as path from "path";
import * as fs from "fs";

beforeEach(() => {
    // @ts-ignore
    PropertiesService.getScriptProperties! = jest.fn(() => {
        return {
            getProperty: jest.fn(() => {
                return ''
            }),
            setProperty: jest.fn(() => {
                return true
            })
        }
    });
    Utilities.base64Encode = jest.fn(() => {
        return ''
    });
    // @ts-ignore
    UrlFetchApp.fetch = jest.fn(() => {
        return {
            getContentText: jest.fn(() => {
                return '{}';
            })
        };
    });
    // @ts-ignore
    Logger.log = jest.fn(() => {
        return ''
    });
});

describe('Class: TwitterImpl', () => {
    describe('Method: construct', () => {
        describe('Data: domains = ["google.com"]', () => {
            test('Assert: twitter.domains = ["google.com"]', () => {
                // Arrange
                const domains: Array<string> = ['google.com'];

                // Act
                const twitter: ITwitter = new TwitterImpl('', '', domains);

                // Assert
                expect(domains).toBe(twitter.domains);
            });
        });
    });
    describe('Method: whichType', () => {
        describe('Data: Parameterized', () => {
            test.each([
                // now, since, expected
                // standard search is 7 days.
                [new Date(2020, 2, 1), new Date(2020, 2, 1), SEARCH_TYPE.STANDARD],
                [new Date(2020, 2, 1), new Date(2020, 1, 24), SEARCH_TYPE.STANDARD],
                // premium 30 day search is 30 days.
                [new Date(2020, 2, 1), new Date(2020, 1, 23), SEARCH_TYPE.PREMIUM_30DAY],
                [new Date(2020, 2, 1), new Date(2020, 1, 1), SEARCH_TYPE.PREMIUM_30DAY],
                // premium full archive search is more.
                [new Date(2020, 2, 1), new Date(2019, 12, 31), SEARCH_TYPE.PREMIUM_FULL_ARCHIVE],
            ])(`Assert: between  now(%o) and since(%o) -> expected (%s)`, (now, since, expected) => {
                // Arrange
                const twitter: ITwitter = new TwitterImpl('', '', []);
                advanceTo(now);
                twitter.since = since;
                const expectedWhichType: SEARCH_TYPE = expected;

                // Act
                const actualWhichType: SEARCH_TYPE = twitter.whichType();

                // Assert
                expect(expectedWhichType).toBe(actualWhichType);
                clear();
            });
        });
    });
    describe('Method: isSetAccessToken', () => {
        describe('Data: not set access token', () => {
            test('Assert: false', () => {
                // Arrange
                const twitter: ITwitter = new TwitterImpl('', '', []);
                const expectedSetAccessToken: boolean = false;

                // Act
                const actualSetAccessToken: boolean = twitter.isSetAccessToken();

                // Assert
                expect(expectedSetAccessToken).toBe(actualSetAccessToken);
            });
        });
        describe('Data: set access token', () => {
            test('Assert: false', () => {
                // Arrange
                // @ts-ignore
                PropertiesService.getScriptProperties! = jest.fn(() => {
                    return {
                        getProperty: jest.fn(() => {
                            return 'ACCESS_TOKEN'
                        })
                    }
                });
                const twitter: ITwitter = new TwitterImpl('', '', []);
                const expectedSetAccessToken: boolean = true;

                // Act
                const actualSetAccessToken: boolean = twitter.isSetAccessToken();

                // Assert
                expect(expectedSetAccessToken).toBe(actualSetAccessToken);
            });
        });
    });
    describe('Method: auth', () => {
        describe('Throw: false', () => {
            test('Assert: auth = true', () => {
                // Arrange
                const twitter: ITwitter = new TwitterImpl('', '', []);
                const expectedAuthResult: boolean = true;

                // Act
                const actualAuthResult: boolean = twitter.auth();

                // Assert
                expect(expectedAuthResult).toBe(actualAuthResult);
            });
        });
        describe('Throw: true', () => {
            test('Assert: auth = false', () => {
                // Arrange
                // @ts-ignore
                UrlFetchApp.fetch = jest.fn(() => {
                    return {
                        getContentText: jest.fn(() => {
                            throw Error();
                        })
                    };
                });
                const twitter: ITwitter = new TwitterImpl('', '', []);
                const expectedAuthResult: boolean = false;

                // Act
                const actualAuthResult: boolean = twitter.auth();

                // Assert
                expect(expectedAuthResult).toBe(actualAuthResult);
            });
        });
    });
    describe('Method: standardSearch', () => {
        describe('Data: 2 data', () => {
            test('Assert: response data length = 2', () => {
                // Arrange
                // @ts-ignore
                UrlFetchApp.fetch = jest.fn().mockImplementationOnce(() => {
                    return {
                        getContentText: jest.fn(() => {
                            return fs.readFileSync(path.resolve('./__tests__/src/twitter/data/standard/next_results_response.json'), 'utf-8');
                        })
                    };
                }).mockImplementationOnce(() => {
                    return {
                        getContentText: jest.fn(() => {
                            return fs.readFileSync(path.resolve('./__tests__/src/twitter/data/standard/not_next_results_response.json'), 'utf-8');
                        })
                    };
                });
                const twitter: ITwitter = new TwitterImpl('', '', ['slideshare.net']);
                const expectedResults: number = 2;

                // Act
                const result: Array<IResponseStack> = twitter.standardSearch();
                const actualResults: number = result.length;

                // Assert
                expect(expectedResults).toBe(actualResults);
                // @ts-ignore
                expect(UrlFetchApp.fetch.mock.calls[0][0]).toContain(twitter.SEARCH_STANDARD_URL)
            });
        });
    });
    describe('Method: premiumSearch', () => {
        describe('Data: 2 data', () => {
            const setUpPremiumSearch = () => {
                // @ts-ignore
                UrlFetchApp.fetch = jest.fn().mockImplementationOnce(() => {
                    return {
                        getContentText: jest.fn(() => {
                            return fs.readFileSync(path.resolve('./__tests__/src/twitter/data/premium/next_results_response.json'), 'utf-8');
                        })
                    };
                }).mockImplementationOnce(() => {
                    return {
                        getContentText: jest.fn(() => {
                            return fs.readFileSync(path.resolve('./__tests__/src/twitter/data/premium/not_next_results_response.json'), 'utf-8');
                        })
                    };
                });
            };
            describe('Method: premium30DaySearch', () => {
                test('Assert: response data length = 2', () => {
                    // Arrange
                    setUpPremiumSearch();
                    const twitter: ITwitter = new TwitterImpl('', '', []);
                    const expectedResults: number = 2;

                    // Act
                    const result: Array<IResponseStack> = twitter.premium30DaySearch();
                    const actualResults: number = result.length;

                    // Assert
                    expect(expectedResults).toBe(actualResults);
                    // @ts-ignore
                    expect(UrlFetchApp.fetch.mock.calls[0][0]).toBe(twitter.SEARCH_30_URL);
                });
            });
            describe('Method: premiumFullArchiveSearch', () => {
                test('Assert: response data length = 2', () => {
                    // Arrange
                    setUpPremiumSearch();
                    const twitter: ITwitter = new TwitterImpl('', '', []);
                    const expectedResults: number = 2;

                    // Act
                    const result: Array<IResponseStack> = twitter.premiumFullArchiveSearch();
                    const actualResults: number = result.length;

                    // Assert
                    expect(expectedResults).toBe(actualResults);
                    // @ts-ignore
                    expect(UrlFetchApp.fetch.mock.calls[0][0]).toBe(twitter.SEARCH_ARCH_URL);
                });
            });
        });
    });
});