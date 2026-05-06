const fs = require("fs");
const path = require("path");

// ============================================================
//  BLACKLIST — nomes de pastas que quer ignorar
// ============================================================
const FOLDER_BLACKLIST = [
    "suplementos"
];
// ============================================================

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

function scanImages(dir, blacklist) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (blacklist.includes(entry.name)) continue;
            results.push(...scanImages(fullPath, blacklist));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                // Caminho relativo web a partir da raiz do projeto
                const webPath =
                    "./" + path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
                results.push(webPath);
            }
        }
    }

    return results;
}

module.exports = (req, res) => {
    const imgsDir = path.join(process.cwd(), "imgs");

    if (!fs.existsSync(imgsDir)) {
        return res.status(404).json({ error: "Pasta imgs/ não encontrada" });
    }

    const images = scanImages(imgsDir, FOLDER_BLACKLIST);
    res.status(200).json({ images });
};