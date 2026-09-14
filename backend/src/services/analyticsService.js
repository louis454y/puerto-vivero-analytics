require("dotenv").config();

const {
    BetaAnalyticsDataClient
} = require("@google-analytics/data");

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

const analyticsClient = new BetaAnalyticsDataClient();

/**
 * Obtiene un valor numérico de una métrica de GA4.
 */
function getMetricValue(row, index = 0) {
    return Number(row?.metricValues?.[index]?.value || 0);
}

/**
 * Obtiene el valor de una dimensión de GA4.
 */
function getDimensionValue(row, index = 0) {
    return row?.dimensionValues?.[index]?.value || "(not set)";
}

/**
 * Obtiene los datos completos de Analytics.
 *
 * days:
 * 7  = últimos 7 días
 * 30 = últimos 30 días
 * 90 = últimos 90 días
 */
async function obtenerAnalytics(days = 7) {
    if (!PROPERTY_ID) {
        throw new Error(
            "GA4_PROPERTY_ID no está configurado en el archivo .env"
        );
    }

    const property = `properties/${PROPERTY_ID}`;

    const dateRange = {
        startDate: `${days}daysAgo`,
        endDate: "today"
    };

    // =========================================================
    // 1. RESUMEN GENERAL
    // =========================================================

    const [summaryResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        metrics: [
            {
                name: "activeUsers"
            },
            {
                name: "sessions"
            },
            {
                name: "screenPageViews"
            },
            {
                name: "eventCount"
            }
        ]
    });

    const summaryRow = summaryResponse.rows?.[0];

    const summary = {
        activeUsers: summaryRow
            ? getMetricValue(summaryRow, 0)
            : 0,

        sessions: summaryRow
            ? getMetricValue(summaryRow, 1)
            : 0,

        pageViews: summaryRow
            ? getMetricValue(summaryRow, 2)
            : 0,

        events: summaryRow
            ? getMetricValue(summaryRow, 3)
            : 0
    };

    // =========================================================
    // 2. TRÁFICO POR DÍA
    // =========================================================

    const [trafficResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        dimensions: [
            {
                name: "date"
            }
        ],

        metrics: [
            {
                name: "sessions"
            }
        ],

        orderBys: [
            {
                dimension: {
                    dimensionName: "date"
                }
            }
        ]
    });

    const traffic = (trafficResponse.rows || []).map((row) => ({
        date: getDimensionValue(row, 0),
        sessions: getMetricValue(row, 0)
    }));

    // =========================================================
    // 3. DISPOSITIVOS
    // =========================================================

    const [devicesResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        dimensions: [
            {
                name: "deviceCategory"
            }
        ],

        metrics: [
            {
                name: "activeUsers"
            }
        ],

        orderBys: [
            {
                metric: {
                    metricName: "activeUsers"
                },

                desc: true
            }
        ]
    });

    const devices = (devicesResponse.rows || []).map((row) => ({
        name: getDimensionValue(row, 0),
        value: getMetricValue(row, 0)
    }));

    // =========================================================
    // 4. PAÍSES
    // =========================================================

    const [countriesResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        dimensions: [
            {
                name: "country"
            }
        ],

        metrics: [
            {
                name: "activeUsers"
            }
        ],

        orderBys: [
            {
                metric: {
                    metricName: "activeUsers"
                },

                desc: true
            }
        ],

        limit: 10
    });

    const countries = (countriesResponse.rows || []).map((row) => ({
        name: getDimensionValue(row, 0),
        value: getMetricValue(row, 0)
    }));

    // =========================================================
    // 5. CIUDADES
    // =========================================================

    const [citiesResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        dimensions: [
            {
                name: "city"
            }
        ],

        metrics: [
            {
                name: "activeUsers"
            }
        ],

        orderBys: [
            {
                metric: {
                    metricName: "activeUsers"
                },

                desc: true
            }
        ],

        limit: 10
    });

    const cities = (citiesResponse.rows || []).map((row) => ({
        name: getDimensionValue(row, 0),
        value: getMetricValue(row, 0)
    }));

    // =========================================================
    // 6. PÁGINAS MÁS VISITADAS
    // =========================================================

    const [pagesResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        dimensions: [
            {
                name: "pageTitle"
            },
            {
                name: "pagePath"
            }
        ],

        metrics: [
            {
                name: "screenPageViews"
            }
        ],

        orderBys: [
            {
                metric: {
                    metricName: "screenPageViews"
                },

                desc: true
            }
        ],

        limit: 10
    });

    const pages = (pagesResponse.rows || []).map((row) => ({
        name: getDimensionValue(row, 0),
        path: getDimensionValue(row, 1),
        value: getMetricValue(row, 0)
    }));

    // =========================================================
    // 7. FUENTES DE TRÁFICO
    // =========================================================

    const [sourcesResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        dimensions: [
            {
                name: "sessionSourceMedium"
            }
        ],

        metrics: [
            {
                name: "sessions"
            }
        ],

        orderBys: [
            {
                metric: {
                    metricName: "sessions"
                },

                desc: true
            }
        ],

        limit: 10
    });

    const sources = (sourcesResponse.rows || []).map((row) => ({
        name: getDimensionValue(row, 0),
        value: getMetricValue(row, 0)
    }));

    // =========================================================
    // 8. EVENTOS IMPORTANTES DEL NEGOCIO
    // =========================================================

    const [eventsResponse] = await analyticsClient.runReport({
        property,

        dateRanges: [dateRange],

        dimensions: [
            {
                name: "eventName"
            }
        ],

        metrics: [
            {
                name: "eventCount"
            }
        ],

        dimensionFilter: {
            filter: {
                fieldName: "eventName",

                inListFilter: {
                    values: [
                        "view_product",
                        "select_product",
                        "begin_quote",
                        "quote_submitted",
                        "whatsapp_click"
                    ]
                }
            }
        },

        orderBys: [
            {
                metric: {
                    metricName: "eventCount"
                },

                desc: true
            }
        ]
    });

    const events = (eventsResponse.rows || []).map((row) => ({
        name: getDimensionValue(row, 0),
        value: getMetricValue(row, 0)
    }));

    // =========================================================
    // RESPUESTA FINAL
    // =========================================================

    return {
        ok: true,

        propertyId: PROPERTY_ID,

        range: {
            days,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        },

        summary,

        traffic,

        devices,

        countries,

        cities,

        pages,

        sources,

        events,

        generatedAt: new Date().toISOString()
    };
}

module.exports = {
    obtenerAnalytics
};