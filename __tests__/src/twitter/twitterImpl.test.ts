import ITwitter from "../../../src/twitter/iTwitter";
import TwitterImpl from "../../../src/twitter/twitterImpl";

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
    })
});