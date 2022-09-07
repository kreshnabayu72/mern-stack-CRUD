import express from "express";
import mongoose from "mongoose";
import NewsModel from "./model/news.js";
import AccountModel from "./model/account.js";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const upload = multer();

mongoose.connect("mongodb://localhost:27017/news-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = "seasdqewqsd";

app.get("/api/news", async (req, res) => {
  const data = await NewsModel.find();
  res.send(data);
});

app.get("/api/news/:id", async (req, res) => {
  const news = await NewsModel.findById(req.params.id);

  res.send(news);
});

app.get("/api/news/:id/image", async (req, res) => {
  try {
    const news = await NewsModel.findById(req.params.id);
    res.contentType("image/jpeg");
    res.send(news.image);
  } catch (error) {
    res.send(error);
  }
});

app.post("/api/news", upload.single("photo"), async (req, res) => {
  const newNews = new NewsModel({
    title: req.body.title,
    subtitle: req.body.subtitle,
    content: req.body.content,
    writer: req.body.writer,
    image: req.file.buffer,
  });
  try {
    const result = await newNews.save();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/api/news/:id", upload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, content } = req.body;

  try {
    const news = await NewsModel.findById(id);
    const result = await NewsModel.updateOne(news, {
      title,
      subtitle,
      content,
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

app.delete("/api/news/:id", async (req, res) => {
  const result = await NewsModel.findByIdAndDelete(req.params.id);
  res.send(result);
});

app.get("/api/account", async (req, res) => {
  const data = await AccountModel.find();
  res.send(data);
});

app.get("/api/account/:id", async (req, res) => {
  const akun = await AccountModel.findById(req.params.id);
  res.send(akun);
});

app.post("/api/account", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  const newAccount = new AccountModel({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  const result = await newAccount.save();
  res.send(result);
});

app.put("/api/account/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, isAdmin } = req.body;

  try {
    const result = await AccountModel.updateOne(
      { _id: id },
      { username, email, isAdmin }
    );

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.post("/api/account/login", async (req, res) => {
  try {
    const login = await AccountModel.findOne({ username: req.body.username });
    if (!login) {
      res.send({ error: "No Username" });
    }

    if (!(await bcrypt.compare(req.body.password, login.password))) {
      res.send({ error: "Wrong password" });
    }

    const loginId = login._id;
    res.status(200).send({
      user: login,
      token: jwt.sign({ loginId }, JWT_SECRET, { expiresIn: "1d" }),
    });
  } catch (error) {
    res.send({ error });
  }
});

app.delete("/api/account/:id", async (req, res) => {
  const result = await AccountModel.findByIdAndDelete(req.params.id);

  res.send(result);
});

app.listen(5003, () => {
  console.log(5003);
});
