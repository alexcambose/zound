import { Meteor } from 'meteor/meteor';
import { lastFMAPIKEY } from './config';

export class Track {
    static search = async track => {
        const url = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${track}&api_key=${lastFMAPIKEY}&format=json`;
        try {
            let res = await fetch(url);
            res = await res.json();
            return res.results.trackmatches.track;
        } catch (e) {
            throw new Meteor.Error('api-error', e);
        }
    };
    static getTrackInfo = async (track, artist) => {
        const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastFMAPIKEY}&artist=${artist}&track=${track}&format=json`;
        try {
            let res = await fetch(url);
            res = await res.json();
            if(res.track.wiki) {
                const summary = res.track.wiki.summary;
                res.track.wiki.summary = res.track.wiki.summary.substring(0, summary.indexOf('<a')) + '.';
            }
            return res.track;
        } catch (e) {
            throw new Meteor.Error('api-error', e);
        }
    };
}