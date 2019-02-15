const fs = require('fs');

function logEvery2Seconds(i) {
    setTimeout(() => {
        console.log('Infinite Loop Test n:', i);
        logEvery2Seconds(++i);
    }, 2000)
}

logEvery2Seconds(0);

let i = 0;
setInterval(() => {
    console.log('Infinite Loop Test interval n:', i++);
}, 2000)


