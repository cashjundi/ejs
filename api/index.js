import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("index", { profile: null, error: null });
});

app.post("/lookup", async (req, res) => {
    const username = req.body.username?.trim();
    if (!username) return res.render("index", { error: "No username entered", profile: null });

    try {
        const url = `https://forum.cfx.re/u/${username}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            return res.render("index", { error: "User not found", profile: null });
        }

        const data = await response.json();
        const profile = {
            username: data.user.username,
            name: data.user.name,
            avatar: `https://forum.cfx.re${data.user.avatar_template.replace("{size}", "256")}`,
            created_at: data.user.created_at,
            website: data.user.website_name,
            bio: data.user.bio_raw
        };

        res.render("index", { profile, error: null });
    } catch (err) {
        console.error(err);
        res.render("index", { error: "Error fetching profile", profile: null });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CFX Lookup Running at http://localhost:${PORT}`));
