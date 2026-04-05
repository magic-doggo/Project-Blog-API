const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: "asdasd"
    })
})

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});