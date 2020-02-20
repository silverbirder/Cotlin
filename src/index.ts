import TwitterImpl from "./twitter/twitterImpl";
import ControllerImpl from "./controller/controllerImpl";

declare const global: {
    Twitter: any
    doGet(e: any): any
};

export function greet() {
    console.log('hello world');
}

const Get: any = ControllerImpl.Get;

global.Twitter = TwitterImpl;
global.doGet = Get;

export {
    TwitterImpl as Twitter,
    Get as doGet,
}