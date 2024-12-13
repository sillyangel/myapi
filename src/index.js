import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import cors from 'cors';
const app = express();
const PORT = 9460;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());

dotenv.config();

const API_KEY = process.env.API_KEY || 'hawk2ah';

//--------------------------------------------------------------------------------------------------------------------------------------
// referral codes api
const REFERRAL_DB_FILE = path.join(__dirname, 'referral.json');
if (!fs.existsSync(REFERRAL_DB_FILE)) {
    fs.writeFileSync(REFERRAL_DB_FILE, JSON.stringify({ referralCodes: {} }, null, 2));
}
const readReferralDatabase = () => {
    const data = fs.readFileSync(REFERRAL_DB_FILE, 'utf-8');
    return JSON.parse(data);
}
const writeReferralDatabase = (data) => {
    fs.writeFileSync(REFERRAL_DB_FILE, JSON.stringify(data, null, 2));
}


app.get('/api/referral-codes', (req, res) => {
    const db = readReferralDatabase();
    const { referralCodes } = db;

    res.json({
        message: 'Referral codes retrieved successfully.',
        data: referralCodes
    });
});
app.get('/api/referral-codes/add', (req, res) => {
    const { code, userID } = req.query;

    if (!code || !userID) {
        return res.status(400).json({
            error: 'Missing required query parameters: code or userID.'
        });
    }

    const db = readReferralDatabase();
    const { referralCodes } = db;

    if (referralCodes[code]) {
        return res.status(400).json({
            error: 'Referral code already exists.'
        });
    }
    // make it push
        /*
        "referralCodes": {
            "code1": {
                "author": "userID1",
                "usedBy": ["email"]
            }
        }
    */
    referralCodes[code] = {
        author: userID,
        usedBy: [],
        used: false
    };
    writeReferralDatabase(db);

    res.json({
        message: 'Referral code added successfully.',
        data: {
            code,
            userID
        }
    });
});
app.get('/api/referral-codes/use', (req, res) => {
    const { code, email } = req.query;

    if (!code || !email) {
        return res.status(400).json({
            error: 'Missing required query parameters: code or email.'
        });
    }

    const db = readReferralDatabase();
    const { referralCodes } = db;

    if (!referralCodes[code]) {
        return res.status(404).json({
            error: 'Referral code not found.'
        });
    }

    if (referralCodes[code].usedBy.includes(email)) {
        return res.status(400).json({
            error: 'Referral code already used by this email.'
        });
    }

    if (referralCodes[code].used) {
        return res.status(400).json({
            error: 'Referral code already used.'
        });
    }

    referralCodes[code].usedBy.push(email);
    referralCodes[code].used = true;
    writeReferralDatabase(db);

    res.json({
        message: 'Referral code used successfully.',
        data: {
            code,
            email
        }
    });
});
app.get('/api/referral-codes/generate', (req, res) => {
    const { userID, num } = req.query;

    if (!userID) {
        return res.status(400).json({
            error: 'Missing required query parameter: userID.'
        });
    }
    // if num is not return and dont generate more than 5
    if (!num || num > 5) {
        return res.status(400).json({
            error: 'Invalid number of referral codes to generate.'
        });
    }
    const db = readReferralDatabase();
    const { referralCodes } = db;
    const createdcodes = [];

    for (let i = 0; i < num; i++) {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        referralCodes[code] = {
            author: userID,
            usedBy: [],
            used: false
        };
        writeReferralDatabase(db);
        // save in a var
        createdcodes.push(code);
    }
    res.json({
        message: 'Referral codes generated successfully.',
        data: createdcodes
    })
});
app.get('/api/referral-codes/get', (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        return res.status(400).json({
            error: 'Missing required query parameter: userID.'
        });
    }
    const db = readReferralDatabase();
    const { referralCodes } = db;

    const codes = Object.entries(referralCodes)
        .filter(([code, { author }]) => author === userID)
        .map(([code, { usedBy, used }]) => ({ code, usedBy, used }));

    res.json({
        message: 'Referral codes retrieved successfully.',
        data: codes
    });
});





//--------------------------------------------------------------------------------------------------------------------------------------
// music api
const DB_FILE = path.join(__dirname, 'db.json');

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ songPlays: {}, recentlyPlayed: [] }, null, 2));
}
// Helper function to read the database
const readDatabase = () => {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
};
// Helper function to write to the database
const writeDatabase = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

app.get('/', (req, res) => {
    const db = readDatabase();
    const { songPlays, recentlyPlayed } = db;


    // Find the top 5 most played songs
    const topSongs = Object.entries(songPlays)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([song, count]) => ({ song, count }));

    // Find the top 5 most played albums
    const albumPlays = recentlyPlayed.reduce((acc, { album }) => {
        acc[album] = (acc[album] || 0) + 1;
        return acc;
    }, {});

    const topAlbums = Object.entries(albumPlays)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([album, count]) => ({ album, count }));

    res.send(`
        <html>
            <head>
                <title>Song Dashboard</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    h1, h2 {
                        color: #444;
                    }
                    h1 {
                        font-size: 2.5em;
                    }
                    p {
                        font-size: 1.2em;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    li {
                        background-color: #fff;
                        margin: 5px 0;
                        padding: 10px;
                        border-radius: 5px;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    }
                    strong {
                        color: #000;
                    }
                </style>
            </head>
            <body>
                <h1>Song Dashboard - API</h1>
                <a href="/docs" style="">Documentation</a>
                <a href="https://offbrand.sillyangel.xyz" style="margin-left: 20px;">music app</a>
                <h2>Top 5 Most Played Albums</h2>
                <ul>
                    ${topAlbums.map(album => `<li>${album.album}: ${album.count} plays</li>`).join('')}
                </ul>
                <h2>Top 5 Most Played Songs</h2>
                <ul>
                    ${topSongs.map(song => `<li>${song.song}: ${song.count} plays</li>`).join('')}
                </ul>
                <h2>Recently Played Songs</h2>
                <ul>
                    ${Array.isArray(recentlyPlayed) ? recentlyPlayed.slice(-10).reverse().map(song => `<li>${song.song} by ${song.artists} (Album: ${song.album})</li>`).join('') : ''}
                </ul>
            </body>
        </html>
    `);
});
app.get('/docs', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Song Dashboard</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    h1, h2 {
                        color: #444;
                    }
                    h1 {
                        font-size: 2.5em;
                    }
                    p {
                        font-size: 1.2em;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    li {
                        background-color: #fff;
                        margin: 5px 0;
                        padding: 10px;
                        border-radius: 5px;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    }
                    strong {
                        color: #000;
                    }
                </style>
            </head>
            <body>
                <h1>API Documentation</h1>
                <a href="/" style="">Dashboard</a>
                <div>
                    <h2>GET /api/song</h2>
                    <p>Endpoint to log a song play. Requires query parameters:</p>
                    <ul>
                        <li><strong>song</strong>: The name of the song</li>
                        <li><strong>artists</strong>: The name of the artists</li>
                        <li><strong>album</strong>: The name of the album</li>
                        <li><strong>userID</strong>: The ID of the user (optional)</li>
                    </ul>
                    <b>Response:</b>
                    <ul>
                        <li><strong>message</strong> (string): Confirmation message.</li>
                        <li><strong>data</strong> (object): Details of the song added.</li>
                    </ul>
                </div>
                <div>
                    <h2>GET /api/user-songs</h2>
                    <p>Endpoint to retrieve songs played by a specific user. Requires query parameters:</p>
                    <ul>
                        <li><strong>userID</strong>: The ID of the user</li>
                    </ul>
                    <b>Response:</b>
                    <ul>
                        <li><strong>message</strong> (string): Confirmation message.</li>
                        <li><strong>data</strong> (array): List of the song played by the user.</li>
                    </ul>
                </div>
                 <div>
                    <h2>GET /api/db/clear </h2>
                    <p>Endpoint to clear db by the owner or admin. Requires query parameters:</p>
                    <ul>
                        <li><strong>key</strong>: Set Key to clear the </li>
                    </ul>
                    <b>Response:</b>
                    <ul>
                        <li><strong>message</strong> (string): Confirmation message.</li>
                    </ul>
                </div>
                <h1>Referral Codes</h1>
                <div>
    <h2>GET /api/referral-codes</h2>
    <p>Endpoint to retrieve all referral codes.</p>
    <b>Response:</b>
    <ul>
        <li><strong>message</strong> (string): Confirmation message.</li>
        <li><strong>data</strong> (array): List of referral codes.</li>
    </ul>
</div>

<div>
    <h2>GET /api/referral-codes/add</h2>
    <p>Endpoint to add a new referral code. Requires query parameters:</p>
    <ul>
        <li><strong>code</strong> (string): The referral code to add.</li>
        <li><strong>userID</strong> (string): The ID of the user adding the referral code.</li>
    </ul>
    <b>Response:</b>
    <ul>
        <li><strong>message</strong> (string): Confirmation message.</li>
        <li><strong>data</strong> (object): Details of the added referral code.</li>
    </ul>
</div>

<div>
    <h2>GET /api/referral-codes/use</h2>
    <p>Endpoint to use a referral code. Requires query parameters:</p>
    <ul>
        <li><strong>code</strong> (string): The referral code to use.</li>
        <li><strong>email</strong> (string): The email of the user using the referral code.</li>
    </ul>
    <b>Response:</b>
    <ul>
        <li><strong>message</strong> (string): Confirmation message.</li>
        <li><strong>data</strong> (object): Details of the used referral code.</li>
    </ul>
</div>

<div>
    <h2>GET /api/referral-codes/generate</h2>
    <p>Endpoint to generate new referral codes. Requires query parameters:</p>
    <ul>
        <li><strong>userID</strong> (string): The ID of the user generating the referral codes.</li>
        <li><strong>num</strong> (number): The number of referral codes to generate (maximum 5).</li>
    </ul>
    <b>Response:</b>
    <ul>
        <li><strong>message</strong> (string): Confirmation message.</li>
        <li><strong>data</strong> (array): List of generated referral codes.</li>
    </ul>
</div>

<div>
    <h2>GET /api/referral-codes/get</h2>
    <p>Endpoint to retrieve referral codes by user ID. Requires query parameters:</p>
    <ul>
        <li><strong>userID</strong> (string): The ID of the user whose referral codes are to be retrieved.</li>
    </ul>
    <b>Response:</b>
    <ul>
        <li><strong>message</strong> (string): Confirmation message.</li>
        <li><strong>data</strong> (array): List of referral codes created by the user.</li>
    </ul>
</div>
            </body>
        </html>
        `)
});
app.get('/api/db/clear', (req, res) => {
    const { key } = req.query;
    if (key !== API_KEY) {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }
    // code to clear db
    const emptyDB = { songPlays: {}, recentlyPlayed: [], userPlays: {} };
    writeDatabase(emptyDB);

    res.json({
        message: 'Database cleared successfully.'
    });
});
app.get('/api/song', (req, res) => {
    const { song, artists, album, userID, image} = req.query;

    if (!song || !artists || !album) {
        return res.status(400).json({
            error: 'Missing required query parameters: song, artists, or album.'
        });
    }

    const db = readDatabase();
    const { songPlays, recentlyPlayed = [], userPlays } = db;

    if (songPlays[song]) {
        songPlays[song] += 1;
    } else {
        songPlays[song] = 1;
    }

    recentlyPlayed.push({ song, artists, album, userID, image});
    if (recentlyPlayed.length > 50) {
        recentlyPlayed.shift(); // Keep only the last 50 entries
    }

    if (userID) {
        if (!userPlays) {
            db.userPlays = {};
        }
        if (!db.userPlays[userID]) {
            db.userPlays[userID] = [];
        }
        db.userPlays[userID].push({ song, artists, album });
    }

    db.recentlyPlayed = recentlyPlayed; // Update the recentlyPlayed in db
    writeDatabase(db);

    res.json({
        message: 'Song details received successfully.',
        data: {
            song,
            artists,
            album
        }
    });
});
app.get('/api/user-songs', (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        return res.status(400).json({
            error: 'Missing required query parameter: userID.'
        });
    }

    const db = readDatabase();
    const userSongs = db.recentlyPlayed.filter(entry => entry.userID === userID);

    res.json({
        message: 'User songs retrieved successfully.',
        data: userSongs
    });
});

// log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});