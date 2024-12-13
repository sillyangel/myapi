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

# Referral Codes

## `/api/referral-codes`
**Description:** Retrieves all referral codes.

**Method:** GET

**Response:**
- `message` (string): Confirmation message.
- `data` (array): List of referral codes.

**Example:** `GET /api/referral-codes`

## `/api/referral-codes/add`
**Description:** Adds a new referral code.

**Method:** GET

**Query Parameters:**
- `code` (string): The referral code to add.
- `userID` (string): The ID of the user adding the referral code.

**Response:**
- `message` (string): Confirmation message.
- `data` (object): Details of the added referral code.

**Example:** `GET /api/referral-codes/add?code=CODE123&userID=USER456`

## `/api/referral-codes/use`
**Description:** Uses a referral code.

**Method:** GET

**Query Parameters:**
- `code` (string): The referral code to use.
- `email` (string): The email of the user using the referral code.

**Response:**
- `message` (string): Confirmation message.
- `data` (object): Details of the used referral code.

**Example:** `GET /api/referral-codes/use?code=CODE123&email=user@example.com`

## `/api/referral-codes/generate`
**Description:** Generates new referral codes.

**Method:** GET

**Query Parameters:**
- `userID` (string): The ID of the user generating the referral codes.
- `num` (number): The number of referral codes to generate (maximum 5).

**Response:**
- `message` (string): Confirmation message.
- `data` (array): List of generated referral codes.

**Example:** `GET /api/referral-codes/generate?userID=USER456&num=3`

## `/api/referral-codes/get`
**Description:** Retrieves referral codes by user ID.

**Method:** GET

**Query Parameters:**
- `userID` (string): The ID of the user whose referral codes are to be retrieved.

**Response:**
- `message` (string): Confirmation message.
- `data` (array): List of referral codes created by the user.

**Example:** `GET /api/referral-codes/get?userID=USER456`