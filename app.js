// jshint esversion: 11
// jshint -W083

import { getLyrics } from 'genius-lyrics-api';
import fetch from 'node-fetch';
import 'colors';

var pages = 3;
var perPage = 200;
var words = ['high', 'low', 'sky'];
var username  = 'XXXXXXXXXXXXXXXXXXXXXXXX';
var LastFmKey = 'XXXXXXXXXXXXXXXXXXXXXXXX';
var GeniusKey = 'XXXXXXXXXXXXXXXXXXXXXXXX';

async function Hunt() {
    console.log();
    for (var page = 1; page <= pages; page++) {
        var url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LastFmKey}&format=json&limit=${perPage}&page=${page}`;
        const response = await fetch(url);
        const songs = (await response.json()).recenttracks.track;

        for (var i = 0; i < songs.length; i++) {
            const options = {
                apiKey: GeniusKey,
                title: songs[i].name,
                artist: songs[i].artist['#text'],
                optimizeQuery: true
            };

            let lyrics = await getLyrics(options);
            words.forEach(word => {
                if (lyrics && lyrics.includes(word))
                    console.log(`${options.title}, ${options.artist}`.green);
            });
        }
    }
}

Hunt();