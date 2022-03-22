// jshint esversion: 11
// jshint -W083

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { getLyrics } from 'genius-lyrics-api';
import fetch from 'node-fetch';
import 'colors';

const rl = readline.createInterface({ input, output });

var words = [];
var perPage = 200;
var checkedSongs = []
var username = 'momir64';
var LastFmKey = '73e31e83d6b10ec1256869581540cc3c';
var GeniusKey = '2WmpJsTgoFNdZxZTmNWz0p_6eIx3H8Z_229qPNUzboE1hx0sfWp3fZ0c-vP5Lshc';

async function Hunt() {
    var url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LastFmKey}&format=json&limit=${perPage}`;
    var pages = (await (await fetch(url)).json()).recenttracks["@attr"].totalPages;
    var totalSongs = (await (await fetch(url)).json()).recenttracks["@attr"].total;
    console.log(`Total number of pages: ${pages}\x1b[K`.padEnd(100, ' '));
    console.log(`Total number of tracks: ${totalSongs}\x1b[K\r\n`.padEnd(100, ' '));
    for (var page = 1; page <= pages; page++) {
        console.log(`\rFetching page: ${page}\x1b[K`.padEnd(100, ' '));
        var url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LastFmKey}&format=json&limit=${perPage}&page=${page}`;
        const response = await fetch(url);
        const songs = (await response.json()).recenttracks.track;

        for (var i = 0; i < songs.length; i++) {
            if (!checkedSongs.includes(`${songs[i].name}, ${songs[i].artist['#text']}`)){
                process.stdout.write(`\r${i + 1}/${songs.length} ${songs[i].name}, ${songs[i].artist['#text']}\x1b[K`.padEnd(100, ' '));
                checkedSongs.push(`${songs[i].name}, ${songs[i].artist['#text']}`);
                const options = {
                    apiKey: GeniusKey,
                    title: songs[i].name,
                    artist: songs[i].artist['#text'],
                    optimizeQuery: true
                };

                let lyrics = await getLyrics(options);
                words.forEach(word => {
                    if (lyrics && lyrics.includes(word))
                        console.log(`\r${options.title}, ${options.artist}\x1b[K`.padEnd(100, ' ').green);
                });
            }
        }
    }
}

console.log('Enter key words (type "." to end):')
while (true) {
    const word = await rl.question('Key word: ');
    if(word == '.') {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(1);
        console.log();
        break;
    }
    words.push(word);
}

Hunt();