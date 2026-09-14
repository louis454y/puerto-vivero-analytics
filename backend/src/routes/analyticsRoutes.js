const express = require("express");

const {
    obtenerAnalytics
} = require("../services/analyticsService");

const router = express.Router();

/**
 * GET /api/analytics
 *
 * Parámetro:
 * ?days=7
 * ?days=30
 * ?days=90
 */
router.get("/", async (req, res) => {
    try {
        const days = Number(req.query.days) || 7;

        if (![7, 30, 90].includes(days)) {
            return res.status(400).json({
                ok: false,
                error: "El parámetro days debe ser 7, 30 o 90."
            });
        }

        const analytics = await obtenerAnalytics(days);

        return res.json(analytics);

    } catch (error) {

        console.error(
            "Error obteniendo datos de Google Analytics:",
            error
        );

        return res.status(500).json({
            ok: false,
            error: "No se pudieron obtener los datos de Google Analytics.",
            detail: error.message
        });
    }
});

module.exports = router;