import {google} from 'googleapis';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
app.use(cors());

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({version: "v4", auth});

app.get("/data", async(req, res) => {
    try{
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: "Requirment",
        });

        res.json({
            status: "success",
            rows: response.data.values,
        });
    } catch (error) {
        console.error("Google Sheets Error:", error);
        res.status(500).json({error: error.message});
    }
});

app.listen(PORT, ()=> console.log(`server running at localhost: ${PORT}`))