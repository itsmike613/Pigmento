const palettes = [
    {
        name: "Sunny Vibes",
        hexs: ["#FF5733", "#8D5B4B"],
        cont: ["red", "brown"],
        tags: ["brand"],
        temp: "warm"
    },
    {
        name: "Cool Evening",
        hexs: ["#6C5B7F", "#355C7D", "#F8B400"],
        cont: ["blue"],
        tags: ["pastel", "skin"],
        temp: "cool"
    }
];

const searchInput = document.querySelector('input[placeholder="Search"]');
const filtersOffcanvas = document.querySelector("#filters");
const detailsOffcanvas = document.querySelector("#details");
const palettesContainer = document.querySelector(".row.g-3");
const filterInputs = document.querySelectorAll("#filters .form-check-input");
const colorRange = document.querySelector("#count");

function renderPalettes(filteredPalettes) {
    palettesContainer.innerHTML = "";

    filteredPalettes.forEach((palette) => {
        const card = document.createElement("div");
        card.className = "col-md-4";

        card.innerHTML = `
            <div class="palette-card">
                <div class="palette-colors">
                    ${palette.hexs.map(color => `<div class="palette-color" style="background: ${color};"></div>`).join("")}
                </div>
                <div class="palette-info">
                    <div class="details">
                        <h6>${palette.name}</h6>
                        <p>${palette.hexs.length} Colors</p>
                    </div>
                    <i class="ph ph-dots-three-outline details-icon" data-bs-toggle="offcanvas" data-bs-target="#details" aria-label="Details"></i>
                </div>
            </div>
        `;

        card.querySelector(".details-icon").addEventListener("click", () => showDetails(palette));
        palettesContainer.appendChild(card);
    });
}

function showDetails(palette) {
    detailsOffcanvas.querySelector(".offcanvas-title").textContent = palette.name;

    const colorsContainer = detailsOffcanvas.querySelector(".offcanvas-body");
    colorsContainer.innerHTML = `
        <h6>Colors:</h6>
        ${palette.hexs.map(color => `
            <div style="background: ${color};" class="border rounded p-2 mb-2">${color}</div>
        `).join("")}
    `;
}

function filterPalettes() {
    const searchQuery = searchInput.value.toLowerCase();
    const activeFilters = Array.from(filterInputs)
        .filter(input => input.checked)
        .reduce((acc, input) => {
            if (!acc[input.name]) acc[input.name] = [];
            acc[input.name].push(input.value);
            return acc;
        }, {});
    const colorCount = colorRange.value;

    const filtered = palettes.filter(palette => {
        const matchesSearch = palette.name.toLowerCase().includes(searchQuery);
        const matchesFilters = Object.entries(activeFilters).every(([key, values]) =>
            values.some(value => palette[key]?.includes(value))
        );
        const matchesColorCount = palette.hexs.length <= colorCount;

        return matchesSearch && matchesFilters && matchesColorCount;
    });

    renderPalettes(filtered);
}

searchInput.addEventListener("input", filterPalettes);
filterInputs.forEach(input => input.addEventListener("change", filterPalettes));
colorRange.addEventListener("input", filterPalettes);

renderPalettes(palettes);
