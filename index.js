const express = require("express");
const app = express();
const cors = require("cors");

const usersRoutes = require("./routes/users");
const exercisesRoutes = require("./routes/exercises");

require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRoutes);
app.use("/api/users", exercisesRoutes);

app.use((err, req, res, next) => {
  console.error(res.status);
  res.status(500).json({ error: err.message });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
