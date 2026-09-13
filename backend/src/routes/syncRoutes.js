const express = require("express");
const { sincronizarGoogleSheets } = require("../services/syncGoogleSheets");

const router = express.Router();

router.post("/google-sheets", async (req, res) => {
    try {
        const resultado = await sincronizarGoogleSheets();

        res.json({
            ok: true,
            mensaje: "Sincronización desde Google Sheets completada correctamente",
            resultado
        });

    } catch (error) {
        console.error("Error sincronizando Google Sheets:", error);

        res.status(500).json({
            ok: false,
            mensaje: "No se pudo sincronizar Google Sheets",
            error: error.message
        });
    }
});

module.exports = router;