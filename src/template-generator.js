const STEPS_ALL = "All";
const STEPS_PARTIAL = "Partial";
const STEPS_NONE = "None";

function generateTeamsMessageCardLeaderboard(leaderboard, options) {
    const leaderboardName = options.leaderboardName ? options.leaderboardName : '';

    return teamsTemplate = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0f0f23",
        "summary": `Advent of Code ${leaderboard.eventYear} - ${leaderboardName} leaderboard`,
        "sections": [
            {
                "text": generateHtmlLeaderboard(leaderboard, options).trim()
            }
        ]
    }
}

function generateHtmlLeaderboard(leaderboard, options) {
    return `
        <div style='
            font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
            background-color: #0f0f23;
            padding: 15px;
            color: white;
        '>
            ${generateHtmlHeader(leaderboard, options)}
            ${generateHtmlTable(leaderboard, options)}
        </div>
    `;

}

function generateHtmlHeader(leaderboard, options) {
    const leaderboardName = options.leaderboardName ? options.leaderboardName : '';

    let html = `<div style="display: flex; align-items: center; margin-bottom: 40px;">`
    
    html += `
        <div style="flex: 0 0 auto; margin-right: 60px;">
            <h1 style="
                color: #00cc00;
                text-shadow: 0 0 2px #00cc00, 0 0 5px #00cc00;
                font-size: 1.1em;
                font-weight: normal;
                margin: 0;
            ">
                Advent Of Code ${leaderboard.eventYear}
            </h1>
            <h2 style="
                color: #00cc00;
                text-shadow: 0 0 2px #00cc00, 0 0 5px #00cc00;
                font-size: 1em;
                font-weight: normal;
                opacity: .33;
                margin: 0;
            ">
                ${leaderboardName} leaderboard
            </h1>
        </div>
    `;

    if (options.leaderboardCode) {
        html += `
            <div style="flex: 1 1 auto; text-align: center; margin-right: 40px;">
                <a href="https://adventofcode.com/${leaderboard.eventYear}/leaderboard/private" style="color: #009900; text-decoration: none;">
                    [Join the board]<br>
                    <span style="font-size: 0.7em">Code: ${options.leaderboardCode}</span>
                </a>
            </div>
        `;
    }

    if (options.repositoryUrl) {
        html += `
            <div style="flex:1 1 auto; text-align: center; margin-right: 40px;">
                <a href="${options.repositoryUrl}" style="color: #009900; text-decoration: none;">
                    [See participants repository]<br><br>
                </a>
            </div>
        `;
    }
    
    html += `</div>`

    return html;
}

function generateHtmlTable(leaderboard, options) {
    let html = `
        <table style='
            border-collapse: collapse;
            width: 100%;
            border-spacing: 10px;
            color: white;
        '>
    `;

    html += `
        <thead>
            <tr>
                <th style='text-align: center;'></th>
                <th style='text-align: center;'>Progress</th>
                <th style='text-align: center;'>Stars</th>
                <th style='text-align: center;'>Last star won</th>
                ${options.displayLocalScore ? `<th style='text-align: center;'>Local score</th>` : ''}
                ${options.displayGlobalScore ? `<th style='text-align: center;'>Global score</th>` : ''}
            </tr>
        </thead>
    `;

    html += `
        <tbody>
            ${generateHtmlTableRow(leaderboard, options)}
        </tbody>
    `;

    html += `</table>`

    return html;
}

function generateHtmlTableRow(leaderboard, options) {
    let html = ``;
    let rank = 1;
    for (let participant of leaderboard.participants) {
        html += `
            <tr style='text-align: center; color: white; '>
                <td style='text-align: left;padding: 2px;'>${String(rank).padStart(2, 0)}) ${participant.name}</td>
                <td style='font-size: 1.4em; padding-top: 8px;'>
                    ${generateHtmlStarProgression(participant.starProgression, options)}
                </td>
                <td>${participant.starsCount}</td>
                <td>${participant.lastCompletedDay ? `Day ${String(participant.lastCompletedDay.day).padStart(2, 0)}-${String(participant.lastCompletedDay.step).padStart(2, 0)}` : '-'}</td>
                ${options.displayLocalScore ? `<td>${participant.localScore}</td>` : ''}
                ${options.displayGlobalScore ? `<td>${participant.globalScore}</td>` : ''}
            </tr>
        `;

        rank++;
    }

    return html;
}

function generateHtmlStarProgression(progression, options) {
    let html = '';

    

    for(progressionType of progression) {
        switch (progressionType) {
            case options.starFormat[STEPS_ALL]:
                html += `<span style='color:#ffff66'>*</span>`
                break
            case options.starFormat[STEPS_PARTIAL]:
                html += `<span style='color:#9999cc'>*</span>`
                break
            default:
            case options.starFormat[STEPS_NONE]:
                html += `<span style='color:#333333'>*</span>`
                break
        }
    }

    return html;
}

module.exports = generateTeamsMessageCardLeaderboard;