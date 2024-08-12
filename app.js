require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;

// API security
//app.use(helmet());

// Handle CORS error
app.use(cors());

// MongoDB Connection Setup
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Écouter les événements de connexion
const mDb = mongoose.connection;

if(process.env.NODE_ENV !== 'production'){
  mDb.on('connected', () => {
    console.log("MongoDB is connected");
  });
  
  mDb.on('error', (error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Arrêter l'application si la connexion échoue
  });

        // Logger
      app.use(morgan('tiny'));
}



// Set body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Load routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");

// User routers
app.use("/v1/user", userRouter);

// Ticket routers
app.use("/v1/ticket", ticketRouter);

// Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
