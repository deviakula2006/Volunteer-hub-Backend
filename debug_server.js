process.on('uncaughtException', (err) => {
    console.error('!!! UNCAUGHT EXCEPTION !!!');
    console.error(err.stack || err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!! UNHANDLED REJECTION !!!');
    console.error(reason);
    process.exit(1);
});

console.log('Starting server diagnostics (debug_server.js)...');
try {
    require('./server.js');
} catch (err) {
    console.error('!!! SYNTAX OR REQUIRE ERROR !!!');
    console.error(err.stack || err);
    process.exit(1);
}

// Keep the process alive for a bit to see if async errors happen
setTimeout(() => {
    console.log('Diagnostics: Server still alive after 10 seconds.');
}, 10000);
