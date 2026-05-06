import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
//  BLACKLIST — nomes de pastas que quer ignorar
// ============================================================
const FOLDER_BLACKLIST = [
    "suplementos",
];
// ============================================================

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

function scanImages(dir, blacklist, rootDir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (blacklist.includes(entry.name)) continue;
            results.push(...scanImages(fullPath, blacklist, rootDir));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                const webPath =
                    "./imgs/" + path.relative(rootDir, fullPath).replace(/\\/g, "/");
                results.push(webPath);
            }
        }
    }

    return results;
}

export default function handler(req, res) {
    const imgsDir = path.join(__dirname, "..", "imgs");

    if (!fs.existsSync(imgsDir)) {
        return res.status(404).json({ error: "Pasta imgs/ não encontrada" });
    }

    const images = scanImages(imgsDir, FOLDER_BLACKLIST, imgsDir);
    res.status(200).json({ images });
}