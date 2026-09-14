require("dotenv").config();

const { sincronizarExcel } = require("./services/syncExcel");

async function ejecutar() {
    try {
        const resultado = await sincronizarExcel();

        console.log("==========================================");
        console.log("RESULTADO FINAL");
        console.log("==========================================");
        console.log(JSON.stringify(resultado, null, 2));

        process.exit(0);

    } catch (error) {
        console.error("");
        console.error("ERROR EN LA SINCRONIZACIÓN:");
        console.error(error);
        console.error("");

        process.exit(1);
    }
}

ejecutar();