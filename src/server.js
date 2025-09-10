const express = require("express");
const routes = require("./router");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", routes);

// app.use((req, res) => {
//   res.status(404).json({ error: "Not Found" });
// });

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
