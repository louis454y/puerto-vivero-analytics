
const express = require("express");
const prisma = require("../db/prisma");

const router = express.Router();

/*
============================================================
PUERTO VIVERO ANALYTICS
DASHBOARD — RESUMEN GENERAL
============================================================
*/

router.get("/resumen", async (req, res) => {
    try {

        /*
        ====================================================
        1. COTIZACIONES
        ====================================================
        */

        const filasCotizaciones =
            await prisma.cotizacion.findMany({
                select: {
                    cotizacion: true,
                    cantidad: true,
                    estado: true,
                    estadoComercial: true,
                    ciudad: true,
                    celular: true,
                    productoId: true,
                    producto: true,
                    categoria: true
                }
            });

        /*
        Agrupar por ID de cotización.
        Una cotización puede tener varios productos.
        */

        const cotizacionesMap = new Map();

        for (const fila of filasCotizaciones) {

            if (!cotizacionesMap.has(fila.cotizacion)) {
                cotizacionesMap.set(
                    fila.cotizacion,
                    {
                        cotizacion: fila.cotizacion,
                        estado: fila.estado,
                        estadoComercial: fila.estadoComercial,
                        ciudad: fila.ciudad,
                        unidades: 0,
                        productos: []
                    }
                );
            }

            const cotizacion =
                cotizacionesMap.get(fila.cotizacion);

            cotizacion.unidades +=
                Number(fila.cantidad || 0);

            if (fila.productoId) {
                cotizacion.productos.push({
                    productoId: fila.productoId,
                    producto: fila.producto,
                    categoria: fila.categoria,
                    cantidad: Number(fila.cantidad || 0)
                });
            }
        }

        const cotizaciones =
            Array.from(cotizacionesMap.values());

        /*
        ====================================================
        2. MÉTRICAS PRINCIPALES
        ====================================================
        */

        const totalCotizaciones =
            cotizaciones.length;

        const totalUnidades =
            cotizaciones.reduce(
                (total, cotizacion) =>
                    total + cotizacion.unidades,
                0
            );

        const cotizacionesPendientes =
            cotizaciones.filter(
                cotizacion =>
                    String(cotizacion.estadoComercial || "")
                        .trim()
                        .toLowerCase() === "pendiente"
            ).length;

        /*
        ====================================================
        3. CLIENTES ÚNICOS
        ====================================================
        */

        const clientesUnicos = new Set();

        for (const fila of filasCotizaciones) {

            const celular =
                String(fila.celular || "").trim();

            if (celular) {
                clientesUnicos.add(celular);
            }
        }

        /*
        ====================================================
        4. CIUDADES
        ====================================================
        */

        const ciudadesMap = new Map();

        for (const cotizacion of cotizaciones) {

            const ciudad =
                String(cotizacion.ciudad || "").trim();

            if (!ciudad) continue;

            ciudadesMap.set(
                ciudad,
                (ciudadesMap.get(ciudad) || 0) + 1
            );
        }

        const ciudades = Array.from(
            ciudadesMap.entries()
        )
            .map(([ciudad, cantidad]) => ({
                ciudad,
                cantidad
            }))
            .sort(
                (a, b) =>
                    b.cantidad - a.cantidad
            );

        /*
        ====================================================
        5. PRODUCTOS MÁS SOLICITADOS
        ====================================================
        */

        const productosMap = new Map();

        for (const fila of filasCotizaciones) {

            const productoId =
                String(fila.productoId || "").trim();

            if (!productoId) continue;

            if (!productosMap.has(productoId)) {
                productosMap.set(
                    productoId,
                    {
                        productoId,
                        producto: fila.producto,
                        categoria: fila.categoria,
                        unidades: 0,
                        solicitudes: 0
                    }
                );
            }

            const producto =
                productosMap.get(productoId);

            producto.unidades +=
                Number(fila.cantidad || 0);

            producto.solicitudes += 1;
        }

        const productosMasSolicitados =
            Array.from(
                productosMap.values()
            )
                .sort(
                    (a, b) =>
                        b.unidades - a.unidades
                )
                .slice(0, 10);

        /*
        ====================================================
        6. ESTADOS COMERCIALES
        ====================================================
        */

        const estadosMap = new Map();

        for (const cotizacion of cotizaciones) {

            const estado =
                String(
                    cotizacion.estadoComercial ||
                    "Sin estado"
                ).trim();

            estadosMap.set(
                estado,
                (estadosMap.get(estado) || 0) + 1
            );
        }

        const estadosComerciales =
            Array.from(
                estadosMap.entries()
            )
                .map(([estado, cantidad]) => ({
                    estado,
                    cantidad
                }))
                .sort(
                    (a, b) =>
                        b.cantidad - a.cantidad
                );

        /*
        ====================================================
        7. RESPUESTA
        ====================================================
        */

        res.json({
            ok: true,

            resumen: {
                totalCotizaciones,
                totalClientes: clientesUnicos.size,
                totalUnidades,
                cotizacionesPendientes
            },

            ciudades,

            productosMasSolicitados,

            estadosComerciales
        });

    } catch (error) {

        console.error(
            "Error obteniendo resumen del dashboard:",
            error
        );

        res.status(500).json({
            ok: false,
            mensaje:
                "No se pudo obtener el resumen del dashboard"
        });
    }
});

module.exports = router;
