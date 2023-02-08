const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", false);
const cookieParser = require("cookie-parser");

const imageDownloader = require("image-downloader");

const multer = require("multer");

//rename files on server
const fs = require("fs");

const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

//show photos in browser
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "codewithjosh.com";

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/test", (req, res) => {
  res.json("success");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User does not exist");

  const passOk = await bcrypt.compare(password, user.password);
  if (!passOk) return res.status(400).json("Invalid username or password");

  const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret);

  res.cookie("token", token).json(user);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;

  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", async (req, res) => {
  const { token } = req.cookies;

  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    res.json(place);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;

    const places = await Place.find({ owner: id });

    res.json(places);
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);

  res.json(place);
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;

  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const place = await Place.findById(id);
    if (userData.id === place.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await place.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  const places = await Place.find();
  res.json(places);
});

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);

  const { place, checkIn, checkOut, noOfGuests, name, email, price } = req.body;

  const booking = await Booking.create({
    user: userData.id,
    place,
    checkIn,
    checkOut,
    noOfGuests,
    name,
    email,
    price,
  });

  res.json(booking);
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);

  const bookings = await Booking.find({ user: userData.id }).populate("place");

  res.json(bookings);
});

app.listen(4000);
