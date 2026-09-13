
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const prisma = require("../db/prisma");

/*
============================================================
PUERTO VIVERO ANALYTICS
SERVICIO DE SINCRONIZACIÓN
GOOGLE SHEETS → POSTGRESQL
============================================================
*/

const SPREADSHEET_ID =
    process.env.GOOGLE_SPREADSHEET_ID ||
    process.env.GOOGLE_SHEETS_ID ||
    "1PVG6zD78bWhm2qpEiQU0cdNRqxJWrYUNPh7DSlHlwvM";

const NOMBRE_HOJA = "COTIZACIONES";

const RANGO = `'${NOMBRE_HOJA}'!A:ZZ`;


/*
============================================================
CARGAR CREDENCIALES GOOGLE
============================================================
*/

function cargarCredenciales() {

    /*
    --------------------------------------------------------
    PRODUCCIÓN / RENDER - VARIABLE DE ENTORNO
    --------------------------------------------------------
    */

    if (process.env.GOOGLE_CREDENTIALS_JSON) {

        try {

            return JSON.parse(
                process.env.GOOGLE_CREDENTIALS_JSON
            );

        } catch (error) {

            throw new Error(
                "GOOGLE_CREDENTIALS_JSON no contiene un JSON válido."
            );

        }

    }


    /*
    --------------------------------------------------------
    SECRET FILE DE RENDER
    --------------------------------------------------------
    */

    const rutaRender =
        "/etc/secrets/google-credentials.json";


    /*
    DEBUG TEMPORAL PARA RENDER
    --------------------------------------------------------
    Esto nos permitirá comprobar en los logs si Render
    realmente está montando el Secret File.
    --------------------------------------------------------
    */

    console.log(
        "DEBUG RENDER - /etc/secrets existe:",
        fs.existsSync("/etc/secrets")
    );

    console.log(
        "DEBUG RENDER - credencial existe:",
        fs.existsSync(rutaRender)
    );


    if (fs.existsSync(rutaRender)) {

        try {

            const contenido =
                fs.readFileSync(
                    rutaRender,
                    "utf8"
                );

            return JSON.parse(
                contenido
            );

        } catch (error) {

            throw new Error(
                "No se pudo leer correctamente el Secret File de Google en Render."
            );

        }

    }


    /*
    --------------------------------------------------------
    LOCAL
    --------------------------------------------------------
    */

    const posiblesRutas = [

        path.resolve(
            __dirname,
            "../../google-credentials.json"
        ),

        path.resolve(
            process.cwd(),
            "google-credentials.json"
        ),

        path.resolve(
            process.cwd(),
            "..",
            "google-credentials.json"
        )

    ];


    for (const ruta of posiblesRutas) {

        if (fs.existsSync(ruta)) {

            try {

                const contenido =
                    fs.readFileSync(
                        ruta,
                        "utf8"
                    );

                return JSON.parse(
                    contenido
                );

            } catch (error) {

                throw new Error(
                    `No se pudo leer correctamente el archivo de credenciales: ${ruta}`
                );

            }

        }

    }


    /*
    --------------------------------------------------------
    NO SE ENCONTRARON CREDENCIALES
    --------------------------------------------------------
    */

    throw new Error(
        "No se encontraron las credenciales de Google. " +
        "Configura GOOGLE_CREDENTIALS_JSON o agrega " +
        "google-credentials.json como Secret File en Render."
    );

}


/*
============================================================
CONEXIÓN GOOGLE SHEETS
============================================================
*/

async function obtenerClienteGoogleSheets() {

    const credentials =
        cargarCredenciales();


    const auth =
        new google.auth.GoogleAuth({

            credentials,

            scopes: [
                "https://www.googleapis.com/auth/spreadsheets.readonly"
            ]

        });


    return google.sheets({

        version: "v4",

        auth

    });

}


/*
============================================================
CONVERSIÓN DE TEXTO
============================================================
*/

function valorTexto(valor) {

    if (
        valor === undefined ||
        valor === null
    ) {

        return null;

    }


    const texto =
        String(valor).trim();


    return texto === ""
        ? null
        : texto;

}


/*
============================================================
CONVERSIÓN DE ENTEROS
============================================================
*/

function valorEntero(valor) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {

        return null;

    }


    const texto =
        String(valor)
            .trim()
            .replace(",", ".");


    const numero =
        Number(texto);


    if (!Number.isFinite(numero)) {

        return null;

    }


    return Math.trunc(numero);

}


/*
============================================================
CONVERSIÓN DE FECHAS
============================================================
*/

function valorFecha(valor) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {

        return null;

    }


    if (
        valor instanceof Date &&
        !isNaN(valor.getTime())
    ) {

        return valor;

    }


    const texto =
        String(valor).trim();


    /*
    --------------------------------------------------------
    FECHA RECONOCIBLE POR JAVASCRIPT
    --------------------------------------------------------
    */

    const fecha =
        new Date(texto);


    if (!isNaN(fecha.getTime())) {

        return fecha;

    }


    /*
    --------------------------------------------------------
    FORMATO DD/MM/YYYY
    --------------------------------------------------------
    */

    const coincidencia =
        texto.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
        );


    if (coincidencia) {

        const dia =
            Number(coincidencia[1]);

        const mes =
            Number(coincidencia[2]) - 1;

        const año =
            Number(coincidencia[3]);

        const hora =
            Number(coincidencia[4] || 0);

        const minutos =
            Number(coincidencia[5] || 0);

        const segundos =
            Number(coincidencia[6] || 0);


        const fechaManual =
            new Date(
                año,
                mes,
                dia,
                hora,
                minutos,
                segundos
            );


        if (
            !isNaN(
                fechaManual.getTime()
            )
        ) {

            return fechaManual;

        }

    }


    return null;

}


/*
============================================================
LECTURA DE GOOGLE SHEETS
============================================================
*/

async function leerCotizacionesGoogleSheets() {

    const sheets =
        await obtenerClienteGoogleSheets();


    console.log("");

    console.log(
        "=========================================="
    );

    console.log(
        "SINCRONIZACIÓN PUERTO VIVERO"
    );

    console.log(
        "=========================================="
    );

    console.log(
        "Fuente: Google Sheets"
    );

    console.log(
        "Spreadsheet ID:",
        SPREADSHEET_ID
    );

    console.log(
        "Hoja:",
        NOMBRE_HOJA
    );

    console.log(
        "Rango:",
        RANGO
    );


    const respuesta =
        await sheets.spreadsheets.values.get({

            spreadsheetId:
                SPREADSHEET_ID,

            range:
                RANGO,

            valueRenderOption:
                "UNFORMATTED_VALUE",

            dateTimeRenderOption:
                "FORMATTED_STRING"

        });


    const valores =
        respuesta.data.values || [];


    if (
        valores.length === 0
    ) {

        throw new Error(
            `La hoja "${NOMBRE_HOJA}" no contiene datos.`
        );

    }


    /*
    --------------------------------------------------------
    PRIMERA FILA = ENCABEZADOS
    --------------------------------------------------------
    */

    const encabezados =
        valores[0].map(
            encabezado =>
                String(
                    encabezado || ""
                ).trim()
        );


    console.log(
        "Columnas encontradas:",
        encabezados.length
    );


    /*
    --------------------------------------------------------
    CONVERTIR FILAS A OBJETOS
    --------------------------------------------------------
    */

    const filas = [];


    for (
        let i = 1;
        i < valores.length;
        i++
    ) {

        const filaValores =
            valores[i];


        const fila = {};


        for (
            let columna = 0;
            columna < encabezados.length;
            columna++
        ) {

            const encabezado =
                encabezados[columna];


            if (!encabezado) {

                continue;

            }


            fila[encabezado] =
                filaValores[columna] !== undefined
                    ? filaValores[columna]
                    : null;

        }


        filas.push(
            fila
        );

    }


    console.log(
        "Filas encontradas:",
        filas.length
    );


    return filas;

}


/*
============================================================
MAPEO DE COTIZACIÓN
============================================================
*/

function mapearCotizacion(fila) {

    return {

        cotizacion:
            valorTexto(
                fila["Cotización"]
            ),

        fecha:
            valorFecha(
                fila["Fecha"]
            ),

        fechaLocal:
            valorFecha(
                fila["Fecha local"]
            ),

        estado:
            valorTexto(
                fila["Estado"]
            ),

        origen:
            valorTexto(
                fila["Origen"]
            ),

        nombre:
            valorTexto(
                fila["Nombre"]
            ),

        apellido:
            valorTexto(
                fila["Apellido"]
            ),

        celular:
            valorTexto(
                fila["Celular"]
            ),

        direccion:
            valorTexto(
                fila["Dirección"]
            ),

        ciudad:
            valorTexto(
                fila["Ciudad"]
            ),

        productoId:
            valorTexto(
                fila["Producto ID"]
            ),

        producto:
            valorTexto(
                fila["Producto"]
            ),

        categoria:
            valorTexto(
                fila["Categoría"]
            ),

        subcategoria:
            valorTexto(
                fila["Subcategoría"]
            ),

        altura:
            valorTexto(
                fila["Altura"]
            ),

        cantidad:
            valorEntero(
                fila["Cantidad"]
            ),

        referencias:
            valorTexto(
                fila["Referencias"]
            ),

        unidadesTotales:
            valorEntero(
                fila["Unidades totales"]
            ),

        ultimaActualizacion:
            valorFecha(
                fila["Última actualización"]
            ),

        responsable:
            valorTexto(
                fila["Responsable"]
            ),

        observaciones:
            valorTexto(
                fila["Observaciones"]
            ),

        estadoComercial:
            valorTexto(
                fila["Estado comercial"]
            ) || "Pendiente"

    };

}


/*
============================================================
OBTENER ID DEL CLIENTE
============================================================
*/

function obtenerClienteId(cotizacion) {

    const celular =
        valorTexto(
            cotizacion.celular
        );


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

        return nombre
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );

    }


    return `cliente-${cotizacion.cotizacion}`;

}


/*
============================================================
SINCRONIZACIÓN PRINCIPAL
============================================================
*/

async function sincronizarGoogleSheets() {

    /*
    --------------------------------------------------------
    1. LEER GOOGLE SHEETS
    --------------------------------------------------------
    */

    const filasGoogleSheets =
        await leerCotizacionesGoogleSheets();


    let procesadas = 0;

    let omitidas = 0;


    const cotizacionesValidas = [];


    /*
    --------------------------------------------------------
    2. MAPEAR COTIZACIONES
    --------------------------------------------------------
    */

    for (
        const fila
        of filasGoogleSheets
    ) {

        const cotizacion =
            mapearCotizacion(
                fila
            );


        if (
            !cotizacion.cotizacion
        ) {

            omitidas++;

            continue;

        }


        cotizacionesValidas.push(
            cotizacion
        );

    }


    /*
    --------------------------------------------------------
    3. TRANSACCIÓN POSTGRESQL
    --------------------------------------------------------
    */

    await prisma.$transaction(

        async (tx) => {

            /*
            =================================================
            1. LIMPIAR COTIZACIONES
            =================================================
            */

            await tx.cotizacion.deleteMany();


            /*
            =================================================
            2. INSERTAR COTIZACIONES
            =================================================
            */

            for (
                const cotizacion
                of cotizacionesValidas
            ) {

                await tx.cotizacion.create({

                    data:
                        cotizacion

                });


                procesadas++;

            }


            /*
            =================================================
            3. RECONSTRUIR CLIENTES
            =================================================
            */

            await tx.cliente.deleteMany();


            const clientes =
                new Map();


            for (
                const cotizacion
                of cotizacionesValidas
            ) {

                const clienteId =
                    obtenerClienteId(
                        cotizacion
                    );


                /*
                ------------------------------------------------
                CREAR CLIENTE
                ------------------------------------------------
                */

                if (
                    !clientes.has(
                        clienteId
                    )
                ) {

                    clientes.set(

                        clienteId,

                        {

                            clienteId,

                            nombre:
                                cotizacion.nombre,

                            apellido:
                                cotizacion.apellido,

                            celular:
                                cotizacion.celular,

                            direccion:
                                cotizacion.direccion,

                            ciudad:
                                cotizacion.ciudad,

                            primeraCotizacion:
                                cotizacion.fechaLocal ||
                                cotizacion.fecha,

                            ultimaCotizacion:
                                cotizacion.fechaLocal ||
                                cotizacion.fecha,

                            numeroCotizaciones:
                                0,

                            estado:
                                cotizacion.estado

                        }

                    );

                }


                const cliente =
                    clientes.get(
                        clienteId
                    );


                cliente.numeroCotizaciones++;


                const fechaActual =
                    cotizacion.fechaLocal ||
                    cotizacion.fecha;


                if (fechaActual) {

                    /*
                    ------------------------------------------------
                    PRIMERA COTIZACIÓN
                    ------------------------------------------------
                    */

                    if (
                        !cliente.primeraCotizacion ||
                        fechaActual <
                            cliente.primeraCotizacion
                    ) {

                        cliente.primeraCotizacion =
                            fechaActual;

                    }


                    /*
                    ------------------------------------------------
                    ÚLTIMA COTIZACIÓN
                    ------------------------------------------------
                    */

                    if (
                        !cliente.ultimaCotizacion ||
                        fechaActual >
                            cliente.ultimaCotizacion
                    ) {

                        cliente.ultimaCotizacion =
                            fechaActual;

                    }

                }

            }


            /*
            ------------------------------------------------
            GUARDAR CLIENTES
            ------------------------------------------------
            */

            for (
                const cliente
                of clientes.values()
            ) {

                await tx.cliente.create({

                    data:
                        cliente

                });

            }


            /*
            =================================================
            4. RECONSTRUIR PRODUCTOS
            =================================================
            */

            await tx.productoSolicitado.deleteMany();


            const productos =
                new Map();


            for (
                const cotizacion
                of cotizacionesValidas
            ) {

                /*
                ------------------------------------------------
                SI NO TIENE PRODUCTO ID
                ------------------------------------------------
                */

                if (
                    !cotizacion.productoId
                ) {

                    continue;

                }


                const productoId =
                    cotizacion.productoId;


                /*
                ------------------------------------------------
                CREAR PRODUCTO
                ------------------------------------------------
                */

                if (
                    !productos.has(
                        productoId
                    )
                ) {

                    productos.set(

                        productoId,

                        {

                            productoId,

                            producto:
                                cotizacion.producto,

                            categoria:
                                cotizacion.categoria,

                            subcategoria:
                                cotizacion.subcategoria,

                            altura:
                                cotizacion.altura,

                            unidadesSolicitadas:
                                0,

                            numeroCotizaciones:
                                0,

                            ultimaSolicitud:
                                cotizacion.fechaLocal ||
                                cotizacion.fecha

                        }

                    );

                }


                const producto =
                    productos.get(
                        productoId
                    );


                /*
                ------------------------------------------------
                SUMAR UNIDADES
                ------------------------------------------------
                */

                producto.unidadesSolicitadas +=
                    cotizacion.cantidad || 0;


                /*
                ------------------------------------------------
                CONTAR COTIZACIÓN
                ------------------------------------------------
                */

                producto.numeroCotizaciones++;


                /*
                ------------------------------------------------
                ACTUALIZAR ÚLTIMA SOLICITUD
                ------------------------------------------------
                */

                const fechaActual =
                    cotizacion.fechaLocal ||
                    cotizacion.fecha;


                if (
                    fechaActual &&
                    (
                        !producto.ultimaSolicitud ||
                        fechaActual >
                            producto.ultimaSolicitud
                    )
                ) {

                    producto.ultimaSolicitud =
                        fechaActual;

                }

            }


            /*
            ------------------------------------------------
            GUARDAR PRODUCTOS
            ------------------------------------------------
            */

            for (
                const producto
                of productos.values()
            ) {

                await tx.productoSolicitado.create({

                    data:
                        producto

                });

            }

        },

        {

            timeout: 30000,

            maxWait: 30000

        }

    );


    /*
    ========================================================
    5. TOTAL DE UNIDADES
    ========================================================
    */

    const totalUnidades =
        cotizacionesValidas.reduce(

            (
                total,
                cotizacion
            ) => {

                return total +
                    (
                        cotizacion.unidadesTotales ||
                        0
                    );

            },

            0

        );


    /*
    ========================================================
    6. RESULTADO
    ========================================================
    */

    const resultado = {

        archivo:
            "Google Sheets",

        spreadsheetId:
            SPREADSHEET_ID,

        hoja:
            NOMBRE_HOJA,

        filasGoogleSheets:
            filasGoogleSheets.length,

        procesadas,

        omitidas,

        clientes:
            await prisma.cliente.count(),

        productos:
            await prisma.productoSolicitado.count(),

        cotizaciones:
            await prisma.cotizacion.count(),

        unidadesTotales:
            totalUnidades,

        fechaSincronizacion:
            new Date()

    };


    /*
    ========================================================
    7. MOSTRAR RESULTADO
    ========================================================
    */

    console.log("");

    console.log(
        "=========================================="
    );

    console.log(
        "RESULTADO DE SINCRONIZACIÓN"
    );

    console.log(
        "=========================================="
    );

    console.log(
        JSON.stringify(
            resultado,
            null,
            2
        )
    );


    return resultado;

}


/*
============================================================
EXPORTAR
============================================================
*/

module.exports = {

    sincronizarGoogleSheets

};
