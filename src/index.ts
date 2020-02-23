import TwitterImpl from "./twitter/twitterImpl";
import ControllerImpl from "./controller/controllerImpl";
import CrawlerImpl from "./crawler/crawlerImpl";
import ExtractorImpl from "./extractor/extractorImpl";

declare const global: {
    Twitter: any
    Controller: any
    Crawler: any
    Extractor: any
};

export function greet() {
    console.log('hello world');
}

global.Twitter = TwitterImpl;
global.Controller = ControllerImpl;
global.Crawler = CrawlerImpl;
global.Extractor = ExtractorImpl;

export {
    TwitterImpl as Twitter,
    ControllerImpl as Controller,
    CrawlerImpl as Crawler,
    ExtractorImpl as Extractor
}