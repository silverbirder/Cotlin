import IController, {IParameter} from "../../../src/controller/iController";
import ControllerImpl from "../../../src/controller/controllerImpl";
import ITwitter from "../../../src/twitter/iTwitter";
import TwitterMock from "../../../src/twitter/twitterMock";
import IArchive from "../../../src/archive/iArchive";
import ArchiveMock from "../../../src/archive/archiveMock";

describe('Class: ControllerImpl', () => {
    describe('Method: constructor', () => {
        test('Assert: TODO', () => {
            // Arrange
            const twitter: ITwitter = new TwitterMock();
            const archive: IArchive = new ArchiveMock();

            // Act
            const controller: IController = new ControllerImpl(twitter, archive);

            // Assert
            expect(controller).toBeTruthy();
        });
    });
    describe('Method: parseParams', () => {
        test('Assert: TODO', () => {
            // Arrange
            const twitter: ITwitter = new TwitterMock();
            const archive: IArchive = new ArchiveMock();
            const controller: IController = new ControllerImpl(twitter, archive);

            // Act
            const actualParesedParams: IParameter = controller.parseParams({parameter: {}});

            // Assert
            expect(actualParesedParams).toBeTruthy();
        });
    });
    describe('Method: run', () => {
        test('Assert: TODO', () => {
            // Arrange
            const twitter: ITwitter = new TwitterMock();
            const archive: IArchive = new ArchiveMock();
            const controller: IController = new ControllerImpl(twitter, archive);

            // Act
            const result:Array<any>  = controller.run();

            // Assert
            expect(result).toBeTruthy();
        });
    })
});