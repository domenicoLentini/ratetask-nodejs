const express = require("express");
const bodyParser = require("body-parser");
const RatesRoutes = require("./routes/RatesRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
app.use("/", RatesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});