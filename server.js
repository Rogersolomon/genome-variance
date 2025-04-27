const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware for error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Middleware for input sanitization
const sanitizeInput = (req, res, next) => {
    if (req.query.q) {
        req.query.q = req.query.q.toLowerCase().replace(/[^a-z0-9\s\-_,]/g, '');
    }
    next();
};

// Function to load CSV with dynamic separator detection
const loadCSV = (filePath, separator = ',') => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser({ separator }))
            .on('headers', headers => console.log(`Loaded ${filePath}:`, headers))
            .on('data', data => results.push(data))
            .on('end', () => {
                console.log(`Loaded ${results.length} records from ${filePath}`);
                resolve(results);
            })
            .on('error', err => reject(`Error loading ${filePath}: ${err.message}`));
    });
};

let clinvarData = [];
let mitochondrialData = [];
let geneData = [];

// Load all datasets with retry logic
const loadAllData = async (attempts = 3) => {
    try {
        [clinvarData, mitochondrialData, geneData] = await Promise.all([
            loadCSV('data/clinvar.csv'),
            loadCSV('data/mitochondrial.csv', '\t'), // Set separator for TSV
            loadCSV('data/gene.csv')
        ]);
    } catch (error) {
        if (attempts > 0) {
            console.log(`Retrying data load (${attempts} attempts remaining)...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return loadAllData(attempts - 1);
        }
        console.error('Data load failed:', error);
        process.exit(1);
    }
};

// Initialize data loading
loadAllData();

// Function to filter dataset
const filterData = (dataset, keys, query) => {
    if (!query || query.length < 2) return [];
    query = query.toLowerCase();

    try {
        return dataset.filter(item =>
            keys.some(k => item[k] && item[k].toLowerCase().includes(query))
        ).slice(0, 100);
    } catch (error) {
        console.error('Error filtering data:', error);
        return [];
    }
};

// Search APIs
app.get('/search/clinvar', sanitizeInput, (req, res) => {
    const query = req.query.q || '';
    const results = filterData(clinvarData, ['Name', 'Gene(s)', 'Condition(s)', 'Variant type'], query);
    console.log(`[ClinVar] Query: "${query}" - ${results.length} results`);
    res.json(results);
});

app.get('/search/mitochondrial', sanitizeInput, (req, res) => {
    const query = req.query.q || '';
    const results = filterData(mitochondrialData, ['PMID', 'Title', 'Authors', 'Journal/Book', 'DOI'], query);
    console.log(`[Mitochondrial] Query: "${query}" - ${results.length} results`);
    res.json(results);
});

app.get('/search/gene', sanitizeInput, (req, res) => {
    const query = req.query.q || '';
    const results = filterData(geneData, ['Symbol', 'description', 'GeneID'], query);
    console.log(`[Gene] Query: "${query}" - ${results.length} results`);
    res.json(results);
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        dataLoaded: clinvarData.length > 0 && mitochondrialData.length > 0 && geneData.length > 0
    });
});

// Serve static files with cache control
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
