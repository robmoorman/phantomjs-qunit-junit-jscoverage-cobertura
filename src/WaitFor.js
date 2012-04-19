/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean
 * @param onReady what to do when testFx condition is fulfilled
 * @param timeOutMsec the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMsec) {

    var maxTimeOutMsec = timeOutMsec ? timeOutMsec : 3001; //< Default Max Timout is 3s
    var start = new Date().getTime();
    var condition = false;
    var interval = setInterval(function() {

        var elapsedTime = new Date().getTime() - start;

        if ((elapsedTime < maxTimeOutMsec) && !condition) {

            // If not time-out yet and condition not yet fulfilled
            condition = testFx();

        } else {

            clearInterval(interval);

            // If condition still not fulfilled (timeout but condition is 'false')
            if (!condition)  throw 'waitFor() timeout';

            console.log('Page load time: ' + elapsedTime + 'ms.');
            onReady();

        }

    }, 250);

};