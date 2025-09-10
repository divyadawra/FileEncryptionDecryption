const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const stream = require("stream");

const dbConnection = require("./db");
const { saveEncryptedFile, getDecryptedFile } = require("./fileService");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file1"), (req, res) => {
  const { passcode } = req.body;
  const fileName = req.file.originalname;
  const fileType = req.file.mimetype;
  const filePath = path.join("./uploads", fileName);

  saveEncryptedFile(req.file.buffer, filePath, passcode.trim());

  dbConnection.query(
    `INSERT INTO File (fileName, type) VALUES (?, ?)`,
    [fileName, fileType],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB insert failed" });

      const insertId = result.insertId;
      const link = `/api/file/${insertId}-${fileName}`;

      dbConnection.query(
        `INSERT INTO SharableFileLink (fileId, link) VALUES (?, ?)`,
        [insertId, link],
        (err2) => {
          if (err2) console.error("Error inserting sharable link:", err2);
        }
      );

      res.status(200).json({ link });
    }
  );
});


router.post("/file/:fileName", upload.none(), (req, res) => {
  const passcode = req.body.passcode.trim();
  const filePath = path.join("./uploads", req.params.fileName);

  try {
    const buffer = getDecryptedFile(filePath, passcode);

    // TODO: fetch fileType from DB (here hardcoded as application/pdf for demo)
    const mimeType = "application/pdf";

    res.writeHead(200, {
      "Content-Disposition": "attachment; filename=" + req.params.fileName,
      "Content-Type": mimeType,
      "Content-Length": buffer.length,
    });

    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    readStream.pipe(res);
  } catch (e) {
    console.error("Decrypt error:", e.message);
    res.status(400).json({ error: "Invalid passcode or corrupt file" });
  }
});

module.exports = router;
