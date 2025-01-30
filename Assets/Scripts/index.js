const jsonURL = 'data.json';
let data = [];
let filters = { search: '', tags: [], min: null, max: null };

fetch(jsonURL)
    .then(res => res.json())
    .then(json => {
        data = json;
        generateTagFilters();
        displayResults();
    });

function generateTagFilters() {
    const tagSet = new Set(data.flatMap(item => item.tags));
    const tagFiltersDiv = document.getElementById('tag-filters');
    tagSet.forEach(tag => {
        tagFiltersDiv.innerHTML += `
                    <div class='form-check'>
                        <input class='form-check-input' type='checkbox' value='${tag}' onchange='toggleTag("${tag}")'>
                        <label class='form-check-label'>${tag}</label>
                    </div>
                `;
    });
}

function toggleTag(tag) {
    if (filters.tags.includes(tag)) {
        filters.tags = filters.tags.filter(t => t !== tag);
    } else {
        filters.tags.push(tag);
    }
    displayResults();
}

document.getElementById('search').addEventListener('input', (e) => {
    filters.search = e.target.value.toLowerCase();
    displayResults();
});

function updateFilters() {
    filters.min = document.getElementById('min-value').value ? Number(document.getElementById('min-value').value) : null;
    filters.max = document.getElementById('max-value').value ? Number(document.getElementById('max-value').value) : null;
    displayResults();
}

function displayResults() {
    const filteredData = data.filter(item => {
        return (
            (filters.search === '' || item.name.toLowerCase().includes(filters.search) || item.description.toLowerCase().includes(filters.search) || item.tags.some(tag => tag.includes(filters.search))) &&
            (filters.tags.length === 0 || filters.tags.some(tag => item.tags.includes(tag))) &&
            (filters.min === null || item.value >= filters.min) &&
            (filters.max === null || item.value <= filters.max)
        );
    });

    document.getElementById('results').innerHTML = filteredData.map(item => `
                <div class="col">
                    <div class="card p-3">
                        <h5>${item.name}</h5>
                        <p>${item.description}</p>
                        <small>Tags: ${item.tags.join(', ')}</small>
                    </div>
                </div>
            `).join('');

    document.getElementById('result-count').textContent = `Showing ${filteredData.length} results`;
}