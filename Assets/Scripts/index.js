const searchInput = document.querySelector('input[placeholder="Search"]');
const filtersOffcanvas = document.querySelector("#filters");
const detailsOffcanvas = document.querySelector("#details");
const palettesContainer = document.querySelector(".row.g-3");
const filterInputs = document.querySelectorAll("#filters .form-check-input");
const colorRange = document.querySelector("#count");

let palettes = [];

async function fetchPalettes() {
    try {
        const response = await fetch('palettes.json');
        palettes = await response.json();
        renderPalettes(palettes);
    } catch (error) {
        console.error('Error fetching palettes:', error);
    }
}

function renderPalettes(filteredPalettes) {
    palettesContainer.innerHTML = '';
    filteredPalettes.forEach(palette => {
        const card = document.createElement('div');
        card.classList.add('col-md-4');
        card.innerHTML = `
            <div class="palette-card">
                <div class="palette-colors">
                    ${palette.hexs.map(hex => `<div class="palette-color" style="background: ${hex};"></div>`).join('')}
                </div>
                <div class="palette-info">
                    <div class="details">
                        <h6>${palette.name}</h6>
                        <p>${palette.hexs.length} Colors</p>
                    </div>
                    <i class="ph ph-dots-three-outline details-icon" data-bs-toggle="offcanvas" data-bs-target="#details" aria-label="Details" onclick="showDetails('${palette.name}')"></i>
                </div>
            </div>
        `;
        palettesContainer.appendChild(card);
    });
}

function showDetails(paletteName) {
    const palette = palettes.find(p => p.name === paletteName);
    const detailsModal = document.querySelector('#details');
    const detailsBody = detailsModal.querySelector('.offcanvas-body');
    detailsModal.querySelector('.offcanvas-title').textContent = palette.name;

    detailsBody.innerHTML = `
        <h6>Colors:</h6>
        ${palette.hexs.map(hex => `<div style="background: ${hex};" class="border rounded p-2 mb-2">${hex}</div>`).join('')}
    `;
}

function filterPalettes() {
    let filteredPalettes = [...palettes];

    if (searchInput.value) {
        filteredPalettes = filteredPalettes.filter(palette =>
            palette.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
    }

    if (!showAllCheckbox.checked) {
        const colorCount = parseInt(colorRange.value, 10);
        filteredPalettes = filteredPalettes.filter(palette => palette.hexs.length === colorCount);
    }

    const colorTags = Array.from(filterInputs).filter(input => input.checked).map(input => input.value);
    if (colorTags.length > 0) {
        filteredPalettes = filteredPalettes.filter(palette =>
            colorTags.every(tag => palette.tags.includes(tag))
        );
    }

    const selectedTemperature = Array.from(filterInputs)
        .filter(input => ['warm', 'cool', 'neutral'].includes(input.value) && input.checked)
        .map(input => input.value);

    if (selectedTemperature.length > 0) {
        filteredPalettes = filteredPalettes.filter(palette =>
            selectedTemperature.includes(palette.temp)
        );
    }

    renderPalettes(filteredPalettes);
}

searchInput.addEventListener("input", filterPalettes);
filterInputs.forEach(input => input.addEventListener("change", filterPalettes));
colorRange.addEventListener("input", filterPalettes);
showAllCheckbox.addEventListener("change", toggleSlider);

function toggleSlider() {
    if (showAllCheckbox.checked) {
        colorRange.disabled = true;
    } else {
        colorRange.disabled = false;
    }
}

fetchPalettes();