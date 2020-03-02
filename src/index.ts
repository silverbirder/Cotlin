import TwitterImpl from "./twitter/twitterImpl";
import ControllerImpl from "./controller/controllerImpl";
import ExtractorImpl from "./extractor/extractorImpl";

declare const global: {
    Twitter: any
    Controller: any
    Extractor: any
};

export function greet() {
    console.log('hello world');
}

global.Twitter = TwitterImpl;
global.Controller = ControllerImpl;
global.Extractor = ExtractorImpl;

export {
    TwitterImpl as Twitter,
    ControllerImpl as Controller,
    ExtractorImpl as Extractor
}