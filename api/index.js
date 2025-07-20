import path from "path";
import ejs from "ejs";

export default async function handler(req, res) {
  // Resolve path to the EJS template relative to this file
  const templatePath = path.resolve('./views/index.ejs');

  try {
    // Render the EJS template with data
    const html = await ejs.renderFile(templatePath, { name: "Vercel User" });
    
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error rendering page");
  }
}
