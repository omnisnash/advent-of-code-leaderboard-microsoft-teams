/**
 * TODO
 * - JSDOC
 */
require('dotenv').config({path: '../.env'})

const fetch = require('node-fetch');
const parseJsonLeaderboard = require('./leaderboard-parser');
const generateTeamsMessageCardLeaderboard = require('./template-generator');

const STAR_FORMAT = {'All': 'Gold', 'Partial': 'Silver', 'None': 'None'};
const EVENT_YEAR = process.env.EVENT_YEAR ? process.env.EVENT_YEAR : new Date().getFullYear();
const SORT_ORDER = process.env.LEADERBOARD_SORT ? process.env.LEADERBOARD_SORT : 'stars';

function validateEnvVariables() {
    const errors = [];

    if (!process.env.AOC_LEADERBOARD_ID) {
        errors.push('-AOC_LEADERBOARD_ID')
    }
    if (!process.env.AOC_COOKIE) {
        errors.push('-AOC_COOKIE')
    }
    if (!process.env.TEAMS_WEBHOOK) {
        errors.push('-TEAMS_WEBHOOK')
    }

    if (errors.length != 0) {
        console.error(`Error: missing environment variable(s) from your .env file:\n${errors.join('\n')}`)
        process.exit(1);
    }
}

async function requestJsonLeaderboard() {
    const request = await fetch(`https://adventofcode.com/${EVENT_YEAR}/leaderboard/private/view/${process.env.AOC_LEADERBOARD_ID}.json`, {headers: {cookie: process.env.AOC_COOKIE}});
    const jsonLeaderboard = await request.json();
    return jsonLeaderboard;
}

async function sendLeaderboardViaTeamMessage(template) {
    await fetch(process.env.TEAMS_WEBHOOK, {
        method: 'post',
        body: JSON.stringify(template),
        headers: { 'Content-Type': 'application/json' },
    });
}

(async () => {
    validateEnvVariables();

    const jsonLeaderboard = await requestJsonLeaderboard();

    const parsedLeaderboard = parseJsonLeaderboard(jsonLeaderboard, {sortLeaderboard: SORT_ORDER, starFormat: STAR_FORMAT})

    const template = generateTeamsMessageCardLeaderboard(parsedLeaderboard, {
        leaderboardName: process.env.LEADERBOARD_NAME,
        leaderboardCode: process.env.LEADERBOARD_CODE,
        repositoryUrl: process.env.REPOSITORY_URL,
        displayGlobalScore: process.env.LEADERBOARD_DISPLAY_GLOBAL_SCORE == true,
        displayLocalScore: process.env.LEADERBOARD_DISPLAY_LOCAL_SCORE == true,
        starFormat: STAR_FORMAT
    })
    
    await sendLeaderboardViaTeamMessage(template);
})();
