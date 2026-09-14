const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const prisma = require("../db/prisma");

/*
============================================================
PUERTO VIVERO ANALYTICS
SERVICIO DE SINCRONIZACIÓN EXCEL → POSTGRESQL
============================================================
*/

const NOMBRE_ARCHIVO = "Puerto_Vivero_Cotizaciones.xlsx";

function encontrarExcel() {
    const posiblesRutas = [
        process.env.EXCEL_PATH,

        path.resolve(process.cwd(), NOMBRE_ARCHIVO),

        path.resolve(process.cwd(), "..", NOMBRE_ARCHIVO),

        path.resolve(__dirname, "../../../", NOMBRE_ARCHIVO),

        path.resolve(
            process.env.USERPROFILE || "",
            "Downloads",
            NOMBRE_ARCHIVO
        )
    ].filter(Boolean);

    for (const ruta of posiblesRutas) {
        if (fs.existsSync(ruta)) {
            return ruta;
        }
    }

    throw new Error(
        `No se encontró el archivo ${NOMBRE_ARCHIVO}. ` +
        `Colócalo en la carpeta del proyecto o configura EXCEL_PATH en .env`
    );
}

/*
============================================================
CONVERSIÓN DE VALORES
============================================================
*/

function valorTexto(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === "" ? null : texto;
}

function valorEntero(valor) {
    if (valor === undefined || valor === null || valor === "") {
        return null;
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return null;
    }

    return Math.trunc(numero);
}

function valorFecha(valor) {
    if (valor === undefined || valor === null || valor === "") {
        return null;
    }

    if (valor instanceof Date && !isNaN(valor.getTime())) {
        return valor;
    }

    if (typeof valor === "number") {
        const fecha = XLSX.SSF.parse_date_code(valor);

        if (fecha) {
            return new Date(
                Date.UTC(
                    fecha.y,
                    fecha.m - 1,
                    fecha.d,
                    fecha.H || 0,
                    fecha.M || 0,
                    fecha.S || 0
                )
            );
        }
    }

    const fecha = new Date(valor);

    if (!isNaN(fecha.getTime())) {
        return fecha;
    }

    return null;
}

/*
============================================================
LECTURA DEL EXCEL
============================================================
*/

function leerCotizaciones() {
    const rutaExcel = encontrarExcel();

    console.log("");
    console.log("==========================================");
    console.log("SINCRONIZACIÓN PUERTO VIVERO");
    console.log("==========================================");
    console.log("Excel:", rutaExcel);

    const workbook = XLSX.readFile(rutaExcel, {
        cellDates: true
    });

    if (!workbook.SheetNames.includes("COTIZACIONES")) {
        throw new Error(
            'El Excel no contiene la hoja "COTIZACIONES".'
        );
    }

    const hoja = workbook.Sheets["COTIZACIONES"];

    const filas = XLSX.utils.sheet_to_json(hoja, {
        defval: null,
        raw: true
    });

    console.log("Filas encontradas:", filas.length);

    return filas;
}

/*
============================================================
MAPEO DE UNA FILA
============================================================
*/

function mapearCotizacion(fila) {
    return {
        cotizacion: valorTexto(fila["Cotización"]),

        fecha: valorFecha(fila["Fecha"]),

        fechaLocal: valorFecha(fila["Fecha local"]),

        estado: valorTexto(fila["Estado"]),

        origen: valorTexto(fila["Origen"]),

        nombre: valorTexto(fila["Nombre"]),

        apellido: valorTexto(fila["Apellido"]),

        celular: valorTexto(fila["Celular"]),

        direccion: valorTexto(fila["Dirección"]),

        ciudad: valorTexto(fila["Ciudad"]),

        productoId: valorTexto(fila["Producto ID"]),

        producto: valorTexto(fila["Producto"]),

        categoria: valorTexto(fila["Categoría"]),

        subcategoria: valorTexto(fila["Subcategoría"]),

        altura: valorTexto(fila["Altura"]),

        cantidad: valorEntero(fila["Cantidad"]),

        referencias: valorTexto(fila["Referencias"]),

        unidadesTotales: valorEntero(fila["Unidades totales"]),

        ultimaActualizacion: valorFecha(
            fila["Última actualización"]
        ),

        responsable: valorTexto(fila["Responsable"]),

        observaciones: valorTexto(fila["Observaciones"]),

        estadoComercial:
            valorTexto(fila["Estado comercial"]) || "Pendiente"
    };
}

/*
============================================================
CLIENTE
============================================================
*/

function obtenerClienteId(cotizacion) {
    const celular = valorTexto(cotizacion.celular);

    if (celular) {
        return celular;
    }

    const nombre = [
        cotizacion.nombre,
        cotizacion.apellido
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    if (nombre) {
        return nombre.toLowerCase().replace(/\s+/g, "-");
    }

    return `cliente-${cotizacion.cotizacion}`;
}

/*
============================================================
SINCRONIZACIÓN PRINCIPAL
============================================================
*/

async function sincronizarExcel() {
    const filasExcel = leerCotizaciones();

    let procesadas = 0;
    let omitidas = 0;

    const cotizacionesValidas = [];

    for (const fila of filasExcel) {
        const cotizacion = mapearCotizacion(fila);

        if (!cotizacion.cotizacion) {
            omitidas++;
            continue;
        }

        cotizacionesValidas.push(cotizacion);
    }

    /*
    ========================================================
    TRANSACCIÓN
    ========================================================
    */

    await prisma.$transaction(async (tx) => {

        /*
        ----------------------------------------------------
        1. LIMPIAR COTIZACIONES
        ----------------------------------------------------
        */

        await tx.cotizacion.deleteMany();

        /*
        ----------------------------------------------------
        2. INSERTAR COTIZACIONES
        ----------------------------------------------------
        */

        for (const cotizacion of cotizacionesValidas) {
            await tx.cotizacion.create({
                data: cotizacion
            });

            procesadas++;
        }

        /*
        ----------------------------------------------------
        3. RECONSTRUIR CLIENTES
        ----------------------------------------------------
        */

        await tx.cliente.deleteMany();

        const clientes = new Map();

        for (const cotizacion of cotizacionesValidas) {

            const clienteId = obtenerClienteId(cotizacion);

            if (!clientes.has(clienteId)) {
                clientes.set(clienteId, {
                    clienteId,
                    nombre: cotizacion.nombre,
                    apellido: cotizacion.apellido,
                    celular: cotizacion.celular,
                    direccion: cotizacion.direccion,
                    ciudad: cotizacion.ciudad,
                    primeraCotizacion:
                        cotizacion.fechaLocal ||
                        cotizacion.fecha,
                    ultimaCotizacion:
                        cotizacion.fechaLocal ||
                        cotizacion.fecha,
                    numeroCotizaciones: 0,
                    estado: cotizacion.estado
                });
            }

            const cliente = clientes.get(clienteId);

            cliente.numeroCotizaciones++;

            const fechaActual =
                cotizacion.fechaLocal ||
                cotizacion.fecha;

            if (fechaActual) {

                if (
                    !cliente.primeraCotizacion ||
                    fechaActual < cliente.primeraCotizacion
                ) {
                    cliente.primeraCotizacion = fechaActual;
                }

                if (
                    !cliente.ultimaCotizacion ||
                    fechaActual > cliente.ultimaCotizacion
                ) {
                    cliente.ultimaCotizacion = fechaActual;
                }
            }
        }

        for (const cliente of clientes.values()) {
            await tx.cliente.create({
                data: cliente
            });
        }

        /*
        ----------------------------------------------------
        4. RECONSTRUIR PRODUCTOS SOLICITADOS
        ----------------------------------------------------
        */

        await tx.productoSolicitado.deleteMany();

        const productos = new Map();

        for (const cotizacion of cotizacionesValidas) {

            if (!cotizacion.productoId) {
                continue;
            }

            const productoId = cotizacion.productoId;

            if (!productos.has(productoId)) {
                productos.set(productoId, {
                    productoId,
                    producto: cotizacion.producto,
                    categoria: cotizacion.categoria,
                    subcategoria: cotizacion.subcategoria,
                    altura: cotizacion.altura,
                    unidadesSolicitadas: 0,
                    numeroCotizaciones: 0,
                    ultimaSolicitud:
                        cotizacion.fechaLocal ||
                        cotizacion.fecha
                });
            }

            const producto = productos.get(productoId);

            producto.unidadesSolicitadas +=
                cotizacion.cantidad || 0;

            producto.numeroCotizaciones++;

            const fechaActual =
                cotizacion.fechaLocal ||
                cotizacion.fecha;

            if (
                fechaActual &&
                (
                    !producto.ultimaSolicitud ||
                    fechaActual > producto.ultimaSolicitud
                )
            ) {
                producto.ultimaSolicitud = fechaActual;
            }
        }

        for (const producto of productos.values()) {
            await tx.productoSolicitado.create({
                data: producto
            });
        }
    });

    /*
    ========================================================
    RESULTADO
    ========================================================
    */

    const totalUnidades = cotizacionesValidas.reduce(
        (total, cotizacion) =>
            total + (cotizacion.unidadesTotales || 0),
        0
    );

    const resultado = {
        archivo: NOMBRE_ARCHIVO,
        filasExcel: filasExcel.length,
        procesadas,
        omitidas,
        clientes: await prisma.cliente.count(),
        productos: await prisma.productoSolicitado.count(),
        cotizaciones: await prisma.cotizacion.count(),
        unidadesTotales: totalUnidades,
        fechaSincronizacion: new Date()
    };

    console.log("");
    console.log("==========================================");
    console.log("RESULTADO DE SINCRONIZACIÓN");
    console.log("==========================================");
    console.log(JSON.stringify(resultado, null, 2));

    return resultado;
}

module.exports = {
    sincronizarExcel
};