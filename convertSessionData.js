const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

let projectRoot = path.normalize(__dirname);
let archivePath = projectRoot + '/archive_data'
let dataPath = projectRoot + '/src/_data'

let sessionFiles = fs.readdirSync(archivePath + '/sessions');

let rawSessions = sessionFiles.map(function (filename) {
    let rawData = fs.readFileSync(archivePath + '/sessions/' + filename)
    let data = JSON.parse(rawData)
    return parseSessionData(data);
});



writeDataFile('sessions.json', rawSessions);



function parseSessionData(data)
{
    let track, space, level, resources = [];
    if (data._links.track) {
        track = data._links.track.href.replace('/2017/tracks/', '');
    }
    if (data._links.space) {
        space = data._links.space.href.replace('/2017/spaces/', '');
    }
    if (data._links.level) {
        space = data._links.level.href.replace('/2017/levels/', '');
    }
    if (data._links.resource) {
        resources = data._links.resource;
    }

    let session = {
        slug:  data.slug,
        title: data.title,
        description: data.description,
        track: track,
        space: space,
        timePeriod:  data._links.timePeriod.href.replace('/2017/time-periods/', ''),
        level: level,
        speakers: [],
        resources: data._links.resource,
    }
    if (data._links.speaker) {
        data._links.speaker.forEach(function (item) {
            let speaker = item.href.replace('/2017/speakers/', '');
            session.speakers.push(speaker);
        });
    }
    return session;
}





function writeDataFile(filename, array)
{
    let object = {};

    for (let item of array) {
        object[item.slug] = item;
    }

    let file = `${projectRoot}/src/_data/${filename}`;
    let content = JSON.stringify(object, null, 4);

    fs.writeFile(file, content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`Data written to ${filename}`);
    });
}