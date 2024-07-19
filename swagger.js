const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: 
    {
        title: "API Documentation",
        description: "This is the API documentation for the Travel Planner application.",
    },
    host: "final-project-y4dc.onrender.com",
}

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];



swaggerAutogen(outputFile, routes, doc)