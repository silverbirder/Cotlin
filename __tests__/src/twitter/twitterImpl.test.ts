import ITwitter from "../../../src/twitter/iTwitter";
import TwitterImpl from "../../../src/twitter/twitterImpl";

describe('Class: TwitterImpl', () => {
    describe('Method: TODO', () => {
        test('Assert: TODO', () => {
            // @ts-ignore
            PropertiesService.getScriptProperties! = jest.fn(() => {
                return {
                    getProperty: jest.fn(() => {
                    })
                }
            });
            // Arrange
            const twitter: ITwitter = new TwitterImpl('', '', []);
            // Act

            // Assert
            console.log(twitter);
        });
    })
});