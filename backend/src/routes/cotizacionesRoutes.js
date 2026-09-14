const express = require("express");
const prisma = require("../db/prisma");

const router = express.Router();

/*
============================================================
GET /api/cotizaciones
============================================================

Devuelve las cotizaciones agrupadas por su ID.

Una cotización puede tener varios productos:

PV-001
 ├── Producto A
 ├── Producto B
 └── Producto C

Las filas individuales siguen almacenadas en PostgreSQL,
pero la API las presenta como una sola cotización.
============================================================
*/

router.get("/", async (req, res) => {
    try {
        const filas = await prisma.cotizacion.findMany({
            orderBy: {
                fecha: "desc"
            }
        });

        const grupos = new Map();

        for (const fila of filas) {
            const idCotizacion = fila.cotizacion;

            if (!grupos.has(idCotizacion)) {
                grupos.set(idCotizacion, {
                    cotizacion: idCotizacion,
                    fecha: fila.fecha,
                    fechaLocal: fila.fechaLocal,
                    estado: fila.estado,
                    origen: fila.origen,

                    cliente: {
                        nombre: fila.nombre,
                        apellido: fila.apellido,
                        celular: fila.celular,
                        direccion: fila.direccion,
                        ciudad: fila.ciudad
                    },

                    estadoComercial: fila.estadoComercial,
                    responsable: fila.responsable,
                    observaciones: fila.observaciones,

                    unidadesTotales: 0,
                    productos: []
                });
            }

            const grupo = grupos.get(idCotizacion);

            grupo.productos.push({
                id: fila.id,
                productoId: fila.productoId,
                producto: fila.producto,
                categoria: fila.categoria,
                subcategoria: fila.subcategoria,
                altura: fila.altura,
                cantidad: fila.cantidad,
                referencias: fila.referencias,
                unidadesTotales: fila.unidadesTotales
            });

            /*
            Sumamos las cantidades de los productos
            para obtener el total real de unidades.
            */
            grupo.unidadesTotales += Number(fila.cantidad || 0);
        }

        const cotizaciones = Array.from(grupos.values());

        res.json({
            ok: true,

            total: cotizaciones.length,

            filas: filas.length,

            cotizaciones
        });

    } catch (error) {
        console.error(
            "Error obteniendo cotizaciones:",
            error
        );

        res.status(500).json({
            ok: false,
            mensaje: "No se pudieron obtener las cotizaciones"
        });
    }
});

module.exports = router;