## `/api/song`

**Description:** Adds a song to the database and updates play counts.

**Method:** GET

**Query Parameters:**
- `song` (string): The name of the song.
- `artists` (string): The artists of the song.
- `album` (string): The album of the song.
- `userID` (string, optional): The ID of the user who played the song.

**Response:**
- `message` (string): Confirmation message.
- `data` (object): Details of the song added.

**Example:** 
``GET /api/song?song=SongName&artists=ArtistName&album=AlbumName&userID=UserID``

## `/api/user-songs`

**Description:** Retrieves songs played by a specific user.

**Method:** GET

**Query Parameters:**
- `userID` (string): The ID of the user.

**Response:**
- `message` (string): Confirmation message.
- `data` (array): List of songs played by the user.

**Example:** GET /api/user-songs?userID=UserID


## `/api/db/clear`

**Description:** Clears the database if the correct key is provided.

**Method:** GET

**Query Parameters:**
- `key` (string): The key to authorize the database clearing.

**Response:**
- `message` (string): Confirmation message.

**Example:** ``GET /api/db/clear?key= ``
