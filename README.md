Chemical Data Explorer
Description
Chemical Data Explorer is a web platform that provides easy access to chemical, genetic, and mitochondrial data. It aggregates information from multiple databases, allowing users to explore chemical properties, genetic mutations, and more through a user-friendly interface.

Features
Comprehensive search across ClinVar variants, mitochondrial data, and gene information
Real-time data updates
User-friendly interface with dedicated pages for each dataset
Installation
Clone the repository
Navigate to the backend directory
Run npm install to install dependencies
Running the Project
Run the backend server with:


npm start
The server runs on port 8000 by default.

API Endpoints
/search/clinvar?q=your_query - Search ClinVar dataset
/search/mitochondrial?q=your_query - Search Mitochondrial dataset
/search/gene?q=your_query - Search Gene dataset
/health - Health check endpoint
Frontend
The frontend is served as static files from the public directory. Access the homepage at http://localhost:8000/index.html.

Deployment
The project includes a Procfile for deployment on platforms like Heroku.

Dependencies
express
csv-parser
multer
fs
