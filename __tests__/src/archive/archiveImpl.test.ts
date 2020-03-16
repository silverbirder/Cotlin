import IArchive from "../../../src/archive/iArchive";
import ArchiveImpl from "../../../src/archive/archiveImpl";
import {IResponseStack} from "../../../src/twitter/iTwitter";

describe('Class: ArchiveImpl', () => {
    describe('Method: extract', () => {
        const responseStacks: Array<IResponseStack> = [
            {
                id: '1',
                url: 'https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial',
            },
            {
                id: '2',
                url: 'https://www.slideshare.net/suhasmallya/sample-slidesharepresentation',
            }
        ];
        describe('Args: no domain rule', () => {
            test('Assert: extract no data', () => {
                // Arrange
                const rule: RegExp = new RegExp('^$');
                const archive: IArchive = new ArchiveImpl(rule);
                const expectExtractedLength: number = 0;

                // Act
                const actualExtractedLength = archive.extract(responseStacks).length;

                // Assert
                expect(expectExtractedLength).toBe(actualExtractedLength);
            });
        });
        describe('Args: 1 domain rule', () => {
            test('Assert: extract data of 1 domain', () => {
                // Arrange
                const rule: RegExp = new RegExp('^https://speakerdeck.com');
                const archive: IArchive = new ArchiveImpl(rule);
                const expectExtractedLength: number = 1;

                // Act
                const actualExtractedLength = archive.extract(responseStacks).length;

                // Assert
                expect(expectExtractedLength).toBe(actualExtractedLength);
            });
        });
        describe('Args: multi domain rule', () => {
            test('Assert: extract data of multi domain', () => {
                // Arrange
                const rule: RegExp = new RegExp('^https://speakerdeck.com|https://www.slideshare.net');
                const archive: IArchive = new ArchiveImpl(rule);
                const expectExtractedLength: number = 2;

                // Act
                const actualExtractedLength = archive.extract(responseStacks).length;

                // Assert
                expect(expectExtractedLength).toBe(actualExtractedLength);
            });
        });
    });
    describe('Method: compress', () => {
        describe('Args: not duplicate url', () => {
           test('Assert: not compress', () => {
               const responseStacks: Array<IResponseStack> = [
                   {
                       id: '1',
                       url: 'https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial',
                   },
                   {
                       id: '2',
                       url: 'https://www.slideshare.net/suhasmallya/sample-slidesharepresentation',
                   }
               ];
               // Arrange
               const rule: RegExp = new RegExp('');
               const archive: IArchive = new ArchiveImpl(rule);
               const expectCompressedLength: number = responseStacks.length;

               // Act
               const actualCompressedLength = archive.compress(responseStacks).length;

               // Assert
               expect(expectCompressedLength).toBe(actualCompressedLength);
           });
        });
        describe('Args: duplicate url', () => {
            test('Assert: compress', () => {
                const responseStacks: Array<IResponseStack> = [
                    {
                        id: '1',
                        url: 'https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial',
                    },
                    {
                        id: '2',
                        url: 'https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial',
                    }
                ];
                // Arrange
                const rule: RegExp = new RegExp('');
                const archive: IArchive = new ArchiveImpl(rule);
                const expectCompressedLength: number = 1;

                // Act
                const actualCompressedLength = archive.compress(responseStacks).length;

                // Assert
                expect(expectCompressedLength).toBe(actualCompressedLength);
            });
        });
        describe('Args: hash and query parameter url', () => {
            test('Assert: compress', () => {
                const responseStacks: Array<IResponseStack> = [
                    {
                        id: '1',
                        url: 'https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial?hoge=1',
                    },
                    {
                        id: '2',
                        url: 'https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial#var',
                    }
                ];
                // Arrange
                const rule: RegExp = new RegExp('');
                const archive: IArchive = new ArchiveImpl(rule);
                const expectCompressedLength: number = 1;

                // Act
                const actualCompressedLength = archive.compress(responseStacks).length;

                // Assert
                expect(expectCompressedLength).toBe(actualCompressedLength);
            });
        });
    });
});