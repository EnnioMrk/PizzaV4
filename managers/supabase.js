import { createClient } from '@supabase/supabase-js';
import log from './logger.js';

export default class sbManager {
    constructor() {
        this.sb = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        //log(this.supabase);
        //log('debug', this.sb, 1, 1);
    }
}
