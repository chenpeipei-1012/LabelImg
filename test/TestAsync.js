/*
/!*
async function testAsync() {
    console.log('调用异步函数')
    return "hello async";//如果 async 函数没有返回值，又该如何？很容易想到，它会返回 Promise.resolve(undefined)
}
//所以在没有 await 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句
console.log(testAsync());  //Promise { 'hello async' }, async 函数返回的是一个 Promise 对象

testAsync().then(v => {
    console.log(v);    // 输出 hello async,,then() 链来处理这个 Promise 对象
});*!/

function getSomething() {
    return "something";
}

async function testAsync() {
    return Promise.resolve("hello async");
}

async function test() {
    const v2 = testAsync();
    const v1 = await getSomething();
    console.log(v1, v2);


}
test();
*/
//不用 async/await
/*function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

takeLongTime().then(v => {
    console.log("got", v);
});*/


// 改用 async/await: async/await 的优势在于处理 then 链
/*
function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

async function test() {
    const v = await takeLongTime();
    console.log(v);
}

test();*/



/**
 * 传入参数 n，表示这个函数执行的时间（毫秒）
 * doIt() 顺序执行了三个步骤，一共用了 300 + 500 + 700 = 1500 毫秒，和 console.time()/console.timeEnd() 计算的结果一致。
 * 执行的结果是 n + 200，这个值将用于下一步骤
 */
function takeLongTime(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve(n + 200), n);
    });
}

function step1(n) {
    console.log(`step1 with ${n}`);
    return takeLongTime(n);
}

function step2(n) {
    console.log(`step2 with ${n}`);
    return takeLongTime(n);
}

function step3(n) {
    console.log(`step3 with ${n}`);
    return takeLongTime(n);
}

/*
function doIt() {
    console.time("doIt");
    const time1 = 300;
    step1(time1)
        .then(time2 => step2(time2))
        .then(time3 => step3(time3))
        .then(result => {
            console.log(`result is ${result}`);
            console.timeEnd("doIt");
        });
}

doIt();*/

// c:\var\test>node --harmony_async_await .
// step1 with 300
// step2 with 500
// step3 with 700
// result is 900
// doIt: 1507.251ms


// 如果用 async/await 来实现呢，会是这样
async function doIt() {
    console.time("doIt");
    const time1 = 300;
    const time2 = step1(time1);
    const time3 = step2(time2);
    const result = step3(time3);
    console.log(`result is ${result}`);
    console.timeEnd("doIt");
}

doIt();
// 如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。
// 如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。
// 输出，使用await
// step1 with 300
//     step2 with 500
//     step3 with 700
//     result is 900
// doIt: 1506.208ms

//不使用await，输出
// step1 with 300
//     step2 with [object Promise]
//     step3 with [object Promise]
//     result is [object Promise]
// doIt: 2.672ms
