import ITwitter, {SEARCH_TYPE} from "../../../src/twitter/iTwitter";
import TwitterImpl from "../../../src/twitter/twitterImpl";
import { advanceTo, clear } from 'jest-date-mock';

beforeAll(() => {
    // @ts-ignore
    PropertiesService.getScriptProperties! = jest.fn(() => {
        return {
            getProperty: jest.fn(() => {
                return ''
            })
        }
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
                [new Date(2020, 2, 1), new Date(2020,2,1), SEARCH_TYPE.STANDARD],
                [new Date(2020, 2, 1), new Date(2020,1,24), SEARCH_TYPE.STANDARD],
                // premium 30 day search is 30 days.
                [new Date(2020, 2, 1), new Date(2020,1,23), SEARCH_TYPE.PREMIUM_30DAY],
                [new Date(2020, 2, 1), new Date(2020,1,1), SEARCH_TYPE.PREMIUM_30DAY],
                // premium full archive search is more.
                [new Date(2020, 2, 1), new Date(2019,12,31), SEARCH_TYPE.PREMIUM_FULL_ARCHIVE],
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
});