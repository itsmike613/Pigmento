async function loadPalettes() {
    const response = await fetch('palletes.json');
    const palettes = await response.json();
    renderPalettes(palettes);
}

function renderPalettes(palettes) {
    const paletteContainer = document.querySelector('.row.g-3');
    paletteContainer.innerHTML = "";

    palettes.forEach(palette => {
        const col = document.createElement('div');
        col.classList.add('col-md-4');

        col.innerHTML = `
            <div class="palette-card">
                <div class="palette-colors">
                    ${palette.hexs.map(color => `<div class="palette-color" style="background: ${color};"></div>`).join('')}
                </div>
                <div class="palette-info">
                    <div class="details">
                        <h6>${palette.name}</h6>
                        <p>${palette.hexs.length} Colors</p>
                    </div>
                    <i class="ph ph-dots-three-outline details-icon" data-bs-toggle="offcanvas" data-bs-target="#details" aria-label="Details" 
                       data-palette='${JSON.stringify(palette)}'></i>
                </div>
            </div>
        `;
        paletteContainer.appendChild(col);
    });

    attachDetailsListeners();
}

function attachDetailsListeners() {
    const detailsIcons = document.querySelectorAll('.details-icon');
    detailsIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const palette = JSON.parse(this.getAttribute('data-palette'));
            showPaletteDetails(palette);
        });
    });
}

function showPaletteDetails(palette) {
    const detailsContainer = document.querySelector('.offcanvas-body');
    detailsContainer.innerHTML = `<h6>Colors:</h6>`;

    palette.hexs.forEach(hex => {
        detailsContainer.innerHTML += `
            <div style="background: ${hex};" class="border rounded p-2 mb-2">${hex}</div>
        `;
    });

    const offcanvas = new bootstrap.Offcanvas(document.getElementById('details'));
    offcanvas.show();
}

function setupSearch(palettes) {
    const searchInput = document.querySelector('input[placeholder="Search"]');

    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const filteredPalettes = palettes.filter(palette => palette.name.toLowerCase().includes(searchValue));
        renderPalettes(filteredPalettes);
    });
}

function setupFilters(palettes) {
    const filterElements = {
        colors: document.querySelectorAll('input[type="checkbox"][value]'),
        temperature: document.querySelectorAll('input[type="checkbox"][value]'),
        tags: document.querySelectorAll('input[type="checkbox"][value]')
    };

    Object.values(filterElements).forEach(filterGroup => {
        filterGroup.forEach(filter => {
            filter.addEventListener('change', trackFilters);
        });
    });

    function trackFilters() {
        const selectedColors = Array.from(filterElements.colors).filter(input => input.checked).map(input => input.value);
        const selectedTemp = Array.from(filterElements.temperature).filter(input => input.checked).map(input => input.value);
        const selectedTags = Array.from(filterElements.tags).filter(input => input.checked).map(input => input.value);

        const filteredPalettes = palettes.filter(palette => {
            const matchColors = selectedColors.length === 0 || selectedColors.some(color => palette.cont.includes(color));
            const matchTemp = selectedTemp.length === 0 || selectedTemp.includes(palette.temp);
            const matchTags = selectedTags.length === 0 || selectedTags.some(tag => palette.tags.includes(tag));
            return matchColors && matchTemp && matchTags;
        });

        renderPalettes(filteredPalettes);
    }
}

async function init() {
    const response = await fetch('palletes.json');
    const palettes = await response.json();
    renderPalettes(palettes);
    setupSearch(palettes);
    setupFilters(palettes);
}

document.addEventListener('DOMContentLoaded', init);