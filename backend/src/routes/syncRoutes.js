const express = require("express");
const { sincronizarExcel } = require("../services/syncExcel");

const router = express.Router();

router.post("/excel", async (req, res) => {
    try {
        const resultado = await sincronizarExcel();

        res.json({
            ok: true,
            mensaje: "Sincronización completada correctamente",
            resultado
        });

    } catch (error) {
        console.error("Error sincronizando Excel:", error);

        res.status(500).json({
            ok: false,
            mensaje: "No se pudo sincronizar el Excel",
            error: error.message
        });
    }
});

module.exports = router;