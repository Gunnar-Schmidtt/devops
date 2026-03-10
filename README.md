
# Timer Tracker (devops)

Spring 2026 CIS 486

Render: https://devops-yzmn.onrender.com/
Cloud Server: http://34.125.90.224

## Overview

Timer Tracker is a web application for creating, tracking, and managing timers. Each timer can have a label, description, start time, and now supports adding dated notes/log entries. This project demonstrates full-stack development with Node.js, Express, and MongoDB.

## Features
- Add, view, and delete timers
- Each timer has a label, description, start time, and creation date
- Add dated notes/log entries to individual timers
- RESTful API
- MongoDB backend

## Setup & Running Locally

1. Clone the repository and install dependencies:
	 ```bash
	 npm install
	 ```
2. Set up a `.env` file with your MongoDB connection string:
	 ```env
	 MONGO_URI=your_mongodb_connection_string
	 ```
3. Start the server:
	 ```bash
	 node app.mjs
	 ```
4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Timers
- `POST /api/timers` — Add a new timer
	- Body: `{ label, desc, startTime, dateStr, timeStr }`
- `GET /api/timers` — Get all timers
- `DELETE /api/timers/:id` — Delete a timer by ID

### Notes (Log Entries)
- `POST /api/timers/:id/notes` — Add a note to a timer
	- Body: `{ text, date (optional) }`
	- Example:
		```json
		{ "text": "Started working on project", "date": "2026-03-10T14:00:00Z" }
		```
	- If `date` is omitted, the current date/time is used.

## Example Usage

**Add a timer:**
```bash
curl -X POST http://localhost:3000/api/timers \
	-H "Content-Type: application/json" \
	-d '{"label":"Study Session","desc":"Math review","startTime":1234567890,"dateStr":"2026-03-10","timeStr":"14:00"}'
```

**Add a note to a timer:**
```bash
curl -X POST http://localhost:3000/api/timers/<timer_id>/notes \
	-H "Content-Type: application/json" \
	-d '{"text":"Reviewed calculus notes"}'
```

## License

See LICENSE file.
