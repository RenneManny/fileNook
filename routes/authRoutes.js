const express = require("express");
const router = express.Router();
const fs = require("fs");
const File = require("../models/fileInfo");
const { Storage } = require("megajs");
const multer = require("multer");
const path = require("path");
// const isAuthenticated = require("../middleware/auth"); // Import your authentication middleware

// Using Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = path.join(__dirname, "../uploads", req.user.username);
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
//
router.get("/files", async (req, res) => {
  try {
    // Fetch files belonging to the authenticated user
    const userId = req.user._id;
    const files = await File.find({ author: userId });
    // console.log(files);
    res.render("form", { uploadedFiles: files });
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    res.status(500).send("Failed to fetch uploaded files");
  }
});

router.post("/files", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
      userAgent: null,
    });

    await storage.ready; // Ensure MEGA storage is ready

    const uploadStream = storage.upload({
      name: file.originalname,
      size: file.size,
    });

    // Stream the file from local to MEGA Cloud
    fs.createReadStream(file.path).pipe(uploadStream);

    // Handle completion of upload
    uploadStream.on("complete", (megaFile) => {
      const newData = new File({
        filename: megaFile.name,
        size: megaFile.size,
        uploadedAt: new Date(),
        photoPath: `../uploads/${req.user.username}/${megaFile.name}`,
        author: req.user._id, // Associate file with the logged-in user
      });

      newData.save();
      res.redirect("/auth/files");
    });

    // Handle upload error
    uploadStream.on("error", (err) => {
      console.error("File upload error:", err);
      res.status(500).send("Failed to upload file");
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("An unexpected error occurred");
  }
});

// delete files from mongodb using id
router.get("/files/:filename", async (req, res) => {
  try {
    const fileName = req.params.filename;

    // Find the file by its filename and delete from mongodb
    const file = await File.findOne({ filename: fileName });
    if (!file) {
      return res.status(404).send("File not found");
    }
    await file.deleteOne();
    // delete photos from upload folder
    // console.log("This is username"+req.user.username);
    // delete from upload folder
    fs.unlink(`./uploads/${req.user.username}/${fileName}`, (err) => {
      if (err) {
        console.log("Error", err);
        res.send("Failed to delete file");
      }
      console.log("File deleted from uploads successfuly");
    });

    // deleting files from cloud
    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
      userAgent: null,
    });

    await storage.ready;

    const files = storage.root.children;
    const megaFile = files.find((file) => file.name === fileName);
    if (!megaFile) {
      console.log("Error deleting files!");
    } else {
      megaFile.delete();
    }
    res.send(
      `<script>
    alert('File deleted successfully');
    window.location.href = '/auth/files';
  </script>`
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("An unexpected error occurred");
  }
});
// download files

router.get("/files/:filename/download", async (req, res) => {
  try {
    const fileName = req.params.filename;

    // Find the file by its filename
    const file = await File.findOne({ filename: fileName });
    if (!file) {
      return res.status(404).send("File not found");
    }

    // Construct the file path
    const filePath = path.join(__dirname, "../uploads",req.user.username, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found on the server");
    }

    // Set headers for file download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", file.mime || "application/octet-stream");

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Failed to download file");
  }
});

module.exports = router;
