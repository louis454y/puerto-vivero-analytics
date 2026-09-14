require("dotenv").config();

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const rutaExcel = path.resolve(
    process.env.USERPROFILE,
    "Downloads",
    "Puerto_Vivero_Cotizaciones.xlsx"
);

const workbook = XLSX.readFile(rutaExcel, {
    cellDates: false
});

const hoja = workbook.Sheets["COTIZACIONES"];

const filas = XLSX.utils.sheet_to_json(hoja, {
    defval: null,
    raw: true
});

const ids = filas
    .map(fila => fila["Cotización"])
    .filter(valor => valor !== null && String(valor).trim() !== "")
    .map(valor => String(valor).trim());

const conteo = {};

for (const id of ids) {
    conteo[id] = (conteo[id] || 0) + 1;
}

console.log("");
console.log("==========================================");
console.log("VERIFICACIÓN DE COTIZACIONES");
console.log("==========================================");
console.log("");

console.log("Filas con ID:", ids.length);
console.log("IDs únicos:", Object.keys(conteo).length);

console.log("");
console.log("REPETIDOS:");

const repetidos = Object.entries(conteo)
    .filter(([id, cantidad]) => cantidad > 1);

if (repetidos.length === 0) {
    console.log("No hay IDs repetidos.");
} else {
    for (const [id, cantidad] of repetidos) {
        console.log(`${id} → ${cantidad} veces`);
    }
}

console.log("");