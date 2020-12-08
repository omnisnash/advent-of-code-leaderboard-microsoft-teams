const TOTAL_DAYS = 25;
const STEP_PER_DAY = 2;
const STEPS_ALL = "All";
const STEPS_PARTIAL = "Partial";
const STEPS_NONE = "None";
const SORT_BY_LOCAL_SCORE = "local-score"
const SORT_BY_GLOBAL_SCORE = "global-score"
const SORT_BY_STARS = "stars"


function parseJsonLeaderboard(leaderboard, options) {
    const participants = parseParticipants(leaderboard.members, options);

    return {
        eventYear: leaderboard.event,
        participants: sortLeaderboard(participants, options.sortLeaderboard)
    }
}

function parseParticipants(participants, options) {
    const participantsList = [];

    for (let id in participants) {
        const participant = participants[id];

        const progression = parseParticipantProgression(participant.completion_day_level, participant.last_star_ts, options);

        participantsList.push({
            name: participant.name,
            starsCount: participant.stars,
            starProgression: progression.starProgression,
            lastCompletedDay: progression.lastCompletedDay,
            localScore: participant.local_score,
            globalScore: participant.global_score,
            lastTs: participant.last_star_ts == 0 ? Infinity : participant.last_star_ts
        });
    }

    return participantsList;
}

function parseParticipantProgression(progression, lastStarIdWon, options) {
    const starProgression = []
    let lastCompletedDay = null;

    for (let i = 1; i <= TOTAL_DAYS; i++) {
        const dayId = String(i);
        const day = progression[dayId];

        if (!day) {
            starProgression.push(options.starFormat[STEPS_NONE]);
            continue;
        }


        let starType = STEPS_PARTIAL;
        for (let step = 1; step <= STEP_PER_DAY; step++) {
            const stepId = String(step);

            if (day[stepId]) {
                starType = step === STEP_PER_DAY ? STEPS_ALL : starType;
                lastCompletedDay = day[stepId].get_star_ts === lastStarIdWon ? {day: dayId, step: stepId} : lastCompletedDay;
            }
        }

        starProgression.push(options.starFormat[starType]);
    }

    return {
        starProgression: starProgression,
        lastCompletedDay: lastCompletedDay
    }
}

function sortLeaderboard(list, orderBy = SORT_BY_STARS) {
    switch(orderBy) {
        case SORT_BY_LOCAL_SCORE:
            return [...list].sort((a, b) => {
                if (a.localScore == b.localScore) {
                    return (a.lastTs > b.lastTs) ? 1 : -1
                }

                return (a.localScore < b.localScore) ? 1 : -1
            })
        case SORT_BY_GLOBAL_SCORE:
            return [...list].sort((a, b) => {
                if (a.globalScore == b.globalScore) {
                    return (a.lastTs > b.lastTs) ? 1 : -1
                }

                return (a.globalScore < b.globalScore) ? 1 : -1
            })
        default:
        case SORT_BY_STARS:
            return [...list].sort((a, b) => {
                if (a.starsCount == b.starsCount) {
                    // Handle issue like day 01 of 2020 where all local/global score were 0
                    if (a.localScore == b.localScore) {
                        return (a.lastTs > b.lastTs) ? 1 : -1
                    }
                    
                    return (a.localScore < b.localScore) ? 1 : -1
                }

                return (a.starsCount < b.starsCount) ? 1 : -1
            })
    }
}

module.exports = parseJsonLeaderboard;
