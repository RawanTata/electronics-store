require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");

app.use(cors());
const port = process.env.PORT || 3000;

app.get("/api/v1/electronics-store", async (req, res) => {
    try{
        const { query } = req.query;
        const keywords = query.split(" ");
        keywords.splice(3)
        keywords.forEach((keyword, i) => keywords[i] = "%" + keyword + "%");
        let devices = {};
        if(keywords.length === 3){
            devices = await db.query("SELECT * FROM device WHERE (model ILIKE $3 AND model ILIKE $2 AND name ILIKE $1) OR (model ILIKE $1 AND model ILIKE $3 AND model ILIKE $2) OR (name ILIKE $1 AND name ILIKE $2 AND model ILIKE $3) OR (name ILIKE $2 AND name ILIKE $1 AND name ILIKE $3)", keywords);
            keywords.splice(2);
        }
        if(keywords.length === 2 && (devices.rowCount === 0 || Object.keys(devices).length === 0)){
            devices = await db.query("SELECT * FROM device WHERE name || ' ' || model ILIKE $1 || $2 OR (model ILIKE $2 AND name ILIKE $1) OR (name ILIKE $2 AND model ILIKE $1) OR (model ILIKE $2 AND model ILIKE $1)", keywords);
            keywords.splice(1);
        }
        if(devices.rowCount === 0 || Object.keys(devices).length === 0){
            devices = await db.query("SELECT * FROM device WHERE name || ' ' || model ILIKE $1 OR model ILIKE $1 OR name ILIKE $1", keywords);
        }
        res.json({
            data: devices.rows
        });
    } catch (e) {
        console.error(e);
    }
});

app.get("/api/v1/electronics-store/:category", async (req, res) => {
    try{
        const devices = await db.query("SELECT * FROM device WHERE category_id = (SELECT id FROM category WHERE name = $1)", [req.params.category]);
        res.json({data: devices.rows});
    } catch(e) {
        console.error(e)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
