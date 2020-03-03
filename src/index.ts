import TwitterImpl from "./twitter/twitterImpl";
import ControllerImpl from "./controller/controllerImpl";
import ArchiveImpl from "./archive/archiveImpl";

declare const global: {
    Twitter: any
    Controller: any
    Archive: any
};

global.Twitter = TwitterImpl;
global.Controller = ControllerImpl;
global.Archive = ArchiveImpl;

export {
    TwitterImpl as Twitter,
    ControllerImpl as Controller,
    ArchiveImpl as Archive
}