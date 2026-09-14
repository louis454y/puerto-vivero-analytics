/* ============================================================
   PUERTO VIVERO ANALYTICS
   APP.JS
   Dashboard + Cotizaciones + Clientes + Seguimiento + Navegación
   ============================================================ */


/* ============================================================
   CONFIGURACIÓN
   ============================================================ */

const API_BASE_URL = "https://puerto-vivero-analytics.onrender.com/api";


/* ============================================================
   ESTADO GLOBAL
   ============================================================ */

const estadoApp = {
    resumen: null,
    seguimiento: [],
    cotizaciones: [],
    clientes: [],
    clientesFiltrados: [],
    seccionActual: "inicio"
};

/* ============================================================
   NOMBRES DE SECCIONES
   ============================================================ */

const nombresSecciones = {
    inicio: "Inicio",
    analytics: "Analytics",
    cotizaciones: "Cotizaciones",
    clientes: "Clientes",
    seguimiento: "Seguimiento",
    productos: "Productos",
    configuracion: "Configuración"
};

/* ============================================================
   ELEMENTOS
   ============================================================ */

const elementos = {

    sidebar:
        document.getElementById("sidebar"),

    sidebarOverlay:
        document.getElementById("sidebarOverlay"),

    mobileMenu:
        document.getElementById("mobileMenu"),

    navItems:
        document.querySelectorAll(".nav-item"),

    sections:
        document.querySelectorAll(".dashboard-section"),

    pageTitle:
        document.getElementById("pageTitle"),

    pageEyebrow:
        document.getElementById("pageEyebrow"),

    metricCotizaciones:
        document.getElementById("metricCotizaciones"),

    metricClientes:
        document.getElementById("metricClientes"),

    metricUnidades:
        document.getElementById("metricUnidades"),

    metricPendientes:
        document.getElementById("metricPendientes"),

    seguimientoBadge:
        document.getElementById("seguimientoBadge"),

    statusList:
        document.getElementById("statusList"),

    followupPreview:
        document.getElementById("followupPreview"),

    followupPendientes:
        document.getElementById("followupPendientes"),

    followupContactados:
        document.getElementById("followupContactados"),

    followupInteresados:
        document.getElementById("followupInteresados"),

    followupAlta:
        document.getElementById("followupAlta"),

    followupTable:
        document.getElementById("followupTable"),

    followupEmpty:
        document.getElementById("followupEmpty"),

    seguimientoRefresh:
        document.getElementById("seguimientoRefresh"),

    cotizacionesModule:
        document.getElementById("cotizacionesModule"),

    clientesTotal:
        document.getElementById("clientesTotal"),

    clientesActivos:
        document.getElementById("clientesActivos"),

    clientesCotizaciones:
        document.getElementById("clientesCotizaciones"),

    clientesCiudades:
        document.getElementById("clientesCiudades"),

    clientesSearch:
        document.getElementById("clientesSearch"),

    clientesEstadoFilter:
        document.getElementById("clientesEstadoFilter"),

    clientesCiudadFilter:
        document.getElementById("clientesCiudadFilter"),

    clientesRefresh:
        document.getElementById("clientesRefresh"),

        clientesTable:
        document.getElementById("clientesTable"),

    clientesEmpty:
        document.getElementById("clientesEmpty"),

    /* ============================================================
       ANALYTICS
       ============================================================ */

    analyticsRange:
        document.getElementById("analyticsRange"),

    analyticsRefresh:
        document.getElementById("analyticsRefresh"),

    analyticsConnection:
        document.getElementById("analyticsConnection"),

    analyticsConnectionText:
        document.getElementById("analyticsConnectionText"),

    analyticsConnectionStatus:
        document.getElementById("analyticsConnectionStatus"),

    analyticsActiveUsers:
        document.getElementById("analyticsActiveUsers"),

    analyticsSessions:
        document.getElementById("analyticsSessions"),

    analyticsPageViews:
        document.getElementById("analyticsPageViews"),

    analyticsEvents:
        document.getElementById("analyticsEvents"),

            analyticsOverviewEvents:
        document.getElementById("analyticsOverviewEvents"),

    analyticsOverviewUsers:
        document.getElementById("analyticsOverviewUsers"),

    analyticsOverviewViews:
        document.getElementById("analyticsOverviewViews"),

    analyticsEventsTotal:
        document.getElementById("analyticsEventsTotal"),

    funnelViews:
        document.getElementById("funnelViews"),

    funnelSelects:
        document.getElementById("funnelSelects"),

    funnelBeginQuote:
        document.getElementById("funnelBeginQuote"),

    funnelSubmitted:
        document.getElementById("funnelSubmitted"),

    funnelWhatsapp:
        document.getElementById("funnelWhatsapp"),

    analyticsPeriodLabel:
        document.getElementById("analyticsPeriodLabel"),

    analyticsChartLoading:
        document.getElementById("analyticsChartLoading"),

    analyticsTrafficChart:
        document.getElementById("analyticsTrafficChart"),

    analyticsDevices:
        document.getElementById("analyticsDevices"),

    analyticsCountries:
        document.getElementById("analyticsCountries"),

    analyticsCities:
        document.getElementById("analyticsCities"),

    analyticsPages:
        document.getElementById("analyticsPages"),

    analyticsSources:
        document.getElementById("analyticsSources"),

    analyticsEventsList:
        document.getElementById("analyticsEventsList"),

    eventViewProduct:
        document.getElementById("eventViewProduct"),

    eventSelectProduct:
        document.getElementById("eventSelectProduct"),

    eventBeginQuote:
        document.getElementById("eventBeginQuote"),

    eventQuoteSubmitted:
        document.getElementById("eventQuoteSubmitted"),

    eventWhatsappClick:
        document.getElementById("eventWhatsappClick"),

    analyticsEmpty:
        document.getElementById("analyticsEmpty")

};

/* ============================================================
   INICIO
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    iniciarApp
);


async function iniciarApp() {

    console.log("Puerto Vivero Analytics iniciado.");
    console.log("API:", API_BASE_URL);

    configurarNavegacion();

    configurarMenuMobile();

    configurarAccionesPanel();

    configurarClientes();

    configurarSeguimiento();

    configurarAnalytics();

    await cargarDashboard();

}


/* ============================================================
   NAVEGACIÓN
   ============================================================ */

function configurarNavegacion() {

    elementos.navItems.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const seccion =
                    boton.dataset.section;

                if (!seccion) {
                    return;
                }

                cambiarSeccion(seccion);

            }
        );

    });

}



// ============================================================
// CAMBIAR SECCIÓN
// ============================================================

function cambiarSeccion(nombreSeccion) {

    estadoApp.seccionActual =
        nombreSeccion;


    elementos.navItems.forEach(boton => {

        boton.classList.toggle(
            "active",
            boton.dataset.section === nombreSeccion
        );

    });


    elementos.sections.forEach(section => {

        section.classList.toggle(
            "active",
            section.id === `section-${nombreSeccion}`
        );

    });


    if (elementos.pageTitle) {

        elementos.pageTitle.textContent =
            nombresSecciones[nombreSeccion] ||
            "Puerto Vivero Analytics";

    }


    cerrarMenuMobile();


    // ========================================================
    // COTIZACIONES
    // ========================================================

    if (nombreSeccion === "cotizaciones") {

        cargarCotizaciones();

    }


    // ========================================================
    // CLIENTES
    // ========================================================

    if (nombreSeccion === "clientes") {

        cargarClientes();

    }


    // ========================================================
    // PRODUCTOS
    // ========================================================

    if (nombreSeccion === "productos") {

        cargarProductos();

    }


    // ========================================================
    // SEGUIMIENTO
    // ========================================================

    if (nombreSeccion === "seguimiento") {

        cargarSeguimiento();

    }


    // ========================================================
    // ANALYTICS
    // ========================================================

    if (nombreSeccion === "analytics") {

        cargarAnalytics();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



// ============================================================
// PRODUCTOS — CARGA Y ANÁLISIS
// ============================================================

async function cargarProductos() {

    mostrarEstadoProductosCarga(true);

    try {

        const datos = await obtenerAPI("/cotizaciones");

        estadoApp.cotizaciones = Array.isArray(datos.cotizaciones)
            ? datos.cotizaciones
            : [];

        const productos = construirProductosDesdeCotizaciones(
            estadoApp.cotizaciones
        );

        estadoApp.productos = productos;

        renderizarMetricasProductos(productos);
        renderizarRankingProductos(productos);
        renderizarCategoriasProductos(productos);
        renderizarRendimientoProductos(productos);
        llenarFiltroCategoriasProductos(productos);
        renderizarTablaProductos(productos);

        configurarFiltrosProductos();
        configurarActualizacionProductos();

        mostrarEstadoProductosCarga(false);

    } catch (error) {

        console.error("Error cargando productos:", error);

        mostrarEstadoProductosCarga(false);

        mostrarErrorProductos(
            "No fue posible obtener las cotizaciones del sistema."
        );
    }
}

function configurarFiltrosProductos() {

    const buscador = document.getElementById("productosSearch");
    const filtroCategoria = document.getElementById("productosCategoriaFilter");
    const filtroDemanda = document.getElementById("productosDemandaFilter");

    if (buscador) {
        buscador.oninput = aplicarFiltrosProductos;
    }

    if (filtroCategoria) {
        filtroCategoria.onchange = aplicarFiltrosProductos;
    }

    if (filtroDemanda) {
        filtroDemanda.onchange = aplicarFiltrosProductos;
    }
}


function aplicarFiltrosProductos() {

    const productos = Array.isArray(estadoApp.productos)
        ? estadoApp.productos
        : [];

    const buscador = document.getElementById("productosSearch");
    const filtroCategoria = document.getElementById("productosCategoriaFilter");
    const filtroDemanda = document.getElementById("productosDemandaFilter");

    const texto = buscador
        ? buscador.value.trim().toLowerCase()
        : "";

    const categoria = filtroCategoria
        ? filtroCategoria.value
        : "";

    const demanda = filtroDemanda
        ? filtroDemanda.value
        : "";

    const productosFiltrados = productos.filter(producto => {

        const nombre = String(producto.nombre || "").toLowerCase();
        const categoriaProducto = String(producto.categoria || "");

        const coincideTexto =
            !texto ||
            nombre.includes(texto);

        const coincideCategoria =
            !categoria ||
            categoriaProducto === categoria;

        const coincideDemanda =
            !demanda ||
            producto.demanda === demanda;

        return (
            coincideTexto &&
            coincideCategoria &&
            coincideDemanda
        );
    });

    renderizarTablaProductos(productosFiltrados);
}

function configurarActualizacionProductos() {

    const boton = document.getElementById("productosRefresh");

    if (!boton) return;

    boton.onclick = async function () {

        if (boton.disabled) return;

        boton.disabled = true;

        const icono = boton.querySelector("i");

        if (icono) {
            icono.classList.add("fa-spin");
        }

        try {

            await cargarProductos();

        } finally {

            boton.disabled = false;

            if (icono) {
                icono.classList.remove("fa-spin");
            }

        }
    };
}

function mostrarEstadoProductosCarga(cargando) {

    const seccion = document.getElementById("section-productos");

    if (!seccion) return;

    if (cargando) {
        seccion.classList.add("productos-loading");
    } else {
        seccion.classList.remove("productos-loading");
    }
}

function mostrarErrorProductos(mensaje = "No fue posible cargar los productos.") {

    const ranking = document.getElementById("productosRanking");
    const categorias = document.getElementById("productosCategorias");
    const rendimiento = document.getElementById("productosRendimiento");
    const tabla = document.getElementById("productosTable");
    const empty = document.getElementById("productosEmpty");

    const contenido = `
        <div class="productos-no-data productos-error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <strong>Error al cargar productos</strong>
            <span>${escaparHTMLProducto(mensaje)}</span>
        </div>
    `;

    if (ranking) ranking.innerHTML = contenido;
    if (categorias) categorias.innerHTML = contenido;
    if (rendimiento) rendimiento.innerHTML = contenido;

    if (tabla) {
        tabla.innerHTML = "";
    }

    if (empty) {
        empty.hidden = true;
    }
}


// ============================================================
// PRODUCTOS — CONSTRUCCIÓN DE DATOS
// ============================================================

function construirProductosDesdeCotizaciones(
    cotizaciones
) {

    const mapaProductos =
        new Map();


    if (!Array.isArray(cotizaciones)) {

        return [];

    }


    cotizaciones.forEach(
        cotizacion => {

            const productos =
                Array.isArray(
                    cotizacion.productos
                )
                    ? cotizacion.productos
                    : [];


            productos.forEach(
                producto => {

                    const nombre =
                        String(
                            producto.producto ||
                            "Producto sin nombre"
                        ).trim();


                    const categoria =
                        String(
                            producto.categoria ||
                            "Sin categoría"
                        ).trim();


                    const altura =
                        String(
                            producto.altura ||
                            "No especificada"
                        ).trim();


                    const cantidad =
                        Number(
                            producto.cantidad ||
                            0
                        );


                    /*
                     * El nombre del producto será
                     * nuestra clave principal.
                     */

                    const clave =
                        nombre.toLowerCase();


                    if (
                        !mapaProductos.has(
                            clave
                        )
                    ) {

                        mapaProductos.set(
                            clave,
                            {

                                nombre,

                                categoria,

                                cotizaciones:
                                    new Set(),

                                unidades: 0,

                                lineas: 0,

                                alturas:
                                    new Set(),

                                ciudades:
                                    new Set(),

                                estados: {

                                    pendiente: 0,

                                    contactado: 0,

                                    interesado: 0,

                                    vendido: 0,

                                    perdido: 0

                                }

                            }
                        );

                    }


                    const registro =
                        mapaProductos.get(
                            clave
                        );


                    /*
                     * Unidades solicitadas
                     */

                    registro.unidades +=
                        cantidad;


                    /*
                     * Cada aparición del producto
                     * dentro de una cotización representa
                     * una línea.
                     */

                    registro.lineas +=
                        1;


                    /*
                     * Cotización donde aparece
                     * el producto.
                     */

                    if (
                        cotizacion.cotizacion
                    ) {

                        registro.cotizaciones.add(
                            cotizacion.cotizacion
                        );

                    }


                    /*
                     * Alturas / presentaciones
                     */

                    if (
                        altura &&
                        altura !==
                            "No especificada"
                    ) {

                        registro.alturas.add(
                            altura
                        );

                    }


                    /*
                     * Ciudad del cliente
                     */

                    const ciudad =
                        String(
                            cotizacion.cliente?.ciudad ||
                            ""
                        ).trim();


                    if (ciudad) {

                        registro.ciudades.add(
                            ciudad
                        );

                    }


                    /*
                     * Estado comercial
                     */

                    const estado =
                        normalizarEstadoProducto(
                            cotizacion.estadoComercial
                        );


                    if (
                        Object.prototype.hasOwnProperty.call(
                            registro.estados,
                            estado
                        )
                    ) {

                        registro.estados[
                            estado
                        ] += 1;

                    }

                }
            );

        }
    );


    /*
     * Convertimos Map / Set
     * en objetos normales.
     */

    const productos =
        Array.from(
            mapaProductos.values()
        ).map(
            producto => {

                const totalCotizaciones =
                    producto.cotizaciones.size;


                const totalEstados =
                    Object.values(
                        producto.estados
                    ).reduce(
                        (
                            total,
                            valor
                        ) =>
                            total + valor,
                        0
                    );


                return {

                    nombre:
                        producto.nombre,

                    categoria:
                        producto.categoria,

                    cotizaciones:
                        totalCotizaciones,

                    unidades:
                        producto.unidades,

                    lineas:
                        producto.lineas,

                    alturas:
                        Array.from(
                            producto.alturas
                        ),

                    ciudades:
                        Array.from(
                            producto.ciudades
                        ),

                    estados:
                        producto.estados,

                    porcentajeDemanda:
                        0,

                    porcentajeCotizaciones:
                        0,

                    demanda:
    "baja",
                    conversionComercial:
                        calcularConversionProducto(
                            producto.estados
                        ),

                    totalEstados

                };

            }
        );


    /*
     * Ordenamos por unidades solicitadas.
     * El producto con mayor demanda queda primero.
     */

    productos.sort(
        (
            a,
            b
        ) =>
            b.unidades -
            a.unidades
    );


    /*
     * Total de unidades.
     */

    const totalUnidades =
        productos.reduce(
            (
                total,
                producto
            ) =>
                total +
                producto.unidades,
            0
        );


    /*
     * Total de apariciones de productos
     * dentro de las cotizaciones.
     */

    const totalCotizaciones =
        productos.reduce(
            (
                total,
                producto
            ) =>
                total +
                producto.cotizaciones,
            0
        );

        /*
 * Valores máximos del conjunto.
 *
 * Se utilizan para comparar cada producto
 * contra el producto con mayor volumen
 * y mayor frecuencia.
 */

const maxUnidades =
    productos.length > 0
        ? Math.max(
            ...productos.map(
                producto =>
                    Number(
                        producto.unidades || 0
                    )
            )
        )
        : 0;


const maxCotizaciones =
    productos.length > 0
        ? Math.max(
            ...productos.map(
                producto =>
                    Number(
                        producto.cotizaciones || 0
                    )
            )
        )
        : 0;


    /*
     * Participación porcentual.
     */

    productos.forEach(
    producto => {

        /*
         * Participación del producto
         * sobre todas las unidades solicitadas.
         */

        producto.porcentajeDemanda =
            totalUnidades > 0

                ? (
                    producto.unidades /
                    totalUnidades
                ) * 100

                : 0;


        /*
         * Participación del producto
         * sobre todas las apariciones en cotizaciones.
         */

        producto.porcentajeCotizaciones =
            totalCotizaciones > 0

                ? (
                    producto.cotizaciones /
                    totalCotizaciones
                ) * 100

                : 0;


        /*
         * Clasificación comercial de demanda.
         *
         * 70% unidades
         * 30% frecuencia de cotización
         */

        producto.demanda =
            calcularNivelDemanda(
                producto.unidades,
                maxUnidades,
                producto.cotizaciones,
                maxCotizaciones
            );

    }
);


    return productos;

}



// ============================================================
// PRODUCTOS — FUNCIONES AUXILIARES
// ============================================================

function normalizarEstadoProducto(
    estado
) {

    const valor =
        String(
            estado || ""
        )
            .trim()
            .toLowerCase();


    if (
        valor.includes(
            "pendiente"
        ) ||
        valor.includes(
            "nuevo"
        )
    ) {

        return "pendiente";

    }


    if (
        valor.includes(
            "contact"
        )
    ) {

        return "contactado";

    }


    if (
        valor.includes(
            "interes"
        )
    ) {

        return "interesado";

    }


    if (
        valor.includes(
            "vend"
        ) ||
        valor.includes(
            "cerr"
        )
    ) {

        return "vendido";

    }


    if (
        valor.includes(
            "perdid"
        ) ||
        valor.includes(
            "cancel"
        )
    ) {

        return "perdido";

    }


    return "pendiente";

}



// ============================================================
// PRODUCTOS — RENDERIZADO DE MÉTRICAS
// ============================================================

function renderizarMetricasProductos(productos) {

    const totalProductos =
        Array.isArray(productos)
            ? productos.length
            : 0;


    const totalUnidades =
        productos.reduce(
            (total, producto) =>
                total +
                Number(
                    producto.unidades || 0
                ),
            0
        );


    const totalLineas =
        productos.reduce(
            (total, producto) =>
                total +
                Number(
                    producto.lineas || 0
                ),
            0
        );


    const productoLider =
        productos.length > 0
            ? productos[0]
            : null;


    const elementoTotal =
        document.getElementById(
            "productosTotal"
        );


    const elementoLineas =
        document.getElementById(
            "productosLineas"
        );


    const elementoUnidades =
        document.getElementById(
            "productosUnidades"
        );


    const elementoLider =
        document.getElementById(
            "productoLider"
        );


    const elementoLiderDetalle =
        document.getElementById(
            "productoLiderDetalle"
        );


    if (elementoTotal) {

        elementoTotal.textContent =
            formatearNumero(
                totalProductos
            );

    }


    if (elementoLineas) {

        elementoLineas.textContent =
            formatearNumero(
                totalLineas
            );

    }


    if (elementoUnidades) {

        elementoUnidades.textContent =
            formatearNumero(
                totalUnidades
            );

    }


    if (elementoLider) {

        elementoLider.textContent =
            productoLider
                ? productoLider.nombre
                : "—";

    }


    if (elementoLiderDetalle) {

        elementoLiderDetalle.textContent =
            productoLider
                ? `${formatearNumero(
                    productoLider.unidades
                )} unidades solicitadas`
                : "Mayor demanda registrada";

    }

}



// ============================================================
// PRODUCTOS — RANKING DE DEMANDA
// ============================================================

function renderizarRankingProductos(productos) {

    const contenedor =
        document.getElementById(
            "productosRanking"
        );


    if (!contenedor) {
        return;
    }


    if (
        !Array.isArray(productos) ||
        productos.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="productos-no-data">
                <i class="fa-solid fa-chart-simple"></i>

                <span>
                    Aún no hay productos cotizados.
                </span>
            </div>
        `;

        return;

    }


    const ranking =
        productos.slice(0, 8);


    const maxUnidades =
        Math.max(
            ...ranking.map(
                producto =>
                    Number(
                        producto.unidades || 0
                    )
            ),
            1
        );


    contenedor.innerHTML =
        ranking.map(
            (
                producto,
                indice
            ) => {

                const porcentaje =
                    (
                        Number(
                            producto.unidades || 0
                        ) /
                        maxUnidades
                    ) * 100;


                const demanda =
                    producto.demanda || "baja";


                const icono =
                    indice === 0
                        ? "fa-crown"
                        : indice === 1
                            ? "fa-medal"
                            : indice === 2
                                ? "fa-award"
                                : "fa-leaf";


                return `

                    <div
                        class="producto-ranking-item"
                    >

                        <div
                            class="producto-ranking-position"
                        >
                            ${indice + 1}
                        </div>


                        <div
                            class="producto-ranking-main"
                        >

                            <div
                                class="producto-ranking-top"
                            >

                                <div>

                                    <strong>
                                        ${escaparHTMLProducto(
                                            producto.nombre
                                        )}
                                    </strong>

                                    <span>
                                        ${escaparHTMLProducto(
                                            producto.categoria
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="producto-ranking-value"
                                >

                                    <i
                                        class="fa-solid ${icono}"
                                    ></i>

                                    ${formatearNumero(
                                        producto.unidades
                                    )}

                                </div>

                            </div>


                            <div
                                class="producto-ranking-bar"
                            >

                                <span
                                    style="
                                        width: ${Math.min(
                                            porcentaje,
                                            100
                                        )}%;
                                    "
                                ></span>

                            </div>


                            <div
                                class="producto-ranking-meta"
                            >

                               <span>
    ${formatearNumero(producto.cotizaciones)}
    ${Number(producto.cotizaciones || 0) === 1
        ? "cotización"
        : "cotizaciones"}
</span>

                                <span
                                    class="producto-demand-badge ${demanda}"
                                >
                                    ${demanda === "alta"
                                        ? "Alta demanda"
                                        : demanda === "media"
                                            ? "Demanda media"
                                            : "Demanda baja"
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                `;

            }
        ).join("");

}



// ============================================================
// PRODUCTOS — DEMANDA POR CATEGORÍA
// ============================================================

function renderizarCategoriasProductos(
    productos
) {

    const contenedor =
        document.getElementById(
            "productosCategorias"
        );


    if (!contenedor) {
        return;
    }


    if (
        !Array.isArray(productos) ||
        productos.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="productos-no-data">
                <i class="fa-solid fa-layer-group"></i>

                <span>
                    No hay categorías disponibles.
                </span>
            </div>
        `;

        return;

    }


    const mapaCategorias =
        new Map();


    productos.forEach(
        producto => {

            const categoria =
                producto.categoria ||
                "Sin categoría";


            if (
                !mapaCategorias.has(
                    categoria
                )
            ) {

                mapaCategorias.set(
                    categoria,
                    {

                        nombre:
                            categoria,

                        unidades: 0,

                        productos: 0,

                        cotizaciones: 0

                    }
                );

            }


            const registro =
                mapaCategorias.get(
                    categoria
                );


            registro.unidades +=
                Number(
                    producto.unidades || 0
                );


            registro.productos +=
                1;


            registro.cotizaciones +=
                Number(
                    producto.cotizaciones || 0
                );

        }
    );


    const categorias =
        Array.from(
            mapaCategorias.values()
        )
        .sort(
            (
                a,
                b
            ) =>
                b.unidades -
                a.unidades
        );


    const totalUnidades =
        categorias.reduce(
            (
                total,
                categoria
            ) =>
                total +
                categoria.unidades,
            0
        );


    contenedor.innerHTML =
        categorias.map(
            categoria => {

                const porcentaje =
                    totalUnidades > 0
                        ? (
                            categoria.unidades /
                            totalUnidades
                        ) * 100
                        : 0;


                return `

                    <div
                        class="producto-category-item"
                    >

                        <div
                            class="producto-category-top"
                        >

                            <div>

                                <strong>
                                    ${escaparHTMLProducto(
                                        categoria.nombre
                                    )}
                                </strong>

                                <span>
                                    ${formatearNumero(
                                        categoria.productos
                                    )}
                                    ${Number(
                                        categoria.productos || 0
                                    ) === 1
                                        ? "producto"
                                        : "productos"}
                                </span>

                            </div>


                            <div
                                class="producto-category-value"
                            >

                                <strong>
                                    ${formatearNumero(
                                        categoria.unidades
                                    )}
                                </strong>

                                <small>
                                    ${formatearPorcentajeProducto(
                                        porcentaje
                                    )}
                                    del total
                                </small>

                            </div>

                        </div>


                        <div
                            class="producto-category-bar"
                        >

                            <span
                                style="
                                    width: ${Math.min(
                                        porcentaje,
                                        100
                                    )}%;
                                "
                            ></span>

                        </div>


                        <div
                            class="producto-category-meta"
                        >

                            <span>
                                ${formatearNumero(
                                    categoria.cotizaciones
                                )}
                                ${Number(
                                    categoria.cotizaciones || 0
                                ) === 1
                                    ? "cotización"
                                    : "cotizaciones"}
                            </span>

                        </div>

                    </div>

                `;

            }
        ).join("");

}




// ============================================================
// PRODUCTOS — RENDIMIENTO COMERCIAL
// ============================================================

function renderizarRendimientoProductos(
    productos
) {

    const contenedor =
        document.getElementById(
            "productosRendimiento"
        );


    if (!contenedor) {
        return;
    }


    if (
        !Array.isArray(productos) ||
        productos.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="productos-no-data">
                <i class="fa-solid fa-chart-line"></i>

                <span>
                    No hay datos comerciales suficientes.
                </span>
            </div>
        `;

        return;

    }


    const productosConActividad =
        productos
            .filter(
                producto =>
                    producto.totalEstados > 0
            )
            .slice(
                0,
                6
            );


    if (
        productosConActividad.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="productos-no-data">
                <i class="fa-solid fa-chart-line"></i>

                <span>
                    No hay actividad comercial registrada.
                </span>
            </div>
        `;

        return;

    }


    contenedor.innerHTML =
        productosConActividad.map(
            producto => {

                const estados =
                    producto.estados || {};


                const vendido =
                    Number(
                        estados.vendido || 0
                    );


                const interesado =
                    Number(
                        estados.interesado || 0
                    );


                const pendiente =
                    Number(
                        estados.pendiente || 0
                    );


                const perdido =
                    Number(
                        estados.perdido || 0
                    );


                return `

                    <div
                        class="producto-commercial-card"
                    >

                        <div
                            class="producto-commercial-header"
                        >

                            <div>

                                <strong>
                                    ${escaparHTMLProducto(
                                        producto.nombre
                                    )}
                                </strong>

                                <span>
                                    ${escaparHTMLProducto(
                                        producto.categoria
                                    )}
                                </span>

                            </div>


                            <div
                                class="producto-commercial-conversion"
                            >

                                <strong>
                                    ${formatearPorcentajeProducto(
                                        producto.conversionComercial
                                    )}
                                </strong>

                                <small>
                                    conversión
                                </small>

                            </div>

                        </div>


                        <div
                            class="producto-commercial-stats"
                        >

                            <div>

                                <span>
                                    Cotizaciones
                                </span>

                                <strong>
                                    ${formatearNumero(
                                        producto.cotizaciones
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Interesados
                                </span>

                                <strong>
                                    ${formatearNumero(
                                        interesado
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Vendidos
                                </span>

                                <strong>
                                    ${formatearNumero(
                                        vendido
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div
                            class="producto-commercial-flow"
                        >

                            <span
                                title="Pendientes"
                                style="
                                    width: ${producto.totalEstados > 0
                                        ? (
                                            pendiente /
                                            producto.totalEstados
                                        ) * 100
                                        : 0
                                    }%;
                                "
                            ></span>


                            <span
                                title="Interesados"
                                style="
                                    width: ${producto.totalEstados > 0
                                        ? (
                                            interesado /
                                            producto.totalEstados
                                        ) * 100
                                        : 0
                                    }%;
                                "
                            ></span>


                            <span
                                title="Vendidos"
                                style="
                                    width: ${producto.totalEstados > 0
                                        ? (
                                            vendido /
                                            producto.totalEstados
                                        ) * 100
                                        : 0
                                    }%;
                                "
                            ></span>


                            <span
                                title="Perdidos"
                                style="
                                    width: ${producto.totalEstados > 0
                                        ? (
                                            perdido /
                                            producto.totalEstados
                                        ) * 100
                                        : 0
                                    }%;
                                "
                            ></span>

                        </div>

                    </div>

                `;

            }
        ).join("");

}



// ============================================================
// PRODUCTOS — FILTRO DE CATEGORÍAS
// ============================================================

function llenarFiltroCategoriasProductos(
    productos
) {

    const select =
        document.getElementById(
            "productosCategoriaFilter"
        );


    if (!select) {
        return;
    }


    const categorias =
        [
            ...new Set(
                productos.map(
                    producto =>
                        producto.categoria ||
                        "Sin categoría"
                )
            )
        ]
        .sort(
            (
                a,
                b
            ) =>
                a.localeCompare(
                    b,
                    "es"
                )
        );


    select.innerHTML = `
        <option value="">
            Todas las categorías
        </option>
    `;


    categorias.forEach(
        categoria => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                categoria;


            option.textContent =
                categoria;


            select.appendChild(
                option
            );

        }
    );

}



// ============================================================
// PRODUCTOS — TABLA
// ============================================================

function renderizarTablaProductos(
    productos
) {

    const tabla =
        document.getElementById(
            "productosTable"
        );


    const empty =
        document.getElementById(
            "productosEmpty"
        );


    if (!tabla) {
        return;
    }


    if (
        !Array.isArray(productos) ||
        productos.length === 0
    ) {

        tabla.innerHTML = "";


        if (empty) {
            empty.hidden = false;
        }


        return;

    }


    if (empty) {
        empty.hidden = true;
    }


    tabla.innerHTML =
        productos.map(
            producto => {

                const demanda =
                    producto.demanda ||
                    "baja";


                const alturas =
                    Array.isArray(
                        producto.alturas
                    ) &&
                    producto.alturas.length > 0

                        ? producto.alturas
                            .map(
                                altura =>
                                    escaparHTMLProducto(
                                        altura
                                    )
                            )
                            .join(
                                ", "
                            )

                        : "—";


                return `

                    <tr>

                        <td>

                            <div
                                class="producto-table-name"
                            >

                                <span
                                    class="producto-table-icon"
                                >
                                    <i
                                        class="fa-solid fa-leaf"
                                    ></i>
                                </span>

                                <div>

                                    <strong>
                                        ${escaparHTMLProducto(
                                            producto.nombre
                                        )}
                                    </strong>

                                    <small>
                                        ${alturas}
                                    </small>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${escaparHTMLProducto(
                                producto.categoria
                            )}
                        </td>


                        <td>
                            ${formatearNumero(
                                producto.cotizaciones
                            )}
                        </td>


                        <td>

                            <strong>
                                ${formatearNumero(
                                    producto.unidades
                                )}
                            </strong>

                        </td>


                        <td>

                            <span
                                class="
                                    producto-table-demand
                                    ${demanda}
                                "
                            >

                                ${demanda === "alta"
                                    ? "Alta"
                                    : demanda === "media"
                                        ? "Media"
                                        : "Baja"
                                }

                            </span>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}




// ============================================================
// NIVEL DE DEMANDA — ALGORITMO COMERCIAL
// ============================================================

function calcularNivelDemanda(
    unidades,
    maxUnidades,
    cotizaciones,
    maxCotizaciones
) {

    const cantidadUnidades =
        Number(unidades || 0);

    const cantidadCotizaciones =
        Number(cotizaciones || 0);

    const maximoUnidades =
        Number(maxUnidades || 0);

    const maximoCotizaciones =
        Number(maxCotizaciones || 0);


    const indiceUnidades =
        maximoUnidades > 0
            ? cantidadUnidades / maximoUnidades
            : 0;


    const indiceCotizaciones =
        maximoCotizaciones > 0
            ? cantidadCotizaciones / maximoCotizaciones
            : 0;


    /*
     * Demanda comercial:
     *
     * 70% = unidades solicitadas
     * 30% = frecuencia de cotización
     */

    const indiceDemanda =
        (
            indiceUnidades * 0.70
        ) +
        (
            indiceCotizaciones * 0.30
        );


    if (
        indiceDemanda >= 0.70
    ) {

        return "alta";

    }


    if (
        indiceDemanda >= 0.35
    ) {

        return "media";

    }


    return "baja";

}


// ============================================================
// CONVERSIÓN COMERCIAL DEL PRODUCTO
// ============================================================

function calcularConversionProducto(
    estados
) {

    const total =
        Object.values(
            estados
        ).reduce(
            (
                sum,
                valor
            ) =>
                sum + valor,
            0
        );


    if (
        total === 0
    ) {

        return 0;

    }


    return (

        (
            Number(
                estados.vendido || 0
            ) /
            total
        ) * 100

    );

}



// ============================================================
// FORMATEAR PORCENTAJE
// ============================================================

function formatearPorcentajeProducto(
    valor
) {

    return (
        Number(
            valor || 0
        ).toFixed(1)
        + "%"
    );

}



// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTMLProducto(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* ============================================================
   ACCIONES DE PANELES
   ============================================================ */

function configurarAccionesPanel() {

    document
        .querySelectorAll("[data-section]")
        .forEach(boton => {

            if (
                boton.classList.contains("nav-item")
            ) {
                return;
            }

            boton.addEventListener(
                "click",
                () => {

                    const seccion =
                        boton.dataset.section;

                    if (seccion) {

                        cambiarSeccion(seccion);

                    }

                }
            );

        });

}


/* ============================================================
   MENÚ MOBILE
   ============================================================ */

function configurarMenuMobile() {

    if (elementos.mobileMenu) {

        elementos.mobileMenu.addEventListener(
            "click",
            abrirMenuMobile
        );

    }


    if (elementos.sidebarOverlay) {

        elementos.sidebarOverlay.addEventListener(
            "click",
            cerrarMenuMobile
        );

    }

}


function abrirMenuMobile() {

    elementos.sidebar?.classList.add("open");

    elementos.sidebarOverlay?.classList.add("active");

}


function cerrarMenuMobile() {

    elementos.sidebar?.classList.remove("open");

    elementos.sidebarOverlay?.classList.remove("active");

}


/* ============================================================
   FETCH API
   ============================================================ */

async function obtenerAPI(
    endpoint,
    opciones = {}
) {

    const url =
        `${API_BASE_URL}${endpoint}`;


    const respuesta =
        await fetch(
            url,
            {
                ...opciones,

                headers: {
                    "Content-Type": "application/json",
                    ...(opciones.headers || {})
                }
            }
        );


    if (!respuesta.ok) {

        throw new Error(
            `HTTP ${respuesta.status}`
        );

    }


    return respuesta.json();

}

/* ============================================================
   PUERTO VIVERO — ANALYTICS PREMIUM GA4
   ============================================================ */

let analyticsChart = null;


/* ============================================================
   CARGAR ANALYTICS
   ============================================================ */

async function cargarAnalytics() {

    try {

        console.log("Cargando Analytics desde GA4...");

        const dias =
            Number(
                elementos.analyticsRange?.value || 7
            );

        mostrarAnalyticsCargando(true);

        if (elementos.analyticsRefresh) {

            elementos.analyticsRefresh.disabled = true;

            elementos.analyticsRefresh.classList.add(
                "is-refreshing"
            );

        }


        const datos =
            await obtenerAPI(
                `/analytics?days=${dias}`
            );


        console.log(
            "RESPUESTA ANALYTICS:",
            datos
        );


        if (!datos || !datos.ok) {

            throw new Error(
                datos?.mensaje ||
                "La API de Analytics no devolvió datos válidos."
            );

        }


        renderizarAnalytics(datos);


        if (elementos.analyticsEmpty) {

            elementos.analyticsEmpty.style.display =
                "none";

        }


    } catch (error) {

        console.error(
            "Error cargando Analytics:",
            error
        );

        mostrarErrorAnalytics();


    } finally {

        mostrarAnalyticsCargando(false);


        if (elementos.analyticsRefresh) {

            elementos.analyticsRefresh.disabled = false;

            elementos.analyticsRefresh.classList.remove(
                "is-refreshing"
            );

        }

    }

}


/* ============================================================
   CONTROLES ANALYTICS
   ============================================================ */

function configurarAnalytics() {

    if (elementos.analyticsRange) {

        elementos.analyticsRange.addEventListener(
            "change",
            () => {

                cargarAnalytics();

            }
        );

    }


    if (elementos.analyticsRefresh) {

        elementos.analyticsRefresh.addEventListener(
            "click",
            async () => {

                await cargarAnalytics();

            }
        );

    }

}


/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function renderizarAnalytics(datos) {

    const resumen =
        datos.summary || {};


    const eventos =
        Array.isArray(datos.events)
            ? datos.events
            : [];


    const traffic =
        Array.isArray(datos.traffic)
            ? datos.traffic
            : [];


    /* ========================================================
       KPI PRINCIPALES
       ======================================================== */

    actualizarTexto(
        elementos.analyticsActiveUsers,
        formatearNumero(
            resumen.activeUsers || 0
        )
    );


    actualizarTexto(
        elementos.analyticsSessions,
        formatearNumero(
            resumen.sessions || 0
        )
    );


    actualizarTexto(
        elementos.analyticsPageViews,
        formatearNumero(
            resumen.pageViews || 0
        )
    );


    actualizarTexto(
        elementos.analyticsEvents,
        formatearNumero(
            resumen.events || 0
        )
    );


    /* ========================================================
       PERÍODO
       ======================================================== */

    const dias =
        Number(
            datos.range?.days || 7
        );


    actualizarTexto(
        elementos.analyticsPeriodLabel,
        `Últimos ${dias} días`
    );


    /* ========================================================
       CONEXIÓN
       ======================================================== */

    mostrarAnalyticsConexion(true);


    /* ========================================================
       ÓRBITA CENTRAL
       ======================================================== */

    actualizarTexto(
        elementos.analyticsOverviewEvents,
        formatearNumero(
            resumen.events || 0
        )
    );


    actualizarTexto(
        elementos.analyticsOverviewUsers,
        formatearNumero(
            resumen.activeUsers || 0
        )
    );


    actualizarTexto(
        elementos.analyticsOverviewViews,
        formatearNumero(
            resumen.pageViews || 0
        )
    );


    /* ========================================================
       GRÁFICO DE TRÁFICO
       ======================================================== */

    renderizarGraficoAnalytics(
        traffic
    );


    /* ========================================================
       DISPOSITIVOS
       ======================================================== */

    renderizarListaAnalytics(
        elementos.analyticsDevices,
        datos.devices || [],
        "dispositivo"
    );


    /* ========================================================
       PAÍSES
       ======================================================== */

    renderizarListaAnalytics(
        elementos.analyticsCountries,
        datos.countries || [],
        "país"
    );


    /* ========================================================
       CIUDADES
       ======================================================== */

    renderizarListaAnalytics(
        elementos.analyticsCities,
        datos.cities || [],
        "ciudad"
    );


    /* ========================================================
       PÁGINAS
       ======================================================== */

    renderizarListaAnalytics(
        elementos.analyticsPages,
        datos.pages || [],
        "página"
    );


    /* ========================================================
       FUENTES
       ======================================================== */

    renderizarListaAnalytics(
        elementos.analyticsSources,
        datos.sources || [],
        "fuente"
    );


    /* ========================================================
       EVENTOS
       ======================================================== */

    renderizarEventosAnalytics(
        eventos
    );


    /* ========================================================
       TOTAL EVENTOS
       ======================================================== */

    actualizarTexto(
        elementos.analyticsEventsTotal,
        formatearNumero(
            resumen.events || 0
        )
    );


    /* ========================================================
       FUNNEL COMERCIAL
       ======================================================== */

    renderizarFunnelAnalytics(
        eventos
    );


    /* ========================================================
       EVENTOS COMERCIALES
       ======================================================== */

    renderizarEventosComerciales(
        eventos
    );

}


/* ============================================================
   GRÁFICO DE TRÁFICO
   ============================================================ */

function renderizarGraficoAnalytics(
    traffic
) {

    const canvas =
        elementos.analyticsTrafficChart;


    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        console.warn(
            "Chart.js no está disponible."
        );

        return;

    }


    const labels =
        traffic.map(
            item => {

                const fecha =
                    String(
                        item.date || ""
                    );


                if (
                    fecha.length === 8
                ) {

                    return `${fecha.substring(6, 8)}/${fecha.substring(4, 6)}`;

                }


                return fecha;

            }
        );


    const valores =
        traffic.map(
            item =>
                Number(
                    item.sessions || 0
                )
        );


    if (analyticsChart) {

        analyticsChart.destroy();

    }


    analyticsChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label: "Sesiones",

                            data: valores,

                            tension: 0.38,

                            fill: true,

                            pointRadius: 3,

                            pointHoverRadius: 6,

                            borderWidth: 2

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    plugins: {

                        legend: {

                            display: false

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display: false

                            }

                        },


                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    }

                }

            }
        );

}


/* ============================================================
   LISTAS PREMIUM
   ============================================================ */

function renderizarListaAnalytics(
    contenedor,
    items,
    tipo
) {

    if (!contenedor) {
        return;
    }


    if (
        !Array.isArray(items) ||
        !items.length
    ) {

        contenedor.innerHTML = `

            <div class="analytics-list-empty">

                <i class="fa-solid fa-chart-simple"></i>

                <span>
                    No hay datos disponibles.
                </span>

            </div>

        `;

        return;

    }


    const maximo =
        Math.max(
            ...items.map(
                item =>
                    Number(
                        item.value || 0
                    )
            ),
            1
        );


    contenedor.innerHTML =
        items
            .map(
                (item, index) => {

                    const nombre =
                        item.name ||
                        "Sin identificar";


                    const valor =
                        Number(
                            item.value || 0
                        );


                    const porcentaje =
                        Math.round(
                            (
                                valor /
                                maximo
                            ) *
                            100
                        );


                    return `

                        <div
                            class="analytics-list-item"
                            data-type="${escaparHTML(tipo)}"
                        >

                            <div
                                class="analytics-list-rank"
                            >
                                ${index + 1}
                            </div>


                            <div
                                class="analytics-list-main"
                            >

                                <div
                                    class="analytics-list-name"
                                >

                                    <span>
                                        ${escaparHTML(
                                            nombre
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="analytics-list-progress"
                                >

                                    <span
                                        style="
                                            width:${porcentaje}%;
                                        "
                                    ></span>

                                </div>

                            </div>


                            <strong
                                class="analytics-list-value"
                            >
                                ${formatearNumero(
                                    valor
                                )}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ============================================================
   EVENTOS ANALYTICS
   ============================================================ */

function renderizarEventosAnalytics(
    eventos
) {

    if (
        !elementos.analyticsEventsList
    ) {
        return;
    }


    if (
        !Array.isArray(eventos) ||
        !eventos.length
    ) {

        elementos.analyticsEventsList.innerHTML = `

            <div class="analytics-list-empty">

                <i class="fa-solid fa-bolt"></i>

                <span>
                    No hay eventos registrados.
                </span>

            </div>

        `;

        return;

    }


    const iconos = {

        view_product:
            "fa-eye",

        select_product:
            "fa-hand-pointer",

        begin_quote:
            "fa-file-circle-plus",

        quote_submitted:
            "fa-paper-plane",

        whatsapp_click:
            "fa-whatsapp"

    };


    elementos.analyticsEventsList.innerHTML =
        eventos
            .map(
                evento => {

                    const nombre =
                        evento.name ||
                        "Evento";


                    const valor =
                        Number(
                            evento.value || 0
                        );


                    const icono =
                        iconos[nombre] ||
                        "fa-bolt";


                    return `

                        <div
                            class="analytics-event-item"
                        >

                            <div
                                class="analytics-event-icon"
                            >

                                <i
                                    class="fa-solid ${icono}"
                                ></i>

                            </div>


                            <div
                                class="analytics-event-info"
                            >

                                <span>
                                    ${escaparHTML(
                                        nombre
                                    )}
                                </span>

                            </div>


                            <strong>
                                ${formatearNumero(
                                    valor
                                )}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ============================================================
   FUNNEL COMERCIAL
   ============================================================ */

function renderizarFunnelAnalytics(
    eventos
) {

    const mapa = {};


    eventos.forEach(
        evento => {

            const nombre =
                String(
                    evento.name || ""
                );


            mapa[nombre] =
                Number(
                    evento.value || 0
                );

        }
    );


    const pasos = [

        [
            elementos.funnelViews,
            mapa.view_product || 0
        ],

        [
            elementos.funnelSelects,
            mapa.select_product || 0
        ],

        [
            elementos.funnelBeginQuote,
            mapa.begin_quote || 0
        ],

        [
            elementos.funnelSubmitted,
            mapa.quote_submitted || 0
        ],

        [
            elementos.funnelWhatsapp,
            mapa.whatsapp_click || 0
        ]

    ];


    const maximo =
        Math.max(
            ...pasos.map(
                paso =>
                    Number(
                        paso[1] || 0
                    )
            ),
            1
        );


    pasos.forEach(
        ([elemento, valor]) => {

            if (!elemento) {
                return;
            }


            elemento.textContent =
                formatearNumero(
                    valor
                );


            const paso =
                elemento.closest(
                    ".funnel-step"
                );


            if (!paso) {
                return;
            }


            const barra =
                paso.querySelector(
                    ".funnel-step-bar span"
                );


            if (barra) {

                const porcentaje =
                    Math.round(
                        (
                            Number(valor) /
                            maximo
                        ) *
                        100
                    );


                barra.style.width =
                    `${porcentaje}%`;

            }

        }
    );

}


/* ============================================================
   TARJETAS DE EVENTOS COMERCIALES
   ============================================================ */

function renderizarEventosComerciales(
    eventos
) {

    const mapa = {};


    eventos.forEach(
        evento => {

            mapa[evento.name] =
                Number(
                    evento.value || 0
                );

        }
    );


    actualizarTexto(
        elementos.eventViewProduct,
        formatearNumero(
            mapa.view_product || 0
        )
    );


    actualizarTexto(
        elementos.eventSelectProduct,
        formatearNumero(
            mapa.select_product || 0
        )
    );


    actualizarTexto(
        elementos.eventBeginQuote,
        formatearNumero(
            mapa.begin_quote || 0
        )
    );


    actualizarTexto(
        elementos.eventQuoteSubmitted,
        formatearNumero(
            mapa.quote_submitted || 0
        )
    );


    actualizarTexto(
        elementos.eventWhatsappClick,
        formatearNumero(
            mapa.whatsapp_click || 0
        )
    );

}


/* ============================================================
   ESTADO DE CARGA
   ============================================================ */

function mostrarAnalyticsCargando(
    cargando
) {

    if (
        elementos.analyticsChartLoading
    ) {

        elementos.analyticsChartLoading.style.display =
            cargando
                ? "flex"
                : "none";

    }

}


/* ============================================================
   CONEXIÓN GA4
   ============================================================ */

function mostrarAnalyticsConexion(
    conectado
) {

    if (
        elementos.analyticsConnection
    ) {

        elementos.analyticsConnection.classList.toggle(
            "connected",
            conectado
        );

    }


    if (
        elementos.analyticsConnectionStatus
    ) {

        elementos.analyticsConnectionStatus.classList.toggle(
            "connected",
            conectado
        );

    }


    if (
        elementos.analyticsConnectionText
    ) {

        elementos.analyticsConnectionText.textContent =
            conectado
                ? "Conectado a Google Analytics 4"
                : "Sin conexión con Google Analytics 4";

    }

}


/* ============================================================
   ERROR
   ============================================================ */

function mostrarErrorAnalytics() {

    mostrarAnalyticsConexion(
        false
    );


    if (
        elementos.analyticsEmpty
    ) {

        elementos.analyticsEmpty.style.display =
            "flex";

    }

}


/* ============================================================
   FIN ANALYTICS PREMIUM
   ============================================================ */

/* ============================================================
   CARGAR DASHBOARD
   ============================================================ */

async function cargarDashboard() {

    try {

        console.log("Cargando dashboard...");


        /* ====================================================
           RESUMEN
           ==================================================== */

        const datosResumen =
            await obtenerAPI(
                "/dashboard/resumen"
            );


        if (datosResumen.ok) {

            estadoApp.resumen =
                datosResumen;

            renderizarResumen(
                datosResumen
            );

        }


        /* ====================================================
           SEGUIMIENTO
           ==================================================== */

        console.log("Cargando seguimiento...");


        const datosSeguimiento =
            await obtenerAPI(
                "/comercial/seguimiento"
            );


        console.log(
            "RESPUESTA SEGUIMIENTO:",
            datosSeguimiento
        );


        if (datosSeguimiento.ok) {

            estadoApp.seguimiento =
                Array.isArray(
                    datosSeguimiento.seguimiento
                )
                    ? datosSeguimiento.seguimiento.map(
                        normalizarSeguimientoItem
                    )
                    : [];


            console.log(
                "SEGUIMIENTOS EN MEMORIA:",
                estadoApp.seguimiento
            );


            renderizarSeguimientoResumen(
                datosSeguimiento
            );


            renderizarSeguimientoPreview({
                ...datosSeguimiento,
                seguimiento:
                    estadoApp.seguimiento
            });

        }

    } catch (error) {

        console.error(
            "Error cargando dashboard:",
            error
        );

        mostrarErrorConexion();

    }

}


/* ============================================================
   CARGAR COTIZACIONES
   ============================================================ */

async function cargarCotizaciones() {

    if (!elementos.cotizacionesModule) {
        return;
    }


    elementos.cotizacionesModule.innerHTML = `

        <div class="table-loading">

            <i
                class="fa-solid fa-circle-notch fa-spin"
            ></i>

            <span>
                Cargando cotizaciones...
            </span>

        </div>

    `;


    try {

        const datos =
            await obtenerAPI(
                "/cotizaciones"
            );


        if (!datos.ok) {

            throw new Error(
                "La API no devolvió datos válidos."
            );

        }


        estadoApp.cotizaciones =
            Array.isArray(datos.cotizaciones)
                ? datos.cotizaciones
                : [];


        renderizarCotizaciones(
            datos
        );


    } catch (error) {

        console.error(
            "Error cargando cotizaciones:",
            error
        );


        elementos.cotizacionesModule.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i
                        class="fa-solid fa-triangle-exclamation"
                    ></i>

                </div>

                <strong>
                    No se pudieron cargar las cotizaciones
                </strong>

                <span>
                    Verifica que el backend esté ejecutándose.
                </span>

            </div>

        `;

    }

}


/* ============================================================
   RENDERIZAR COTIZACIONES
   ============================================================ */

function renderizarCotizaciones(datos) {

    if (!elementos.cotizacionesModule) {
        return;
    }


    const cotizaciones =
        Array.isArray(datos.cotizaciones)
            ? datos.cotizaciones
            : [];


    if (!cotizaciones.length) {

        elementos.cotizacionesModule.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i
                        class="fa-solid fa-file-circle-xmark"
                    ></i>

                </div>

                <strong>
                    No hay cotizaciones
                </strong>

                <span>
                    Todavía no existen solicitudes registradas.
                </span>

            </div>

        `;

        return;

    }


    elementos.cotizacionesModule.innerHTML = `

        <div class="quotes-header">

            <div>

                <span class="module-eyebrow">
                    REGISTRO COMERCIAL
                </span>

                <h3>
                    Cotizaciones registradas
                </h3>

                <p>
                    ${formatearNumero(datos.total)}
                    cotizaciones ·
                    ${formatearNumero(datos.filas)}
                    líneas de productos
                </p>

            </div>

        </div>


        <div class="quotes-list">

            ${cotizaciones
                .map(
                    cotizacion =>
                        crearTarjetaCotizacion(
                            cotizacion
                        )
                )
                .join("")}

        </div>

    `;


    configurarTarjetasCotizacion();

    configurarEstadosCotizacion();

}


/* ============================================================
   TARJETA DE COTIZACIÓN
   ============================================================ */

function crearTarjetaCotizacion(cotizacion) {

    const cliente =
        cotizacion.cliente || {};


    const nombreCliente =
        `${cliente.nombre || ""} ${cliente.apellido || ""}`
            .trim() ||
        "Cliente sin identificar";


    const estado =
        cotizacion.estadoComercial ||
        "Pendiente";


    const fecha =
        formatearFecha(
            cotizacion.fecha
        );


    const productos =
        Array.isArray(cotizacion.productos)
            ? cotizacion.productos
            : [];


    return `

        <article
            class="quote-card"
            data-quote="${escaparHTML(
                cotizacion.cotizacion
            )}"
        >

            <div class="quote-card-top">

                <div>

                    <span class="quote-id">

                        ${escaparHTML(
                            cotizacion.cotizacion
                        )}

                    </span>

                    <h3>

                        ${escaparHTML(
                            nombreCliente
                        )}

                    </h3>

                </div>


                <div class="quote-status-control">

                    <label>
                        ESTADO COMERCIAL
                    </label>

                    <select
                        class="quote-status-select ${obtenerClaseEstado(estado)}"
                        data-quote-status="${escaparHTML(
                            cotizacion.cotizacion
                        )}"
                        data-current-status="${escaparHTML(
                            estado
                        )}"
                    >

                        <option
                            value="Pendiente"
                            ${estado === "Pendiente" ? "selected" : ""}
                        >
                            Pendiente
                        </option>

                        <option
                            value="Contactado"
                            ${estado === "Contactado" ? "selected" : ""}
                        >
                            Contactado
                        </option>

                        <option
                            value="Interesado"
                            ${estado === "Interesado" ? "selected" : ""}
                        >
                            Interesado
                        </option>

                        <option
                            value="Vendido"
                            ${estado === "Vendido" ? "selected" : ""}
                        >
                            Vendido
                        </option>

                        <option
                            value="Perdido"
                            ${estado === "Perdido" ? "selected" : ""}
                        >
                            Perdido
                        </option>

                    </select>

                </div>

            </div>


            <div class="quote-meta">

                <span>

                    <i
                        class="fa-regular fa-calendar"
                    ></i>

                    ${escaparHTML(fecha)}

                </span>


                <span>

                    <i
                        class="fa-solid fa-location-dot"
                    ></i>

                    ${escaparHTML(
                        cliente.ciudad ||
                        "Sin ciudad"
                    )}

                </span>


                <span>

                    <i
                        class="fa-solid fa-boxes-stacked"
                    ></i>

                    ${formatearNumero(
                        cotizacion.unidadesTotales
                    )}
                    unidades

                </span>

            </div>


            <div class="quote-products">

                <div class="quote-products-title">

                    <span>
                        PRODUCTOS
                    </span>

                    <span>
                        ${productos.length}
                        ${
                            productos.length === 1
                                ? "producto"
                                : "productos"
                        }
                    </span>

                </div>


                <div class="quote-products-list">

                    ${productos
                        .map(
                            producto =>
                                crearProductoCotizacion(
                                    producto
                                )
                        )
                        .join("")}

                </div>

            </div>


            <div class="quote-card-bottom">

                <div class="quote-contact">

                    <span>

                        <i
                            class="fa-solid fa-phone"
                        ></i>

                        ${escaparHTML(
                            cliente.celular ||
                            "Sin teléfono"
                        )}

                    </span>

                </div>


                <button
                    type="button"
                    class="quote-expand-button"
                    data-quote-toggle
                >

                    <span>
                        Ver detalle
                    </span>

                    <i
                        class="fa-solid fa-chevron-down"
                    ></i>

                </button>

            </div>


            <div class="quote-details">

                <div class="quote-details-inner">

                    <div class="quote-detail-grid">

                        <div>

                            <span>
                                DIRECCIÓN
                            </span>

                            <strong>
                                ${escaparHTML(
                                    cliente.direccion ||
                                    "No registrada"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                ORIGEN
                            </span>

                            <strong>
                                ${escaparHTML(
                                    cotizacion.origen ||
                                    "No registrado"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                RESPONSABLE
                            </span>

                            <strong>
                                ${escaparHTML(
                                    cotizacion.responsable ||
                                    "No asignado"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                OBSERVACIONES
                            </span>

                            <strong>
                                ${escaparHTML(
                                    cotizacion.observaciones ||
                                    "Sin observaciones"
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </article>

    `;

}


/* ============================================================
   PRODUCTO DENTRO DE COTIZACIÓN
   ============================================================ */

function crearProductoCotizacion(producto) {

    return `

        <div class="quote-product-row">

            <div class="quote-product-main">

                <strong>

                    ${escaparHTML(
                        producto.producto ||
                        "Producto"
                    )}

                </strong>

                <span>

                    ${escaparHTML(
                        producto.categoria ||
                        "Sin categoría"
                    )}

                    ${
                        producto.altura
                            ? ` · ${escaparHTML(
                                producto.altura
                            )}`
                            : ""
                    }

                </span>

            </div>


            <div class="quote-product-quantity">

                <strong>
                    ${formatearNumero(
                        producto.cantidad
                    )}
                </strong>

                <span>
                    unidades
                </span>

            </div>

        </div>

    `;

}


/* ============================================================
   EXPANDIR / CONTRAER COTIZACIONES
   ============================================================ */

function configurarTarjetasCotizacion() {

    document
        .querySelectorAll("[data-quote-toggle]")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const tarjeta =
                        boton.closest(".quote-card");


                    if (!tarjeta) {
                        return;
                    }


                    const abierta =
                        tarjeta.classList.toggle(
                            "expanded"
                        );


                    const texto =
                        boton.querySelector("span");


                    if (texto) {

                        texto.textContent =
                            abierta
                                ? "Ocultar detalle"
                                : "Ver detalle";

                    }


                    const icono =
                        boton.querySelector("i");


                    icono?.classList.toggle(
                        "rotated",
                        abierta
                    );

                }
            );

        });

}


/* ============================================================
   CAMBIAR ESTADO COMERCIAL
   ============================================================ */

function configurarEstadosCotizacion() {

    document
        .querySelectorAll("[data-quote-status]")
        .forEach(select => {

            select.addEventListener(
                "change",
                async () => {

                    const cotizacion =
                        select.dataset.quoteStatus;

                    const nuevoEstado =
                        select.value;

                    const estadoAnterior =
                        select.dataset.currentStatus;


                    if (
                        !cotizacion ||
                        !nuevoEstado
                    ) {
                        return;
                    }


                    if (
                        nuevoEstado ===
                        estadoAnterior
                    ) {
                        return;
                    }


                    select.disabled = true;


                    try {

                        const respuesta =
                            await obtenerAPI(
                                `/comercial/cotizaciones/${encodeURIComponent(
                                    cotizacion
                                )}/estado`,
                                {
                                    method: "PATCH",

                                    body: JSON.stringify({
                                        estado:
                                            nuevoEstado
                                    })
                                }
                            );


                        if (!respuesta.ok) {

                            throw new Error(
                                respuesta.mensaje ||
                                "No se pudo actualizar el estado."
                            );

                        }


                        select.dataset.currentStatus =
                            nuevoEstado;


                        actualizarClaseEstadoSelect(
                            select,
                            nuevoEstado
                        );


                        const cotizacionMemoria =
                            estadoApp.cotizaciones.find(
                                item =>
                                    item.cotizacion ===
                                    cotizacion
                            );


                        if (cotizacionMemoria) {

                            cotizacionMemoria.estadoComercial =
                                nuevoEstado;

                        }


                        console.log(
                            "Estado actualizado:",
                            cotizacion,
                            nuevoEstado
                        );


                        await cargarDashboard();


                    } catch (error) {

                        console.error(
                            "Error actualizando estado:",
                            error
                        );


                        select.value =
                            estadoAnterior;


                        actualizarClaseEstadoSelect(
                            select,
                            estadoAnterior
                        );


                        alert(
                            "No se pudo actualizar el estado de la cotización."
                        );


                    } finally {

                        select.disabled =
                            false;

                    }

                }
            );

        });

}


/* ============================================================
   ACTUALIZAR CLASE DEL SELECTOR
   ============================================================ */

function actualizarClaseEstadoSelect(
    select,
    estado
) {

    if (!select) {
        return;
    }


    select.classList.remove(
        "pending",
        "contacted",
        "interested",
        "sold",
        "lost"
    );


    select.classList.add(
        obtenerClaseEstado(estado)
    );

}


/* ============================================================
   RESUMEN
   ============================================================ */

function renderizarResumen(datos) {

    const resumen =
        datos.resumen || {};


    actualizarTexto(
        elementos.metricCotizaciones,
        formatearNumero(
            resumen.totalCotizaciones
        )
    );


    actualizarTexto(
        elementos.metricClientes,
        formatearNumero(
            resumen.totalClientes
        )
    );


    actualizarTexto(
        elementos.metricUnidades,
        formatearNumero(
            resumen.totalUnidades
        )
    );


    actualizarTexto(
        elementos.metricPendientes,
        formatearNumero(
            resumen.cotizacionesPendientes
        )
    );


    renderizarEstados(
        datos.estadosComerciales || []
    );

}


/* ============================================================
   ESTADOS
   ============================================================ */

function renderizarEstados(estados) {

    if (!elementos.statusList) {
        return;
    }


    if (
        !Array.isArray(estados) ||
        !estados.length
    ) {

        elementos.statusList.innerHTML = `

            <div class="status-loading">
                No hay estados registrados.
            </div>

        `;

        return;

    }


    elementos.statusList.innerHTML =
        estados
            .map(item => {

                const estado =
                    String(
                        item.estado ||
                        "Sin estado"
                    ).trim();


                return `

                    <div class="status-row">

                        <div class="status-row-left">

                            <span
                                class="status-indicator ${obtenerClaseEstado(
                                    estado
                                )}"
                            ></span>

                            <span
                                class="status-row-name"
                            >
                                ${escaparHTML(
                                    estado
                                )}
                            </span>

                        </div>


                        <strong
                            class="status-row-value"
                        >
                            ${formatearNumero(
                                item.cantidad
                            )}
                        </strong>

                    </div>

                `;

            })
            .join("");

}


/* ============================================================
   RESUMEN DE SEGUIMIENTO
   ============================================================ */

function renderizarSeguimientoResumen(datos) {

    const resumen =
        datos?.resumen || {};


    const pendientes =
        Number(
            resumen.pendientes ?? 0
        );


    const contactados =
        Number(
            resumen.contactados ?? 0
        );


    const interesados =
        Number(
            resumen.interesados ?? 0
        );


    const prioridadAlta =
        Number(
            resumen.prioridadAlta ?? 0
        );


    const total =
        Number(
            resumen.total ?? 0
        );


    actualizarTexto(
        elementos.followupPendientes,
        formatearNumero(pendientes)
    );


    actualizarTexto(
        elementos.followupContactados,
        formatearNumero(contactados)
    );


    actualizarTexto(
        elementos.followupInteresados,
        formatearNumero(interesados)
    );


    actualizarTexto(
        elementos.followupAlta,
        formatearNumero(prioridadAlta)
    );


    actualizarTexto(
        elementos.seguimientoBadge,
        formatearNumero(total)
    );

}


/* ============================================================
   PREVIEW DE SEGUIMIENTO EN INICIO
   ============================================================ */

function renderizarSeguimientoPreview(datos) {

    if (!elementos.followupPreview) {
        return;
    }


    const seguimiento =
        Array.isArray(datos?.seguimiento)
            ? datos.seguimiento
            : [];


    if (!seguimiento.length) {

        elementos.followupPreview.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-check"></i>

                </div>

                <strong>
                    No hay seguimientos pendientes
                </strong>

                <span>
                    Todas las cotizaciones están al día.
                </span>

            </div>

        `;

        return;

    }


    const destacados =
        seguimiento.slice(0, 4);


    elementos.followupPreview.innerHTML = `

        <div class="followup-preview-list">

            ${destacados
                .map(
                    item =>
                        crearSeguimientoPreviewItem(item)
                )
                .join("")}

        </div>

    `;

}


/* ============================================================
   NORMALIZAR DATOS DE SEGUIMIENTO
   ============================================================ */

function normalizarSeguimientoItem(item) {

    const cliente =
        item?.cliente || {};


    return {

        ...item,

        cliente: {
            ...cliente
        },

        nombre:
            item?.nombre ??
            cliente?.nombre ??
            "",

        apellido:
            item?.apellido ??
            cliente?.apellido ??
            "",

        celular:
            item?.celular ??
            cliente?.celular ??
            "",

        ciudad:
            item?.ciudad ??
            cliente?.ciudad ??
            "",

        direccion:
            item?.direccion ??
            cliente?.direccion ??
            "",

        cotizacion:
            item?.cotizacion ??
            item?.quoteId ??
            item?.idCotizacion ??
            "",

        estadoComercial:
            item?.estadoComercial ??
            item?.estado ??
            "Pendiente",

        productos:
            Array.isArray(item?.productos)
                ? item.productos
                : [],

        totalUnidades:
            Number(
                item?.totalUnidades ??
                item?.unidades ??
                item?.units ??
                0
            ),

        diasDesdeCotizacion:
            Number(
                item?.diasDesdeCotizacion ??
                0
            ),

        prioridad:
            item?.prioridad ??
            "Normal"

    };

}


/* ============================================================
   CREAR ITEM DE PREVIEW
   ============================================================ */

function crearSeguimientoPreviewItem(item) {

    const datos =
        normalizarSeguimientoItem(item);


    const nombre =
        `${datos.nombre} ${datos.apellido}`
            .trim() ||
        "Cliente";


    const ciudad =
        datos.ciudad ||
        "Sin ciudad";


    const estado =
        datos.estadoComercial ||
        "Pendiente";


    const prioridad =
        datos.prioridad ||
        "Normal";


    const unidades =
        datos.totalUnidades;


    return `

        <div
            class="followup-preview-row"
            style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:15px;
                padding:12px 0;
                border-bottom:1px solid rgba(255,255,255,.045);
            "
        >

            <div
                style="
                    display:flex;
                    flex-direction:column;
                    gap:4px;
                    min-width:0;
                "
            >

                <strong
                    style="
                        color:var(--white);
                        font-size:10px;
                        font-weight:600;
                    "
                >
                    ${escaparHTML(nombre)}
                </strong>

                <span
                    style="
                        color:var(--muted);
                        font-size:8px;
                    "
                >
                    ${escaparHTML(ciudad)}
                    ·
                    ${formatearNumero(unidades)}
                    unidades
                </span>

            </div>


            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    flex-shrink:0;
                "
            >

                <span
                    class="status-badge ${obtenerClaseEstado(
                        estado
                    )}"
                >
                    ${escaparHTML(estado)}
                </span>

                <span
                    class="priority-badge ${obtenerClasePrioridad(
                        prioridad
                    )}"
                >
                    ${escaparHTML(prioridad)}
                </span>

            </div>

        </div>

    `;

}


/* ============================================================
   CONFIGURAR SEGUIMIENTO
   ============================================================ */

function configurarSeguimiento() {

    if (elementos.seguimientoRefresh) {

        elementos.seguimientoRefresh.addEventListener(
            "click",
            async () => {

                elementos.seguimientoRefresh.disabled =
                    true;


                try {

                    await cargarSeguimiento();

                } finally {

                    elementos.seguimientoRefresh.disabled =
                        false;

                }

            }
        );

    }

}


/* ============================================================
   CARGAR SEGUIMIENTO
   ============================================================ */

async function cargarSeguimiento() {

    if (elementos.followupTable) {

        elementos.followupTable.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="table-empty"
                >

                    <i
                        class="fa-solid fa-circle-notch fa-spin"
                    ></i>

                    Cargando seguimiento...

                </td>

            </tr>

        `;

    }


    try {

        console.log("CARGANDO SEGUIMIENTO...");


        const data =
            await obtenerAPI(
                "/comercial/seguimiento"
            );


        console.log(
            "RESPUESTA SEGUIMIENTO:",
            data
        );


        if (!data || !data.ok) {

            throw new Error(
                data?.mensaje ||
                "La API no devolvió datos válidos."
            );

        }


        const seguimientoRaw =
            Array.isArray(data.seguimiento)
                ? data.seguimiento
                : [];


        estadoApp.seguimiento =
            seguimientoRaw.map(
                normalizarSeguimientoItem
            );


        console.log(
            "SEGUIMIENTOS EN MEMORIA:",
            estadoApp.seguimiento
        );


        renderizarSeguimientoResumen(
            data
        );


        renderizarSeguimiento(
            estadoApp.seguimiento
        );


        renderizarSeguimientoPreview({
            ...data,
            seguimiento:
                estadoApp.seguimiento
        });


    } catch (error) {

        console.error(
            "ERROR CARGANDO SEGUIMIENTO:",
            error
        );


        if (elementos.followupTable) {

            elementos.followupTable.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        class="table-empty"
                    >

                        <i
                            class="fa-solid fa-triangle-exclamation"
                        ></i>

                        No fue posible cargar el seguimiento.

                    </td>

                </tr>

            `;

        }


        if (elementos.followupEmpty) {

            elementos.followupEmpty.style.display =
                "none";

        }

    }

}


/* ============================================================
   RENDERIZAR TABLA DE SEGUIMIENTO
   ============================================================ */

function renderizarSeguimiento(items) {

    if (!elementos.followupTable) {

        console.error(
            "No existe #followupTable en el HTML."
        );

        return;

    }


    const seguimiento =
        Array.isArray(items)
            ? items
            : [];


    console.log(
        "RENDERIZANDO SEGUIMIENTO:",
        seguimiento
    );


    if (!seguimiento.length) {

        elementos.followupTable.innerHTML = "";


        if (elementos.followupEmpty) {

            elementos.followupEmpty.style.display =
                "block";

        }


        return;

    }


    if (elementos.followupEmpty) {

        elementos.followupEmpty.style.display =
            "none";

    }


    elementos.followupTable.innerHTML =
        seguimiento
            .map(
                item =>
                    crearFilaSeguimiento(item)
            )
            .join("");


    configurarAccionesSeguimiento();

}


/* ============================================================
   FILA DE SEGUIMIENTO
   ============================================================ */

function crearFilaSeguimiento(item) {

    const datos =
        normalizarSeguimientoItem(item);


    const cliente =
        datos.cliente || {};


    const nombre =
        `${datos.nombre} ${datos.apellido}`
            .trim() ||
        "Cliente sin nombre";


    const celular =
        limpiarTelefono(
            datos.celular
        );


    const ciudad =
        datos.ciudad ||
        "Sin ciudad";


    const cotizacion =
        datos.cotizacion ||
        "Sin cotización";


    const productos =
        Array.isArray(datos.productos)
            ? datos.productos
            : [];


    const productosTexto =
        productos
            .map(
                producto =>
                    producto?.producto || ""
            )
            .filter(Boolean)
            .join(", ") ||
        "Sin productos";


    const unidades =
        Number(
            datos.totalUnidades || 0
        );


    const fecha =
        formatearFechaSeguimiento(
            datos.fecha
        );


    const dias =
        Number(
            datos.diasDesdeCotizacion || 0
        );


    const estado =
        datos.estadoComercial ||
        "Pendiente";


    const prioridad =
        datos.prioridad ||
        "Normal";


    const prioridadClass =
        obtenerClasePrioridad(
            prioridad
        );


    const whatsappUrl =
        celular
            ? `https://wa.me/${celular}`
            : "#";


    const whatsappButton =
        celular
            ? `

                <a
                    class="followup-whatsapp"
                    href="${whatsappUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Contactar por WhatsApp"
                >

                    <i class="fa-brands fa-whatsapp"></i>

                </a>

            `
            : `

                <span
                    class="followup-whatsapp"
                    style="opacity:.35; cursor:not-allowed;"
                    title="No hay número disponible"
                >

                    <i class="fa-brands fa-whatsapp"></i>

                </span>

            `;


    return `

        <tr>

            <!-- CLIENTE -->

            <td>

                <div class="followup-client">

                    <strong>
                        ${escaparHTML(nombre)}
                    </strong>

                    <span>
                        ${escaparHTML(
                            celular ||
                            "Sin teléfono"
                        )}
                    </span>

                </div>

            </td>


            <!-- CIUDAD -->

            <td>

                ${escaparHTML(ciudad)}

            </td>


            <!-- COTIZACIÓN -->

            <td>

                <span class="followup-quote">

                    ${escaparHTML(cotizacion)}

                </span>

            </td>


            <!-- PRODUCTOS -->

            <td>

                <div class="followup-products">

                    ${escaparHTML(productosTexto)}

                </div>

            </td>


            <!-- UNIDADES -->

            <td>

                <strong class="followup-units">

                    ${formatearNumero(unidades)}

                </strong>

            </td>


            <!-- FECHA -->

            <td>

                <div class="followup-date">

                    <strong>
                        ${escaparHTML(fecha)}
                    </strong>

                    <span>

                        ${
                            dias === 0
                                ? "Hoy"
                                : dias === 1
                                    ? "Hace 1 día"
                                    : `Hace ${dias} días`
                        }

                    </span>

                </div>

            </td>


            <!-- ESTADO -->

            <td>

                <span
                    class="status-badge ${obtenerClaseEstado(
                        estado
                    )}"
                >

                    ${escaparHTML(estado)}

                </span>

            </td>


            <!-- PRIORIDAD -->

            <td>

                <span
                    class="followup-priority ${prioridadClass}"
                >

                    <i
                        class="fa-solid fa-circle"
                    ></i>

                    ${escaparHTML(prioridad)}

                </span>

            </td>


            <!-- ACCIÓN -->

            <td>

                ${whatsappButton}

            </td>

        </tr>

    `;

}


/* ============================================================
   ACCIONES DE SEGUIMIENTO
   ============================================================ */

function configurarAccionesSeguimiento() {

    // WhatsApp funciona directamente mediante enlaces <a>.
    // No requiere listeners adicionales.

}


/* ============================================================
   CLIENTES
   ============================================================ */

function configurarClientes() {

    if (elementos.clientesSearch) {

        elementos.clientesSearch.addEventListener(
            "input",
            aplicarFiltrosClientes
        );

    }


    if (elementos.clientesEstadoFilter) {

        elementos.clientesEstadoFilter.addEventListener(
            "change",
            aplicarFiltrosClientes
        );

    }


    if (elementos.clientesCiudadFilter) {

        elementos.clientesCiudadFilter.addEventListener(
            "change",
            aplicarFiltrosClientes
        );

    }


    if (elementos.clientesRefresh) {

        elementos.clientesRefresh.addEventListener(
            "click",
            cargarClientes
        );

    }

}


/* ============================================================
   CARGAR CLIENTES
   ============================================================ */

async function cargarClientes() {

    if (!elementos.clientesTable) {
        return;
    }


    elementos.clientesTable.innerHTML = `

        <div class="table-loading">

            <i
                class="fa-solid fa-circle-notch fa-spin"
            ></i>

            <span>
                Cargando clientes...
            </span>

        </div>

    `;


    if (elementos.clientesEmpty) {

        elementos.clientesEmpty.hidden =
            true;

    }


    try {

        const datos =
            await obtenerAPI(
                "/cotizaciones"
            );


        if (!datos.ok) {

            throw new Error(
                "La API no devolvió cotizaciones válidas."
            );

        }


        estadoApp.cotizaciones =
            Array.isArray(datos.cotizaciones)
                ? datos.cotizaciones
                : [];


        estadoApp.clientes =
            construirClientesDesdeCotizaciones(
                estadoApp.cotizaciones
            );


        actualizarMetricasClientes(
            estadoApp.clientes
        );

        renderizarInteligenciaClientes(
    estadoApp.clientes
);


        llenarFiltroCiudades(
            estadoApp.clientes
        );


        estadoApp.clientesFiltrados =
            [...estadoApp.clientes];


        renderizarClientes(
            estadoApp.clientesFiltrados
        );


    } catch (error) {

        console.error(
            "Error cargando clientes:",
            error
        );


        elementos.clientesTable.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i
                        class="fa-solid fa-triangle-exclamation"
                    ></i>

                </div>

                <strong>
                    No se pudieron cargar los clientes
                </strong>

                <span>
                    Verifica que el backend esté ejecutándose.
                </span>

            </div>

        `;

    }

}

/* ============================================================
   CLIENTES — INTELIGENCIA COMERCIAL
   ============================================================ */

function renderizarInteligenciaClientes(clientes) {

    renderizarTerritorioClientes(clientes);

    renderizarEstadosClientes(clientes);

}


/* ============================================================
   TERRITORIO — CIUDADES
   ============================================================ */

function renderizarTerritorioClientes(clientes) {

    const contenedor =
        document.getElementById("clientesTerritorio");

    if (!contenedor) return;


    const mapaCiudades = new Map();


    clientes.forEach(cliente => {

        const ciudad =
            String(cliente?.ciudad || "").trim();

        if (!ciudad) return;


        mapaCiudades.set(
            ciudad,
            (mapaCiudades.get(ciudad) || 0) + 1
        );

    });


    const ciudades =
        Array.from(mapaCiudades.entries())

            .map(([ciudad, cantidad]) => ({
                ciudad,
                cantidad
            }))

            .sort(
                (a, b) =>
                    b.cantidad - a.cantidad
            );


    if (!ciudades.length) {

        contenedor.innerHTML = `

            <div class="clientes-intelligence-loading">

                <i class="fa-solid fa-location-dot"></i>

                <span>
                    No hay ciudades registradas.
                </span>

            </div>

        `;

        return;

    }


    const maximo =
        ciudades[0].cantidad;


    contenedor.innerHTML =
        ciudades.map((item, index) => {

            const porcentaje =
                maximo > 0
                    ? (item.cantidad / maximo) * 100
                    : 0;


            const porcentajeTotal =
                clientes.length > 0
                    ? (item.cantidad / clientes.length) * 100
                    : 0;


            return `

                <div class="cliente-intelligence-row">

                    <div class="cliente-intelligence-rank">

                        ${index + 1}

                    </div>


                    <div class="cliente-intelligence-main">

                        <div class="cliente-intelligence-name">

                            <span>
                                ${escaparHTML(item.ciudad)}
                            </span>

                            <small>
                                ${porcentajeTotal.toFixed(1)}%
                            </small>

                        </div>


                        <div class="cliente-intelligence-progress">

                            <span
                                style="width:${porcentaje}%"
                            ></span>

                        </div>

                    </div>


                    <strong class="cliente-intelligence-value">

                        ${formatearNumero(item.cantidad)}

                    </strong>

                </div>

            `;

        }).join("");

}


/* ============================================================
   ESTADOS COMERCIALES
   ============================================================ */

function renderizarEstadosClientes(clientes) {

    const contenedor =
        document.getElementById("clientesEstados");

    if (!contenedor) return;


    const mapaEstados = new Map();


    clientes.forEach(cliente => {

        const estado =
            String(
                cliente?.estado || "Pendiente"
            ).trim();


        mapaEstados.set(
            estado,
            (mapaEstados.get(estado) || 0) + 1
        );

    });


    const estados =
        Array.from(mapaEstados.entries())

            .map(([estado, cantidad]) => ({
                estado,
                cantidad
            }))

            .sort(
                (a, b) =>
                    b.cantidad - a.cantidad
            );


    if (!estados.length) {

        contenedor.innerHTML = `

            <div class="clientes-intelligence-loading">

                <i class="fa-solid fa-chart-simple"></i>

                <span>
                    No hay estados registrados.
                </span>

            </div>

        `;

        return;

    }


    const maximo =
        estados[0].cantidad;


    contenedor.innerHTML =
        estados.map(item => {

            const porcentaje =
                maximo > 0
                    ? (item.cantidad / maximo) * 100
                    : 0;


            const porcentajeTotal =
                clientes.length > 0
                    ? (item.cantidad / clientes.length) * 100
                    : 0;


            const claseEstado =
                obtenerClaseEstado(item.estado);


            return `

                <div class="cliente-intelligence-row">

                    <div class="cliente-intelligence-rank">

                        <span
                            class="cliente-estado-indicator ${claseEstado}"
                        ></span>

                    </div>


                    <div class="cliente-intelligence-main">

                        <div class="cliente-intelligence-name">

                            <span>
                                ${escaparHTML(item.estado)}
                            </span>

                            <small>
                                ${porcentajeTotal.toFixed(1)}%
                            </small>

                        </div>


                        <div
                            class="cliente-intelligence-progress ${claseEstado}"
                        >

                            <span
                                style="width:${porcentaje}%"
                            ></span>

                        </div>

                    </div>


                    <strong class="cliente-intelligence-value">

                        ${formatearNumero(item.cantidad)}

                    </strong>

                </div>

            `;

        }).join("");

}


/* ============================================================
   CONSTRUIR CLIENTES DESDE COTIZACIONES
   ============================================================ */

function construirClientesDesdeCotizaciones(
    cotizaciones
) {

    const clientesMap =
        new Map();


    for (
        const cotizacion of cotizaciones
    ) {

        const cliente =
            cotizacion.cliente || {};


        const celular =
            String(
                cliente.celular || ""
            ).trim();


        const clave =
            celular ||
            `${String(
                cliente.nombre || ""
            ).trim().toLowerCase()}|${String(
                cliente.apellido || ""
            ).trim().toLowerCase()}|${String(
                cliente.ciudad || ""
            ).trim().toLowerCase()}`;


        if (
            !clave ||
            clave === "||"
        ) {
            continue;
        }


        if (
            !clientesMap.has(clave)
        ) {

            clientesMap.set(
                clave,
                {

                    clave,

                    nombre:
                        cliente.nombre || "",

                    apellido:
                        cliente.apellido || "",

                    celular:
                        celular,

                    direccion:
                        cliente.direccion || "",

                    ciudad:
                        cliente.ciudad || "",

                    cotizaciones: [],

                    numeroCotizaciones:
                        0,

                    ultimaCotizacion:
                        null,

                    estado:
                        cotizacion.estadoComercial ||
                        "Pendiente",

                    unidadesTotales:
                        0

                }
            );

        }


        const clienteActual =
            clientesMap.get(clave);


        clienteActual.cotizaciones.push(
            cotizacion
        );


        clienteActual.numeroCotizaciones =
            clienteActual.cotizaciones.length;


        clienteActual.unidadesTotales +=
            Number(
                cotizacion.unidadesTotales || 0
            );


        const fechaCotizacion =
            cotizacion.fecha
                ? new Date(
                    cotizacion.fecha
                )
                : null;


        if (
            fechaCotizacion &&
            !Number.isNaN(
                fechaCotizacion.getTime()
            )
        ) {

            if (
                !clienteActual.ultimaCotizacion ||
                fechaCotizacion >
                clienteActual.ultimaCotizacion
            ) {

                clienteActual.ultimaCotizacion =
                    fechaCotizacion;

                clienteActual.estado =
                    cotizacion.estadoComercial ||
                    "Pendiente";

            }

        }

    }


    return Array.from(
        clientesMap.values()
    )
        .sort(
            (a, b) => {

                const fechaA =
                    a.ultimaCotizacion
                        ? a.ultimaCotizacion.getTime()
                        : 0;


                const fechaB =
                    b.ultimaCotizacion
                        ? b.ultimaCotizacion.getTime()
                        : 0;


                return fechaB - fechaA;

            }
        );

}


/* ============================================================
   MÉTRICAS CLIENTES
   ============================================================ */

function actualizarMetricasClientes(
    clientes
) {

    const totalClientes =
        clientes.length;


    const clientesActivos =
        clientes.filter(
            cliente => {

                const estado =
                    String(
                        cliente.estado || ""
                    )
                        .trim()
                        .toLowerCase();


                return (
                    estado !== "perdido"
                );

            }
        ).length;


    const totalCotizaciones =
        clientes.reduce(
            (
                total,
                cliente
            ) =>
                total +
                Number(
                    cliente.numeroCotizaciones ||
                    0
                ),
            0
        );


    const ciudades =
        new Set(
            clientes
                .map(
                    cliente =>
                        String(
                            cliente.ciudad || ""
                        ).trim()
                )
                .filter(Boolean)
        );


    actualizarTexto(
        elementos.clientesTotal,
        formatearNumero(
            totalClientes
        )
    );


    actualizarTexto(
        elementos.clientesActivos,
        formatearNumero(
            clientesActivos
        )
    );


    actualizarTexto(
        elementos.clientesCotizaciones,
        formatearNumero(
            totalCotizaciones
        )
    );


    actualizarTexto(
        elementos.clientesCiudades,
        formatearNumero(
            ciudades.size
        )
    );

}


/* ============================================================
   FILTRO DE CIUDADES
   ============================================================ */

function llenarFiltroCiudades(
    clientes
) {

    if (
        !elementos.clientesCiudadFilter
    ) {
        return;
    }


    const ciudadActual =
        elementos.clientesCiudadFilter.value;


    const ciudades =
        Array.from(
            new Set(
                clientes
                    .map(
                        cliente =>
                            String(
                                cliente.ciudad || ""
                            ).trim()
                    )
                    .filter(Boolean)
            )
        )
            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "es"
                    )
            );


    elementos.clientesCiudadFilter.innerHTML = `

        <option value="">
            Todas las ciudades
        </option>

        ${ciudades
            .map(
                ciudad => `

                    <option
                        value="${escaparHTML(
                            ciudad
                        )}"
                    >
                        ${escaparHTML(
                            ciudad
                        )}
                    </option>

                `
            )
            .join("")}

    `;


    if (
        ciudades.includes(
            ciudadActual
        )
    ) {

        elementos.clientesCiudadFilter.value =
            ciudadActual;

    }

}


/* ============================================================
   APLICAR FILTROS CLIENTES
   ============================================================ */

function aplicarFiltrosClientes() {

    const texto =
        String(
            elementos.clientesSearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const estado =
        String(
            elementos.clientesEstadoFilter?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const ciudad =
        String(
            elementos.clientesCiudadFilter?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    estadoApp.clientesFiltrados =
        estadoApp.clientes.filter(
            cliente => {

                const nombreCompleto =
                    `${cliente.nombre || ""} ${
                        cliente.apellido || ""
                    }`
                        .trim()
                        .toLowerCase();


                const celular =
                    String(
                        cliente.celular || ""
                    )
                        .toLowerCase();


                const ciudadCliente =
                    String(
                        cliente.ciudad || ""
                    )
                        .toLowerCase();


                const coincideTexto =
                    !texto ||
                    nombreCompleto.includes(
                        texto
                    ) ||
                    celular.includes(
                        texto
                    ) ||
                    ciudadCliente.includes(
                        texto
                    );


                const coincideEstado =
                    !estado ||
                    String(
                        cliente.estado || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    estado;


                const coincideCiudad =
                    !ciudad ||
                    ciudadCliente ===
                    ciudad;


                return (
                    coincideTexto &&
                    coincideEstado &&
                    coincideCiudad
                );

            }
        );


    renderizarClientes(
        estadoApp.clientesFiltrados
    );

}


/* ============================================================
   RENDERIZAR CLIENTES
   ============================================================ */

function renderizarClientes(
    clientes
) {

    if (
        !elementos.clientesTable
    ) {
        return;
    }


    if (
        !clientes.length
    ) {

        elementos.clientesTable.innerHTML =
            "";


        if (
            elementos.clientesEmpty
        ) {

            elementos.clientesEmpty.hidden =
                false;

        }

        return;

    }


    if (
        elementos.clientesEmpty
    ) {

        elementos.clientesEmpty.hidden =
            true;

    }


    elementos.clientesTable.innerHTML = `

        <div class="clientes-list">

            ${clientes
                .map(
                    cliente =>
                        crearFilaCliente(
                            cliente
                        )
                )
                .join("")}

        </div>

    `;


    configurarAccionesClientes();

}


/* ============================================================
   FILA / TARJETA CLIENTE
   ============================================================ */

function crearFilaCliente(
    cliente
) {

    const nombre =
        `${cliente.nombre || ""} ${
            cliente.apellido || ""
        }`
            .trim() ||
        "Cliente sin identificar";


    const estado =
        cliente.estado ||
        "Pendiente";


    const whatsapp =
        limpiarTelefono(
            cliente.celular
        );


    const ultimaCotizacion =
        cliente.ultimaCotizacion
            ? formatearFecha(
                cliente.ultimaCotizacion
            )
            : "Sin fecha";


    const cotizaciones =
        Number(
            cliente.numeroCotizaciones ||
            0
        );


    const unidades =
        Number(
            cliente.unidadesTotales ||
            0
        );


    return `

        <article
            class="cliente-card"
            data-cliente="${escaparHTML(
                cliente.clave
            )}"
        >

            <div class="cliente-card-main">

                <div class="cliente-avatar">

                    <span>
                        ${obtenerIniciales(
                            cliente.nombre,
                            cliente.apellido
                        )}
                    </span>

                </div>


                <div class="cliente-info">

                    <strong>
                        ${escaparHTML(
                            nombre
                        )}
                    </strong>

                    <span>
                        ${escaparHTML(
                            cliente.ciudad ||
                            "Ciudad no registrada"
                        )}
                    </span>

                </div>

            </div>


            <div class="cliente-data">

                <div class="cliente-data-item">

                    <span>
                        COTIZACIONES
                    </span>

                    <strong>
                        ${formatearNumero(
                            cotizaciones
                        )}
                    </strong>

                </div>


                <div class="cliente-data-item">

                    <span>
                        UNIDADES
                    </span>

                    <strong>
                        ${formatearNumero(
                            unidades
                        )}
                    </strong>

                </div>


                <div class="cliente-data-item">

                    <span>
                        ÚLTIMA COTIZACIÓN
                    </span>

                    <strong>
                        ${escaparHTML(
                            ultimaCotizacion
                        )}
                    </strong>

                </div>

            </div>


            <div class="cliente-card-status">

                <span
                    class="status-badge ${obtenerClaseEstado(
                        estado
                    )}"
                >
                    ${escaparHTML(
                        estado
                    )}
                </span>

            </div>


            <div class="cliente-card-actions">

                <button
                    type="button"
                    class="cliente-detail-button"
                    data-cliente-detail="${escaparHTML(
                        cliente.clave
                    )}"
                >

                    <span>
                        Ver detalle
                    </span>

                    <i
                        class="fa-solid fa-chevron-down"
                    ></i>

                </button>


                ${
                    whatsapp
                        ? `

                            <a
                                href="https://wa.me/${whatsapp}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="whatsapp-button cliente-whatsapp-button"
                                title="Abrir WhatsApp"
                            >

                                <i
                                    class="fa-brands fa-whatsapp"
                                ></i>

                            </a>

                        `
                        : ""
                }

            </div>


            <div class="cliente-details">

                <div class="cliente-details-inner">

                    <div class="cliente-detail-grid">

                        <div>

                            <span>
                                CELULAR
                            </span>

                            <strong>
                                ${escaparHTML(
                                    cliente.celular ||
                                    "No registrado"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                DIRECCIÓN
                            </span>

                            <strong>
                                ${escaparHTML(
                                    cliente.direccion ||
                                    "No registrada"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                CIUDAD
                            </span>

                            <strong>
                                ${escaparHTML(
                                    cliente.ciudad ||
                                    "No registrada"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                TOTAL DE UNIDADES
                            </span>

                            <strong>
                                ${formatearNumero(
                                    unidades
                                )}
                            </strong>

                        </div>

                    </div>


                    <div class="cliente-history">

                        <div class="cliente-history-header">

                            <span>
                                HISTORIAL COMERCIAL
                            </span>

                            <strong>
                                ${formatearNumero(
                                    cotizaciones
                                )}
                                ${
                                    cotizaciones === 1
                                        ? "cotización"
                                        : "cotizaciones"
                                }
                            </strong>

                        </div>


                        <div class="cliente-history-list">

                            ${
                                Array.isArray(
                                    cliente.cotizaciones
                                )
                                    ? cliente.cotizaciones
                                        .map(
                                            cotizacion =>
                                                crearHistorialCliente(
                                                    cotizacion
                                                )
                                        )
                                        .join("")
                                    : ""
                            }

                        </div>

                    </div>

                </div>

            </div>

        </article>

    `;

}


/* ============================================================
   HISTORIAL CLIENTE
   ============================================================ */

function crearHistorialCliente(
    cotizacion
) {

    const estado =
        cotizacion.estadoComercial ||
        "Pendiente";


    const productos =
        Array.isArray(
            cotizacion.productos
        )
            ? cotizacion.productos
                .map(
                    producto =>
                        producto?.producto ||
                        ""
                )
                .filter(Boolean)
                .join(", ")
            : "Sin productos";


    return `

        <div class="cliente-history-row">

            <div>

                <strong>
                    ${escaparHTML(
                        cotizacion.cotizacion
                    )}
                </strong>

                <span>
                    ${escaparHTML(
                        productos ||
                        "Sin productos"
                    )}
                </span>

            </div>


            <div>

                <span>
                    ${escaparHTML(
                        formatearFecha(
                            cotizacion.fecha
                        )
                    )}
                </span>

                <strong
                    class="status-badge ${obtenerClaseEstado(
                        estado
                    )}"
                >
                    ${escaparHTML(
                        estado
                    )}
                </strong>

            </div>

        </div>

    `;

}


/* ============================================================
   ACCIONES CLIENTES
   ============================================================ */

function configurarAccionesClientes() {

    document
        .querySelectorAll("[data-cliente-detail]")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const tarjeta =
                        boton.closest(
                            ".cliente-card"
                        );


                    if (!tarjeta) {
                        return;
                    }


                    const abierta =
                        tarjeta.classList.toggle(
                            "expanded"
                        );


                    const texto =
                        boton.querySelector(
                            "span"
                        );


                    if (texto) {

                        texto.textContent =
                            abierta
                                ? "Ocultar detalle"
                                : "Ver detalle";

                    }


                    boton.querySelector("i")
                        ?.classList.toggle(
                            "rotated",
                            abierta
                        );

                }
            );

        });

}


/* ============================================================
   UTILIDADES
   ============================================================ */

function actualizarTexto(
    elemento,
    valor
) {

    if (elemento) {

        elemento.textContent =
            valor;

    }

}


function formatearNumero(numero) {

    const valor =
        Number(
            numero ?? 0
        );


    if (
        !Number.isFinite(valor)
    ) {

        return "0";

    }


    return new Intl.NumberFormat(
        "es-CO"
    ).format(
        valor
    );

}


function formatearFecha(fecha) {

    if (!fecha) {
        return "Sin fecha";
    }


    const fechaObjeto =
        new Date(fecha);


    if (
        Number.isNaN(
            fechaObjeto.getTime()
        )
    ) {

        return "Fecha inválida";

    }


    return new Intl.DateTimeFormat(
        "es-CO",
        {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "America/Bogota"
        }
    ).format(
        fechaObjeto
    );

}


function formatearFechaSeguimiento(
    fecha
) {

    if (!fecha) {
        return "—";
    }


    const fechaObjeto =
        new Date(fecha);


    if (
        Number.isNaN(
            fechaObjeto.getTime()
        )
    ) {

        return "—";

    }


    return new Intl.DateTimeFormat(
        "es-CO",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "America/Bogota"
        }
    ).format(
        fechaObjeto
    );

}


function escaparHTML(valor) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function obtenerClaseEstado(
    estado
) {

    const valor =
        String(
            estado || ""
        )
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    const clases = {

        pendiente:
            "pending",

        contactado:
            "contacted",

        interesado:
            "interested",

        vendido:
            "sold",

        perdido:
            "lost"

    };


    return clases[
        valor
    ] || "pending";

}


function obtenerClasePrioridad(
    prioridad
) {

    const valor =
        String(
            prioridad || ""
        )
            .trim()
            .toLowerCase();


    if (valor === "alta") {
        return "high";
    }


    if (valor === "media") {
        return "medium";
    }


    return "normal";

}


function limpiarTelefono(
    telefono
) {

    let valor =
        String(
            telefono || ""
        )
            .replace(
                /\D/g,
                ""
            );


    if (
        valor.length === 10 &&
        valor.startsWith("3")
    ) {

        valor =
            `57${valor}`;

    }


    return valor;

}


function obtenerIniciales(
    nombre,
    apellido
) {

    const primera =
        String(
            nombre || ""
        )
            .trim()
            .charAt(0);


    const segunda =
        String(
            apellido || ""
        )
            .trim()
            .charAt(0);


    const iniciales =
        `${primera}${segunda}`
            .toUpperCase();


    return iniciales ||
        "PV";

}


/* ============================================================
   ERROR DE CONEXIÓN
   ============================================================ */

function mostrarErrorConexion() {

    actualizarTexto(
        elementos.metricCotizaciones,
        "!"
    );


    actualizarTexto(
        elementos.metricClientes,
        "!"
    );


    actualizarTexto(
        elementos.metricUnidades,
        "!"
    );


    actualizarTexto(
        elementos.metricPendientes,
        "!"
    );


    if (elementos.statusList) {

        elementos.statusList.innerHTML = `

            <div class="status-loading">

                <i
                    class="fa-solid fa-triangle-exclamation"
                    style="color:var(--red);"
                ></i>

                <br>

                No se pudo conectar con la API.

            </div>

        `;

    }

}