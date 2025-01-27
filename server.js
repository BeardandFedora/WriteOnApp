/* 
 * LOAD APPLICATION MONITORING.
 */
// Load Newrelic
require('newrelic');


/* 
 * LOAD SERVER DEPEDENCIES
 */
var cluster = require('cluster');
var no_cluster = 1;
/* 
 * LOAD APPLICATIONS
 */
var app = require('./writeon.server');


/* 
 * NODE CLUSTERING
 */
// To turn off clustering, set $ process.env.NO_CLUSTER=1 
if(!process.env.NO_CLUSTER && !no_cluster && cluster.isMaster) {
    // Count the machine's CPUs 
    var count = require('os').cpus().length;
    // Create a worker for each CPU
    for(var i = 0; i < count; i++) {
        cluster.fork();
    }
    cluster.on('exit', function() {
        console.log('Worker died. Spawning a new process...');
        cluster.fork();
    });
    cluster.on('fork', function(worker) {
        console.log('Worker ' + worker.id + ' is now running.');
    });
} else {
    // Listen on port 3000
    var port = process.env.PORT || 3000;
    app.listen(port, null, function() {
        console.log('Server started: http://localhost:' + port);
    });
}