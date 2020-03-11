import IController, {IParameter} from "../../../src/controller/iController";
import ControllerImpl from "../../../src/controller/controllerImpl";
import ITwitter, {SEARCH_TYPE} from "../../../src/twitter/iTwitter";
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
        describe('Data: auth = false', () => {
            test('Assert: response = []', () => {
                // Arrange
                const twitter: ITwitter = new TwitterMock();
                twitter.auth = jest.fn(() => {
                    return false;
                });
                const archive: IArchive = new ArchiveMock();
                const controller: IController = new ControllerImpl(twitter, archive);
                const expectedResponse: Array<any> = [];

                // Act
                const actualResponse: Array<any> = controller.run();

                // Assert
                expect(expectedResponse).toStrictEqual(actualResponse);
            });
        });
        describe('Data: auth = true', () => {
            describe('Data: whichType = standard', () => {
                test('Assert: call standard search', () => {
                    // Arrange
                    const twitter: ITwitter = new TwitterMock();
                    twitter.whichType = jest.fn(()=> {
                        return  SEARCH_TYPE.STANDARD;
                    });
                    twitter.standardSearch = jest.fn();
                    const archive: IArchive = new ArchiveMock();
                    const controller: IController = new ControllerImpl(twitter, archive);

                    // Act
                    controller.run();

                    // Assert
                    expect(twitter.standardSearch).toBeCalled();
                });
            });
            describe('Data: whichType = premium 30day', () => {
                test('Assert: call premium 30day search', () => {
                    // Arrange
                    const twitter: ITwitter = new TwitterMock();
                    twitter.whichType = jest.fn(()=> {
                        return  SEARCH_TYPE.PREMIUM_30DAY;
                    });
                    twitter.premium30DaySearch = jest.fn();
                    const archive: IArchive = new ArchiveMock();
                    const controller: IController = new ControllerImpl(twitter, archive);

                    // Act
                    controller.run();

                    // Assert
                    expect(twitter.premium30DaySearch).toBeCalled();
                });
            });
            describe('Data: whichType = premium full archive', () => {
                test('Assert: call premium premium full archive search', () => {
                    // Arrange
                    const twitter: ITwitter = new TwitterMock();
                    twitter.whichType = jest.fn(()=> {
                        return  SEARCH_TYPE.PREMIUM_FULL_ARCHIVE;
                    });
                    twitter.premiumFullArchiveSearch = jest.fn();
                    const archive: IArchive = new ArchiveMock();
                    const controller: IController = new ControllerImpl(twitter, archive);

                    // Act
                    controller.run();

                    // Assert
                    expect(twitter.premiumFullArchiveSearch).toBeCalled();
                });
            });
        });
    })
});