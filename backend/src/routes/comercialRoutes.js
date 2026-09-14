const express = require("express");
const prisma = require("../db/prisma");

const router = express.Router();

/*
============================================================
PUERTO VIVERO ANALYTICS
MÓDULO COMERCIAL
============================================================

Funciones:

1. Consultar cotizaciones agrupadas
2. Filtrar por estado
3. Filtrar por ciudad
4. Actualizar estado comercial
5. Obtener seguimiento comercial
6. Calcular días desde la cotización
7. Calcular prioridad de seguimiento

Estados comerciales permitidos:

Pendiente
Contactado
Interesado
Vendido
Perdido
============================================================
*/


/*
============================================================
1. OBTENER COTIZACIONES COMERCIALES
============================================================

GET

/api/comercial/cotizaciones

Filtros:

/api/comercial/cotizaciones?estado=Pendiente

/api/comercial/cotizaciones?ciudad=Barranquilla

/api/comercial/cotizaciones?estado=Vendido&ciudad=Barranquilla
============================================================
*/

router.get("/cotizaciones", async (req, res) => {

    try {

        /*
        ====================================================
        FILTROS
        ====================================================
        */

        const estadoFiltro =
            String(req.query.estado || "")
                .trim()
                .toLowerCase();

        const ciudadFiltro =
            String(req.query.ciudad || "")
                .trim()
                .toLowerCase();


        /*
        ====================================================
        OBTENER FILAS
        ====================================================
        */

        const filas =
            await prisma.cotizacion.findMany({
                orderBy: {
                    fecha: "desc"
                }
            });


        /*
        ====================================================
        AGRUPAR POR COTIZACIÓN
        ====================================================
        */

        const grupos = new Map();

        for (const fila of filas) {

            const idCotizacion =
                fila.cotizacion;


            /*
            =================================================
            CREAR COTIZACIÓN PRINCIPAL
            =================================================
            */

            if (!grupos.has(idCotizacion)) {

                grupos.set(
                    idCotizacion,
                    {
                        cotizacion: idCotizacion,

                        fecha: fila.fecha,

                        fechaLocal: fila.fechaLocal,

                        estado: fila.estado,

                        estadoComercial:
                            fila.estadoComercial ||
                            "Pendiente",

                        origen: fila.origen,

                        cliente: {
                            nombre: fila.nombre,
                            apellido: fila.apellido,
                            celular: fila.celular,
                            direccion: fila.direccion,
                            ciudad: fila.ciudad
                        },

                        productos: [],

                        totalUnidades: 0
                    }
                );
            }


            const cotizacion =
                grupos.get(idCotizacion);


            /*
            =================================================
            AGREGAR PRODUCTO
            =================================================
            */

            cotizacion.productos.push({

                id: fila.id,

                productoId:
                    fila.productoId,

                producto:
                    fila.producto,

                categoria:
                    fila.categoria,

                subcategoria:
                    fila.subcategoria,

                altura:
                    fila.altura,

                cantidad:
                    Number(fila.cantidad || 0),

                referencias:
                    fila.referencias
            });


            /*
            =================================================
            SUMAR UNIDADES
            =================================================
            */

            cotizacion.totalUnidades +=
                Number(fila.cantidad || 0);
        }


        /*
        ====================================================
        CONVERTIR MAP → ARRAY
        ====================================================
        */

        let cotizaciones =
            Array.from(grupos.values());


        /*
        ====================================================
        FILTRO POR ESTADO COMERCIAL
        ====================================================
        */

        if (estadoFiltro) {

            cotizaciones =
                cotizaciones.filter(
                    cotizacion =>
                        String(
                            cotizacion.estadoComercial
                        )
                            .trim()
                            .toLowerCase() ===
                        estadoFiltro
                );
        }


        /*
        ====================================================
        FILTRO POR CIUDAD
        ====================================================
        */

        if (ciudadFiltro) {

            cotizaciones =
                cotizaciones.filter(
                    cotizacion =>
                        String(
                            cotizacion.cliente.ciudad || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        ciudadFiltro
                );
        }


        /*
        ====================================================
        RESUMEN COMERCIAL
        ====================================================
        */

        const resumen = {

            total:
                cotizaciones.length,

            unidades:
                cotizaciones.reduce(
                    (total, cotizacion) =>
                        total +
                        cotizacion.totalUnidades,
                    0
                ),

            pendientes:
                cotizaciones.filter(
                    cotizacion =>
                        String(
                            cotizacion.estadoComercial
                        )
                            .toLowerCase() ===
                        "pendiente"
                ).length,

            contactados:
                cotizaciones.filter(
                    cotizacion =>
                        String(
                            cotizacion.estadoComercial
                        )
                            .toLowerCase() ===
                        "contactado"
                ).length,

            interesados:
                cotizaciones.filter(
                    cotizacion =>
                        String(
                            cotizacion.estadoComercial
                        )
                            .toLowerCase() ===
                        "interesado"
                ).length,

            vendidos:
                cotizaciones.filter(
                    cotizacion =>
                        String(
                            cotizacion.estadoComercial
                        )
                            .toLowerCase() ===
                        "vendido"
                ).length,

            perdidos:
                cotizaciones.filter(
                    cotizacion =>
                        String(
                            cotizacion.estadoComercial
                        )
                            .toLowerCase() ===
                        "perdido"
                ).length
        };


        /*
        ====================================================
        RESPUESTA
        ====================================================
        */

        res.json({

            ok: true,

            filtros: {

                estado:
                    req.query.estado || null,

                ciudad:
                    req.query.ciudad || null
            },

            resumen,

            cotizaciones
        });

    } catch (error) {

        console.error(
            "Error obteniendo cotizaciones comerciales:",
            error
        );

        res.status(500).json({

            ok: false,

            mensaje:
                "No se pudieron obtener las cotizaciones comerciales"
        });
    }
});


/*
============================================================
2. ACTUALIZAR ESTADO COMERCIAL
============================================================

PATCH

/api/comercial/cotizaciones/:cotizacion/estado

Ejemplo:

PV-20260903-215059-7738

Estados:

Pendiente
Contactado
Interesado
Vendido
Perdido

IMPORTANTE:

Si una cotización tiene varios productos,
todas sus filas se actualizan.
============================================================
*/

router.patch(
    "/cotizaciones/:cotizacion/estado",
    async (req, res) => {

        try {

            const cotizacionId =
                String(
                    req.params.cotizacion || ""
                ).trim();


            const nuevoEstado =
                String(
                    req.body.estado || ""
                ).trim();


            /*
            =================================================
            ESTADOS PERMITIDOS
            =================================================
            */

            const estadosPermitidos = [

                "Pendiente",

                "Contactado",

                "Interesado",

                "Vendido",

                "Perdido"

            ];


            /*
            =================================================
            VALIDAR ID
            =================================================
            */

            if (!cotizacionId) {

                return res.status(400).json({

                    ok: false,

                    mensaje:
                        "El ID de la cotización es obligatorio"
                });
            }


            /*
            =================================================
            VALIDAR ESTADO
            =================================================
            */

            if (
                !estadosPermitidos.includes(
                    nuevoEstado
                )
            ) {

                return res.status(400).json({

                    ok: false,

                    mensaje:
                        "Estado comercial no válido",

                    estadosPermitidos
                });
            }


            /*
            =================================================
            ACTUALIZAR TODAS LAS FILAS
            =================================================
            */

            const resultado =
                await prisma.cotizacion.updateMany({

                    where: {

                        cotizacion:
                            cotizacionId
                    },

                    data: {

                        estadoComercial:
                            nuevoEstado
                    }
                });


            /*
            =================================================
            COTIZACIÓN NO ENCONTRADA
            =================================================
            */

            if (resultado.count === 0) {

                return res.status(404).json({

                    ok: false,

                    mensaje:
                        "No se encontró la cotización"
                });
            }


            /*
            =================================================
            RESPUESTA
            =================================================
            */

            res.json({

                ok: true,

                mensaje:
                    "Estado comercial actualizado correctamente",

                cotizacion:
                    cotizacionId,

                estadoComercial:
                    nuevoEstado,

                filasActualizadas:
                    resultado.count
            });

        } catch (error) {

            console.error(
                "Error actualizando estado comercial:",
                error
            );

            res.status(500).json({

                ok: false,

                mensaje:
                    "No se pudo actualizar el estado comercial"
            });
        }
    }
);


/*
============================================================
3. SEGUIMIENTO COMERCIAL
============================================================

GET

/api/comercial/seguimiento

Devuelve únicamente cotizaciones que todavía requieren
seguimiento comercial:

Pendiente
Contactado
Interesado

Excluye:

Vendido
Perdido

Calcula:

- días desde la cotización
- prioridad
- cliente
- WhatsApp/celular
- ciudad
- productos
- unidades
============================================================
*/

router.get(
    "/seguimiento",
    async (req, res) => {

        try {

            /*
            =================================================
            OBTENER TODAS LAS FILAS
            =================================================
            */

            const filas =
                await prisma.cotizacion.findMany({

                    orderBy: {

                        fecha: "asc"
                    }
                });


            /*
            =================================================
            AGRUPAR POR COTIZACIÓN
            =================================================
            */

            const grupos =
                new Map();


            for (const fila of filas) {

                const idCotizacion =
                    fila.cotizacion;


                /*
                =============================================
                CREAR COTIZACIÓN
                =============================================
                */

                if (
                    !grupos.has(
                        idCotizacion
                    )
                ) {

                    grupos.set(
                        idCotizacion,
                        {

                            cotizacion:
                                idCotizacion,

                            fecha:
                                fila.fecha,

                            fechaLocal:
                                fila.fechaLocal,

                            estadoComercial:
                                String(
                                    fila.estadoComercial ||
                                    "Pendiente"
                                ).trim(),

                            cliente: {

                                nombre:
                                    fila.nombre,

                                apellido:
                                    fila.apellido,

                                celular:
                                    fila.celular,

                                direccion:
                                    fila.direccion,

                                ciudad:
                                    fila.ciudad
                            },

                            productos: [],

                            totalUnidades:
                                0
                        }
                    );
                }


                const cotizacion =
                    grupos.get(
                        idCotizacion
                    );


                /*
                =============================================
                AGREGAR PRODUCTO
                =============================================
                */

                cotizacion.productos.push({

                    productoId:
                        fila.productoId,

                    producto:
                        fila.producto,

                    categoria:
                        fila.categoria,

                    altura:
                        fila.altura,

                    cantidad:
                        Number(
                            fila.cantidad || 0
                        )
                });


                /*
                =============================================
                SUMAR UNIDADES
                =============================================
                */

                cotizacion.totalUnidades +=
                    Number(
                        fila.cantidad || 0
                    );
            }


            /*
            =================================================
            CALCULAR DÍAS Y PRIORIDAD
            =================================================
            */

            const ahora =
                new Date();


            const seguimiento =
                Array.from(
                    grupos.values()
                )
                    .map(
                        cotizacion => {

                            const fechaCotizacion =
                                cotizacion.fecha
                                    ? new Date(
                                        cotizacion.fecha
                                    )
                                    : null;


                            let diasDesdeCotizacion =
                                null;


                            if (
                                fechaCotizacion
                            ) {

                                const diferencia =
                                    ahora.getTime() -
                                    fechaCotizacion.getTime();


                                diasDesdeCotizacion =
                                    Math.max(

                                        0,

                                        Math.floor(

                                            diferencia /
                                            (
                                                1000 *
                                                60 *
                                                60 *
                                                24
                                            )
                                        )
                                    );
                            }


                            /*
                            =================================
                            PRIORIDAD
                            =================================
                            */

                            let prioridad =
                                "Normal";


                            const estado =
                                cotizacion
                                    .estadoComercial
                                    .toLowerCase();


                            if (

                                estado ===
                                    "pendiente" &&

                                diasDesdeCotizacion >=
                                    3

                            ) {

                                prioridad =
                                    "Alta";

                            } else if (

                                estado ===
                                    "pendiente" &&

                                diasDesdeCotizacion >=
                                    1

                            ) {

                                prioridad =
                                    "Media";
                            }


                            return {

                                ...cotizacion,

                                diasDesdeCotizacion,

                                prioridad
                            };
                        }
                    )
                    /*
                    =========================================
                    SOLO COTIZACIONES ACTIVAS
                    =========================================
                    */

                    .filter(
                        cotizacion => {

                            const estado =
                                cotizacion
                                    .estadoComercial
                                    .toLowerCase();


                            return (

                                estado ===
                                    "pendiente" ||

                                estado ===
                                    "contactado" ||

                                estado ===
                                    "interesado"
                            );
                        }
                    )
                    /*
                    =========================================
                    ORDENAR POR PRIORIDAD
                    =========================================
                    */

                    .sort(
                        (a, b) => {

                            const prioridadOrden = {

                                Alta: 1,

                                Media: 2,

                                Normal: 3
                            };


                            return (

                                prioridadOrden[
                                    a.prioridad
                                ] -

                                prioridadOrden[
                                    b.prioridad
                                ]
                            );
                        }
                    );


            /*
            =================================================
            RESUMEN DEL SEGUIMIENTO
            =================================================
            */

            const resumen = {

                total:
                    seguimiento.length,

                pendientes:
                    seguimiento.filter(
                        item =>
                            item.estadoComercial
                                .toLowerCase() ===
                            "pendiente"
                    ).length,

                contactados:
                    seguimiento.filter(
                        item =>
                            item.estadoComercial
                                .toLowerCase() ===
                            "contactado"
                    ).length,

                interesados:
                    seguimiento.filter(
                        item =>
                            item.estadoComercial
                                .toLowerCase() ===
                            "interesado"
                    ).length,

                prioridadAlta:
                    seguimiento.filter(
                        item =>
                            item.prioridad ===
                            "Alta"
                    ).length,

                prioridadMedia:
                    seguimiento.filter(
                        item =>
                            item.prioridad ===
                            "Media"
                    ).length
            };


            /*
            =================================================
            RESPUESTA
            =================================================
            */

            res.json({

                ok: true,

                resumen,

                seguimiento
            });

        } catch (error) {

            console.error(
                "Error obteniendo seguimiento comercial:",
                error
            );

            res.status(500).json({

                ok: false,

                mensaje:
                    "No se pudo obtener el seguimiento comercial"
            });
        }
    }
);


/*
============================================================
EXPORTAR ROUTER
============================================================
*/

module.exports = router;