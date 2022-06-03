const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage
const Grid = require("gridfs-stream")
const methodOverride = require("method-override")
const ExifImage = require("exif").ExifImage
const objectId = require("mongodb").ObjectId
const fs = require("fs")
const path = require("path")
var MongoClient = require("mongodb").MongoClient

const app = express()

// Middleware
//app.use(cors())
app.use(express.json())
app.use(methodOverride("_method"))
app.set("view engine", "ejs")

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-content-type-options, Content-Type, Accept, Authorization, access-control-allow-origin, access-control-allow-credentials, access-control-allow-methods, access-control-allow-headers"
  )
  next()
})

// Mongo URI
const mongoURI =
  "mongodb+srv://admin:admin@d0027e.ahhsh.mongodb.net/Bothniabladet?retryWrites=true&w=majority"

// Mongoose client
const mongooseClient = mongoose.createConnection(mongoURI)

// Init gfs
let gfs

mongooseClient.once("open", () => {
  // Init stream
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongooseClient.db, {
    bucketName: "upload",
  })
  gfs = Grid(mongooseClient.db, mongoose.mongo)
  gfs.collection("upload")
})

var filenameWithExt

function getEXIF(filePath) {
  return new Promise((resolve) => {
    ExifImage(filePath, (err, data) => {
      resolve(data)
      if (err) {
        console.log(err)
      }
    })
  })
}

// Storage engine for GridFS
const storage = new GridFsStorage({
  url: mongoURI,
  file: async (req, file) => {
    // Extract exif data
    filenameWithExt = file.originalname

    var nameOfFileExif = path.parse(filenameWithExt).name

    const automatic_metadata = await getEXIF(
      `./client/public/tmp/${file.originalname}`
    )

    var manual_metadata = JSON.parse(
      fs.readFileSync(`./client/public/tmp/${nameOfFileExif}.txt`)
    )

    var finalMeta = { manual_metadata, automatic_metadata }
    //console.log(finalMeta)

    return {
      filename: file.originalname,
      bucketName: "upload",
      metadata: finalMeta,
    }
  },
})
const upload = multer({ storage })

// Storage engine for temporary files
const tmpFileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./client/public/tmp")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const uploadTmp = multer({ storage: tmpFileStorageEngine })

// POST /tmp
// First upload to tmp, image and manual metadata
app.post("/tmp", uploadTmp.single("file"), async (req, res) => {
  var exifdata = await getEXIF(`./client/public/tmp/${req.file.filename}`)

  res.json({
    fileName: req.file.filename,
    filePath: `/tmp/${req.file.filename}`,
    exifdata: exifdata,
  })
})

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// POST /upload
// Final upload to database
app.post("/upload", upload.single("file"), async (req, res) => {
  filenameWithExt = path.parse(req.file.filename).name
  fs.unlinkSync(`./client/public/tmp/${req.file.filename}`)
  fs.unlinkSync(`./client/public/tmp/${filenameWithExt}.txt`)
  res.redirect("/")
})

// POST /meta
// Uploads manual metadata to tmp during initial upload
app.post("/meta", async (req, res) => {
  var receivedJson = req.body
  var nameOfFile = path.parse(receivedJson.filename).name
  delete receivedJson.filename

  await fs.writeFile(
    `./client/public/tmp/${nameOfFile}.txt`,
    JSON.stringify(receivedJson),
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
})

// GET /search
// Searches database for images by tags, title, description, author, category, or filename
app.get("/search", async (req, res) => {
  var receivedJson = req.query.searchWord

  const filenames = []

  gfs.files
    .find({
      $or: [
        { filename: { $in: receivedJson } },
        { "metadata.manual_metadata.tags": { $in: receivedJson } },
        { "metadata.manual_metadata.title": { $in: receivedJson } },
        { "metadata.manual_metadata.description": { $in: receivedJson } },
        { "metadata.manual_metadata.author": { $in: receivedJson } },
        { "metadata.manual_metadata.category": { $in: receivedJson } },
      ],
    })
    .toArray(async (err, files) => {
      files.forEach(function (file) {
        filenames.push(file.filename)
      })

      const uniqueFilenames = [...new Set(filenames)] //ensures no duplicates

      return res.json(uniqueFilenames)
    })
})

// GET /searchCategory
// Searches database for images by category
app.get("/searchCategory", async (req, res) => {
  var receivedJson = req.query.searchWord

  const filenames = []

  gfs.files
    .find({ "metadata.manual_metadata.category": receivedJson })
    .toArray(async (err, files) => {
      files.forEach(function (file) {
        filenames.push(file.filename)
      })

      const uniqueFilenames = [...new Set(filenames)] //ensures no duplicates

      return res.json(uniqueFilenames)
    })
})

// GET /editSearch
// Retrieves metadata for edit view
app.get("/editSearch", async (req, res) => {
  var receivedFilename = req.query.fileName
  var foundMetadata
  gfs.files.find({ filename: receivedFilename }).toArray(async (err, files) => {
    files.forEach(function (files) {
      foundMetadata = files.metadata["manual_metadata"]
      foundMetadata["exif"] = files.metadata["automatic_metadata"]
    })

    return res.json(foundMetadata)
  })
})

// POST /submitEdit
// Sets the new metadata
app.post("/submitEdit", async (req, res) => {
  var receivedData = req.body

  var updateItem = {
    $set: {
      filename: receivedData["filename"],
      metadata: {
        manual_metadata: {
          title: receivedData["title"],
          description: receivedData["description"],
          author: receivedData["author"],
          category: receivedData["category"],
          tags: receivedData["tags"],
          price: receivedData["price"],
          externalImage: receivedData["externalImage"],
          externalCount: receivedData["externalCount"],
          ifTip: receivedData["ifTip"],
          datePublish: receivedData["datePublish"],
        },
        automatic_metadata: receivedData["automaticMetadata"],
      },
    },
  }

  var identifierQuery = { filename: receivedData["filename"] }

  //Creates a new connection. Not ideal, but works
  MongoClient.connect(
    "mongodb+srv://admin:admin@d0027e.ahhsh.mongodb.net",
    (err, client) => {
      const db = client.db("Bothniabladet")
      db.collection("upload.files").updateOne(
        identifierQuery,
        updateItem,
        (err, result) => {
          console.log(result)
          client.close()
        }
      )
    }
  )
})

// GET /
// Loads form
app.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("index", { files: false })
    } else {
      files.map((file) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true
        } else {
          file.isImage = false
        }
      })
      res.render("index", { files: files })
    }
  })
})

// GET /files
// Display all files in JSON
app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      })
    }

    // Files exist
    return res.json(files)
  })
})

// GET /files/:filename
// Display single file object
app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      })
    }
    // File exists
    return res.json(file)
  })
})

// GET /image/:filename
// Display Image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      })
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gridfsBucket.openDownloadStreamByName(file.filename)
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: "Not an image",
      })
    }
  })
})

// DELETE /files/:id
// Delete file
app.delete("/files/:id", (req, res) => {
  id = objectId(req.params.id)

  // Should use gfs.remove({ _id: id}) instead, but gridfs-stream has not been updated according to mongoose
  const bucket = new mongoose.mongo.GridFSBucket(mongooseClient.db, {
    bucketName: "upload",
  })
  bucket.delete(id)
  res.redirect("/")
})

const port = 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
