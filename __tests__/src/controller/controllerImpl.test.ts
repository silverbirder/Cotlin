import IController, {IParameter} from "../../../src/controller/iController";
import ControllerImpl from "../../../src/controller/controllerImpl";
import ITwitter from "../../../src/twitter/iTwitter";
import TwitterMock from "../../../src/twitter/twitterMock";
import IArchive from "../../../src/archive/iArchive";
import ArchiveMock from "../../../src/archive/archiveMock";
import {advanceTo, clear} from "jest-date-mock";

describe('Class: ControllerImpl', () => {
    describe('Method: constructor', () => {
        test('Assert: Controller have twitter and archive', () => {
            // Arrange
            const twitter: ITwitter = new TwitterMock();
            const archive: IArchive = new ArchiveMock();
            const expectProperties = ['twitter', 'archive'];

            // Act
            const actualController: IController = new ControllerImpl(twitter, archive);

            // Assert
            expectProperties.forEach((expectProperty: string) => {
                expect(actualController).toHaveProperty(expectProperty);
            })
        });
    });
    describe('Method: parseParams', () => {
        test.each([
            // argsParams, expectedParams
            [
                {},
                {
                    keyword: '',
                    since: new Date(2020, 2, 1),
                    until: new Date(2020, 2, 2)
                }
            ],
            [
                {
                    q: 'keyword'
                },
                {
                    keyword: 'keyword',
                    since: new Date(2020, 2, 1),
                    until: new Date(2020, 2, 2)
                }
            ],
            [
                {
                    s: '2020-02-01'
                },
                {
                    keyword: '',
                    since: new Date(2020, 1, 1),
                    until: new Date(2020, 2, 2)
                }
            ],
            [
                {
                    u: '2020-03-03'
                },
                {
                    keyword: '',
                    since: new Date(2020, 2, 1),
                    until: new Date(2020, 2, 3)
                }
            ],
            [
                {
                    q: 'keyword',
                    s: '2020-01-01',
                    u: '2020-01-07'
                },
                {
                    keyword: 'keyword',
                    since: new Date(2020, 0, 1),
                    until: new Date(2020, 0, 7)
                }
            ],
        ])(`Assert: argsParams(%o) to ParsedParams(%o)`, (argsParams, expectedParams) => {
            // Arrange
            const now = new Date(2020, 2, 2);
            advanceTo(now);
            const twitter: ITwitter = new TwitterMock();
            const archive: IArchive = new ArchiveMock();
            const controller: IController = new ControllerImpl(twitter, archive);

            // Act
            const actualParams: IParameter = controller.parseParams(argsParams);

            // Assert
            expect(expectedParams).toStrictEqual(actualParams);
            clear();
        });
    });
    describe('Method: run', () => {
        test('Assert: TODO', () => {
            // Arrange
            const twitter: ITwitter = new TwitterMock();
            const archive: IArchive = new ArchiveMock();
            const controller: IController = new ControllerImpl(twitter, archive);

            // Act
            const result: Array<any> = controller.run();

            // Assert
            expect(result).toBeTruthy();
        });
    })
});