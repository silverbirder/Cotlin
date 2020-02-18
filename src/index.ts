declare const global: {
    Sample: any
};

export function greet() {
    console.log('hello world');
}

global.Sample = greet;