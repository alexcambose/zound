import { Meteor } from 'meteor/meteor';
import { lastFMAPIKEY } from './config';

export class Track {
    static search = async track => {
        const url = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${track}&api_key=${lastFMAPIKEY}&format=json`;
        try {
            let res = await fetch(url);
            res = await res.json();
            return res;
        } catch (e) {
            throw new Meteor.Error('api-error', e);
        }
    }
}