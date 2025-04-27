// Common functions for all search pages
document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners for Enter key on all search inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const button = this.nextElementSibling;
                if (button && button.tagName === 'BUTTON') {
                    button.click();
                }
            }
        });
    });
});

// ClinVar Search Function
async function searchClinVar() {
    const query = document.getElementById('clinvar-search').value.trim();
    if (!query) return;

    const resultsContainer = document.getElementById('clinvar-results');
    resultsContainer.innerHTML = '<div class="col-span-full text-center py-8"><i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i></div>';

    try {
        const response = await fetch(`/search/clinvar?q=${encodeURIComponent(query)}`);

        const data = await response.json();

        displayClinVarResults(data, resultsContainer);
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="col-span-full text-center py-8 text-red-500">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Error fetching results. Please try again.
            </div>
        `;
        console.error('Search error:', error);
    }
}

function displayClinVarResults(results, container) {
    if (!results || results.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-search-minus mr-2"></i>
                No results found
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer';
        card.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${result['Name'] || ''}</h3>
                <p class="text-gray-600 mb-1"><span class="font-medium">GRCh37 Location:</span> ${result['GRCh37Location'] || ''}</p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Molecular Consequence:</span> ${result['Molecular consequence'] || ''}</p>
            </div>
        `;
        card.addEventListener('click', () => showDataPopup(result, 'clinvar'));
        container.appendChild(card);
    });
}

// Mitochondrial Search Function
async function searchMitochondrial() {
    const query = document.getElementById('mitochondrial-search').value.trim();
    if (!query) return;

    const resultsContainer = document.getElementById('mitochondrial-results');
    resultsContainer.innerHTML = '<div class="col-span-full text-center py-8"><i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i></div>';

    try {
        const response = await fetch(`/search/mitochondrial?q=${encodeURIComponent(query)}`);

        const data = await response.json();

        displayMitochondrialResults(data, resultsContainer);
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="col-span-full text-center py-8 text-red-500">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Error fetching results. Please try again.
            </div>
        `;
        console.error('Search error:', error);
    }
}

function displayMitochondrialResults(results, container) {
    if (!results || results.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-search-minus mr-2"></i>
                No results found
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer';
        card.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${result.Title || ''}</h3>
                <p class="text-gray-600 mb-1"><span class="font-medium">Authors:</span> ${result.Authors || ''}</p>
                <p class="text-gray-600 mb-3"><span class="font-medium">Journal:</span> ${result.Journal || ''}</p>
                <div class="text-sm text-gray-500">${result.Year || ''}</div>
            </div>
        `;
        card.addEventListener('click', () => showDataPopup(result, 'mitochondrial'));
        container.appendChild(card);
    });
}

// Gene Search Function
async function searchGene() {
    const query = document.getElementById('gene-search').value.trim();
    if (!query) return;

    const resultsContainer = document.getElementById('gene-results');
    resultsContainer.innerHTML = '<div class="col-span-full text-center py-8"><i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i></div>';

    try {
        const response = await fetch(`/search/gene?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        displayGeneResults(data, resultsContainer);
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="col-span-full text-center py-8 text-red-500">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Error fetching results. Please try again.
            </div>
        `;
        console.error('Search error:', error);
    }
}

function displayGeneResults(results, container) {
    if (!results || results.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-search-minus mr-2"></i>
                No results found
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    results.forEach(result => {
        const geneTitle = result.Name || result['Gene(s)'] || result['Gene ID'] || result.id || '';
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer';
        card.innerHTML = `
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${geneTitle}</h3>
                <p class="text-gray-600 mb-1"><span class="font-medium">Gene ID:</span> ${result.GeneID || result['Gene ID'] || ''}</p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Description:</span> ${result.description || result.Description || ''}</p>
                ${result['Protein change'] ? `<p class="text-gray-600 mb-1"><span class="font-medium">Protein Change:</span> ${result['Protein change']}</p>` : ''}
                ${result['Condition(s)'] ? `<p class="text-gray-600 mb-1"><span class="font-medium">Condition:</span> ${result['Condition(s)']}</p>` : ''}
                ${result['Variant type'] ? `<p class="text-gray-600 mb-1"><span class="font-medium">Variant Type:</span> ${result['Variant type']}</p>` : ''}
                ${result['Clinical significance'] ? `<p class="text-gray-600 mb-1"><span class="font-medium">Clinical Significance:</span> ${result['Clinical significance']}</p>` : ''}
                ${result['dbSNP ID'] ? `<p class="text-gray-600 mb-1"><span class="font-medium">dbSNP:</span> ${result['dbSNP ID']}</p>` : ''}
                <div class="text-sm text-gray-500 mt-2">${result['Review status'] || ''}</div>
            </div>
        `;
        card.addEventListener('click', () => showDataPopup(result, 'gene'));
        container.appendChild(card);
    });
}

function showDataPopup(data, type) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50';

    const content = document.createElement('div');
    content.className = 'bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4 pb-3 border-b border-gray-200';

    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-gray-800';
    title.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Data Details`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'text-gray-500 hover:text-gray-700 text-xl focus:outline-none';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => popup.remove();

    header.appendChild(title);
    header.appendChild(closeBtn);
    content.appendChild(header);

    const dataContent = document.createElement('div');
    dataContent.className = 'grid grid-cols-1 gap-3';

    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'id') {
            const row = document.createElement('div');
            row.className = 'grid grid-cols-3 gap-4 border-b border-gray-100 py-2';

            const keyEl = document.createElement('div');
            keyEl.className = 'font-semibold text-gray-700';
            keyEl.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            const valueEl = document.createElement('div');
            valueEl.className = 'col-span-2 text-gray-800';
            valueEl.textContent = value || '';

            row.appendChild(keyEl);
            row.appendChild(valueEl);
            dataContent.appendChild(row);
        }
    });

    content.appendChild(dataContent);
    popup.appendChild(content);
    document.body.appendChild(popup);
}
