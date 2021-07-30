// Import dependencies and libraries.
const express = require("express");
const path = require("path");

// Initialize application.
const app = express();

// Setting static middleware.
const staticMiddleware = express.static(path.join(__dirname, "public"));
app.use(staticMiddleware);

// Listen server in env port or 5000 as default.
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    "[Server] App listening on port 5000, visit http://127.0.0.1:" + port
  );
});
