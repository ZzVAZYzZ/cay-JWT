const express = require('express');
const errorHandler = require('./middleware/errorhandler');
const connectDb = require('./configs/dbConnection');
const cron = require("node-cron");
const deleteOldTokens = require('./jobs/deleteOldTokenJob');
const initRedis = require('./configs/redisConnection')
const app = express();

//jobs: schedule
cron.schedule("0 0 * * *", () => {
  deleteOldTokens();
}, {
  timezone: "Asia/Ho_Chi_Minh"
});


//CORS CONFIGS
app.use(function(req, res, next) {
  // Allow requests from all origins
  res.header("Access-Control-Allow-Origin", "*");
  // Allow specific headers
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // Allow specific HTTP methods
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const dotenv = require("dotenv").config();

initRedis.connectRedis();
connectDb();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})