import TwitterImpl from "./twitter/twitterImpl";
import ControllerImpl from "./controller/controllerImpl";

declare const global: {
    Twitter: any
    doGet(e: any): any
};

export function greet() {
    console.log('hello world');
}

const doGet: any = new ControllerImpl().doGet;

global.Twitter = TwitterImpl;
global.doGet = doGet;

export {
    TwitterImpl as Twitter,
    doGet as doGet,
}