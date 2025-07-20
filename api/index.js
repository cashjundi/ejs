import fetch from "node-fetch";
import ejs from "ejs";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
    const method = req.method;
    const query = req.query;
    const username = req.method === "POST" ? (req.body?.username || "") : query.username || "";

    let profile = null;
    let error = null;

    if (username) {
        try {
            const response = await fetch(`https://forum.cfx.re/u/${username}.json`);
            if (!response.ok) {
                error = "User not found";
            } else {
                const data = await response.json();
                profile = {
                    username: data.user.username,
                    name: data.user.name,
                    avatar: `https://forum.cfx.re${data.user.avatar_template.replace("{size}", "256")}`,
                    created_at: data.user.created_at,
                    website: data.user.website_name,
                    bio: data.user.bio_raw
                };
            }
        } catch (err) {
            console.error(err);
            error = "Failed to fetch user.";
        }
    }

    const template = await readFile(path.join(__dirname, "../views/index.ejs"), "utf8");
    const html = ejs.render(template, { profile, error });
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
}
