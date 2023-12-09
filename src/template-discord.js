const STEPS_ALL = "All";
const STEPS_PARTIAL = "Partial";
const STEPS_NONE = "None";

function generateDiscordMessage(leaderboard, options) {
    const leaderboardName = options.leaderboardName ? `${options.leaderboardName} leaderboard` : 'Leaderboard';

    let message = `Advent of Code ${leaderboard.eventYear} - [${leaderboardName}](https://adventofcode.com/${leaderboard.eventYear}/leaderboard/private/view/${options.leaderboardID})`;

    if (options.leaderboardCode) {
        message += ` *(Code: ${options.leaderboardCode})*`;
    }

    message += "\n";
    message += generateLeaderboard(leaderboard, options);

    if (options.repositoryUrl) {
        message += `\n[See participants repository](${options.repositoryUrl})`;
    }

    return {
        'content': message
    }
}

function generateLeaderboard(leaderboard, options) {
    let html = "```";

    html += generateRow(leaderboard, options);

    if (options.playerLimit < leaderboard.participants.length) {
        const last = parseInt(options.playerLimit) + 1
        html += `\n${String(last).padStart(2, 0)})  ...`;
    }

    html += "```";

    return html;
}

function generateRow(leaderboard, options) {
    let text = ``;
    let rank = 1;
    let playerLimit = Math.min(options.playerLimit, leaderboard.participants.length)

    for (let x = 0; x < playerLimit; x++) {
        let participant = leaderboard.participants[x]

        text += `\n${String(rank).padStart(2, 0)}) `;
        
        if (options.displayLocalScore) {
            text += `${String(participant.localScore).padStart(4, ' ')} `;
        }

        if (options.displayGlobalScore) {
            text += `${String(participant.globalScore).padStart(4, ' ')} `;
        }
        
        text += `${generateStarProgression(participant.starProgression, options)} `;
        text += `${String(participant.starsCount).padStart(2, ' ')}* `;
        text += `${participant.lastCompletedDay ? `(Day ${String(participant.lastCompletedDay.day).padStart(2, 0)}-${String(participant.lastCompletedDay.step).padStart(2, 0)})` : ''.padStart(11, ' ')} `;
        text += `${participant.name}`;

        rank++;
    }

    return text;
}

function generateStarProgression(progression, options) {
    let text = '';

    for (const progressionType of progression) {
        switch (progressionType) {
            case options.starFormat[STEPS_ALL]:
                text += '*'
                break
            case options.starFormat[STEPS_PARTIAL]:
                text += '⁺'
                break
            default:
            case options.starFormat[STEPS_NONE]:
                text += ' '
                break
        }
    }

    return text;
}

module.exports = generateDiscordMessage;
