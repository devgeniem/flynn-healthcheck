const request = require('request');
const moment  = require('moment-timezone');
const fs      = require('fs');

new (class HealthCheck {
    constructor() {
        fs.readFile( 'config/config.json', 'utf8', ( error, data ) => {
            if ( error ) {
                this.slack( 'can\'t read config file (' + error + '), aborting.', '', () => { process.exit(1); } );
                console.log( error );
            }
            else {
                var config = JSON.parse( data );
                
                this.clusters       = config.clusters;
                this.slack_url      = config.slack_url;
                this.interval       = config.interval;
                this.okay_interval  = config.okay_interval;
                this.count          = config.okay_interval;

                this.run();
            }
        });
    }

    run() {
        this.clusters.forEach( ( cluster ) => {
            request( cluster.url, ( error, response, body ) => {
                var data = JSON.parse( body );

                if ( this.count == this.okay_interval && data.data.status == 'healthy' ) {
                    this.slack( 'health checks are running okay.', cluster.name );
                    this.count = 0;
                }

                Object.keys( data.data.detail ).forEach( ( key ) => {
                    var health = data.data.detail[ key ].status;

                    if ( health != 'healthy' ) {
                        this.slack( 'component ' + key + ' is ' + health + '. @channel', cluster.name );
                    }
                });

                this.count++;
            });
        });

        setInterval( this.run, this.interval * 1000 );
    }

    slack( message, cluster, callback ) {
        request({
            url: this.slack_url,
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                text: '*' + moment().tz('Europe/Helsinki').format('DD.MM.YYYY HH.mm.ss') + '* ' + cluster + ': ' + message,
                link_names: 1
            })
        }, callback );
    }
})();