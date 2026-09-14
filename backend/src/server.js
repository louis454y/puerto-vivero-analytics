const express = require("express");
const cors = require("cors");
const prisma = require("./db/prisma");
const syncRoutes = require("./routes/syncRoutes");
const cotizacionesRoutes = require("./routes/cotizacionesRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const comercialRoutes = require("./routes/comercialRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/sync", syncRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/comercial", comercialRoutes);
app.use("/api/analytics", analyticsRoutes);
const PORT = process.env.PORT || 3000;

app.get("/api/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            ok: true,
            service: "Puerto Vivero Analytics API",
            database: "connected"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            service: "Puerto Vivero Analytics API",
            database: "disconnected"
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Puerto Vivero Analytics API ejecutándose en http://localhost:${PORT}`
    );
});