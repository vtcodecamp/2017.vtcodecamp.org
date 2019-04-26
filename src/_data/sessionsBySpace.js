
module.exports = getSessionsBySpace();

function getSessionsBySpace()
{
    let sessionsBySpace = {};
    let sessions = require('./sessions.json');
    for (let session of Object.values(sessions)) {
        if (!session.track) {
            continue;
        }
        let spaceId = session.space;
        if (!sessionsBySpace[spaceId]) {
            sessionsBySpace[spaceId] = [];
        }
        sessionsBySpace[spaceId].push(session);
    }
    return sessionsBySpace;
}
