-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" SERIAL NOT NULL,
    "cotizacion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3),
    "fechaLocal" TIMESTAMP(3),
    "estado" TEXT,
    "origen" TEXT,
    "nombre" TEXT,
    "apellido" TEXT,
    "celular" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "productoId" TEXT,
    "producto" TEXT,
    "categoria" TEXT,
    "subcategoria" TEXT,
    "altura" TEXT,
    "cantidad" INTEGER,
    "referencias" TEXT,
    "unidadesTotales" INTEGER,
    "ultimaActualizacion" TIMESTAMP(3),
    "responsable" TEXT,
    "observaciones" TEXT,
    "estadoComercial" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "celular" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "primeraCotizacion" TIMESTAMP(3),
    "ultimaCotizacion" TIMESTAMP(3),
    "numeroCotizaciones" INTEGER,
    "estado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos_solicitados" (
    "id" SERIAL NOT NULL,
    "productoId" TEXT NOT NULL,
    "producto" TEXT,
    "categoria" TEXT,
    "subcategoria" TEXT,
    "altura" TEXT,
    "unidadesSolicitadas" INTEGER,
    "numeroCotizaciones" INTEGER,
    "ultimaSolicitud" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_solicitados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_analytics" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT,
    "productName" TEXT,
    "categoria" TEXT,
    "quantity" INTEGER,
    "height" TEXT,
    "quoteId" TEXT,
    "itemsCount" INTEGER,
    "totalUnits" INTEGER,
    "source" TEXT,

    CONSTRAINT "eventos_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cotizaciones_cotizacion_key" ON "cotizaciones"("cotizacion");

-- CreateIndex
CREATE INDEX "cotizaciones_fecha_idx" ON "cotizaciones"("fecha");

-- CreateIndex
CREATE INDEX "cotizaciones_estado_idx" ON "cotizaciones"("estado");

-- CreateIndex
CREATE INDEX "cotizaciones_ciudad_idx" ON "cotizaciones"("ciudad");

-- CreateIndex
CREATE INDEX "cotizaciones_productoId_idx" ON "cotizaciones"("productoId");

-- CreateIndex
CREATE INDEX "cotizaciones_estadoComercial_idx" ON "cotizaciones"("estadoComercial");

-- CreateIndex
CREATE INDEX "cotizaciones_origen_idx" ON "cotizaciones"("origen");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_clienteId_key" ON "clientes"("clienteId");

-- CreateIndex
CREATE INDEX "clientes_celular_idx" ON "clientes"("celular");

-- CreateIndex
CREATE INDEX "clientes_ciudad_idx" ON "clientes"("ciudad");

-- CreateIndex
CREATE INDEX "clientes_estado_idx" ON "clientes"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "productos_solicitados_productoId_key" ON "productos_solicitados"("productoId");

-- CreateIndex
CREATE INDEX "productos_solicitados_categoria_idx" ON "productos_solicitados"("categoria");

-- CreateIndex
CREATE INDEX "productos_solicitados_subcategoria_idx" ON "productos_solicitados"("subcategoria");

-- CreateIndex
CREATE INDEX "eventos_analytics_nombre_idx" ON "eventos_analytics"("nombre");

-- CreateIndex
CREATE INDEX "eventos_analytics_fecha_idx" ON "eventos_analytics"("fecha");

-- CreateIndex
CREATE INDEX "eventos_analytics_productId_idx" ON "eventos_analytics"("productId");

-- CreateIndex
CREATE INDEX "eventos_analytics_quoteId_idx" ON "eventos_analytics"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_admin_username_key" ON "usuarios_admin"("username");
