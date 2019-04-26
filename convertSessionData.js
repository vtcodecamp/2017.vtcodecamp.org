const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

let projectRoot = path.normalize(__dirname);
let archivePath = projectRoot + '/archive_data'
let dataPath = projectRoot + '/src/_data'


convertSessions();
convertLevels();
convertSpaces();
convertSpeakers();
convertTimePeriods();
convertTracks();


function convertSessions() 
{
    let sessionFiles = fs.readdirSync(archivePath + '/sessions');

    let rawSessions = sessionFiles.map(function (filename) {
        let rawData = fs.readFileSync(archivePath + '/sessions/' + filename)
        let data = JSON.parse(rawData)
        return parseSessionData(data);
    });
    writeDataFile('sessions.json', rawSessions);
}

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
        level = data._links.level.href.replace('/2017/levels/', '');
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


function convertLevels() 
{
    let files = fs.readdirSync(archivePath + '/levels');

    let itemArray = files.map(function (filename) {
        let rawData = fs.readFileSync(archivePath + '/levels/' + filename)
        let data = JSON.parse(rawData)
        return {
            slug:  data.slug,
            title: data.title,
            description: data.description,
        };
    });
    writeDataFile('levels.json', itemArray);
}


function convertSpaces() 
{
    let files = fs.readdirSync(archivePath + '/spaces');

    let itemArray = files.map(function (filename) {
        let rawData = fs.readFileSync(archivePath + '/spaces/' + filename)
        let data = JSON.parse(rawData)
        return {
            slug:  data.slug,
            title: data.title,
            order: data.order,
            track: data._links.track.href.replace('/2017/tracks/', ''),
        };
    });
    writeDataFile('spaces.json', itemArray);
}

function convertSpeakers() 
{
    let files = fs.readdirSync(archivePath + '/speakers');

    let itemArray = files.map(function (filename) {
        let rawData = fs.readFileSync(archivePath + '/speakers/' + filename)
        let data = JSON.parse(rawData)
        
        let twitter;
        if (data._links.twitter) {
            twitter = data._links.twitter
        }
        return {
            slug:  data.slug,
            firstName: data.firstName,
            lastName: data.lastName,
            bio: data.bio,
            twitter: twitter,
        };
    });
    writeDataFile('speakers.json', itemArray);
}


function convertTimePeriods() 
{
    let files = fs.readdirSync(archivePath + '/time-periods');

    let itemArray = files.map(function (filename) {
        let rawData = fs.readFileSync(archivePath + '/time-periods/' + filename)
        let data = JSON.parse(rawData)
        return {
            slug:  data.slug,
            start: data.start,
            end: data.end,
        };
    });
    writeDataFile('time-periods.json', itemArray);
}


function convertTracks() 
{
    let files = fs.readdirSync(archivePath + '/tracks');

    let itemArray = files.map(function (filename) {
        let rawData = fs.readFileSync(archivePath + '/tracks/' + filename)
        let data = JSON.parse(rawData)
        return {
            slug:  data.slug,
            title: data.title,
        };
    });
    writeDataFile('tracks.json', itemArray);
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