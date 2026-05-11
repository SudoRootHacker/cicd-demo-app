const express = require("express");
const healthRoute = require("./routes/health");

const app = express();

app.use("/health", healthRoute);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
