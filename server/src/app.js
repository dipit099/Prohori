// src/app.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const routes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const { connectToStorage, storageService } = require("./config/storage");
const sequelize = require("./config/database"); // Add this

const app = express();

// Middleware
// Middleware
app.use(cors({
  origin: '*', // For development. In production, specify your domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development'
      },
      {
        url: 'http://prohori.eu-north-1.elasticbeanstalk.com/api',
        description: 'Production'
      }
      
    ]
  }
}));

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// Storage connection
connectToStorage()
  .then((storage) => {
    console.log("Connected to storage");
  })
  .catch((error) => {
    console.error("Storage connection failed:", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
