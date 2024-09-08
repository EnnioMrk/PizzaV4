import dotenv from 'dotenv';
dotenv.config();
import webServer from './managers/web-server.js';
import sbManager from './managers/supabase.js';
import pbManager from './managers/pocketbase.js';
import config from './config.js';
import log from './managers/logger.js';

global.config = config;

log('info', 'Starting server...');

const web_server = new webServer();
const sb_manager = new sbManager();
const pb_manager = new pbManager();

web_server.start(pb_manager.pb);

process
    .on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err);
        console.log(err.stack);
    })
    .on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at:', p, 'reason:', reason);
    });
