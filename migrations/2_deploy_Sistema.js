const SistemaElecciones = artifacts.require("SistemaElecciones");

module.exports = function (deployer){
    deployer.deploy(SistemaElecciones);
};

/*Este código JavaScript utiliza el framework Truffle para desplegar el contrato inteligente "Migrations" en una red blockchain. El contrato inteligente "Migrations" es utilizado por Truffle para registrar y realizar seguimiento del historial de migraciones que se han realizado en la red.

La primera línea de código importa el contrato inteligente "Migrations" utilizando la función artifacts.require(), que se encarga de buscar y cargar el contrato inteligente desde el sistema de archivos de Truffle.

La segunda línea de código exporta una función anónima que toma un objeto deployer como parámetro. El objeto deployer es proporcionado por Truffle y se utiliza para configurar y realizar la migración del contrato inteligente.

La tercera línea de código llama a la función deployer.deploy(), que se encarga de desplegar el contrato inteligente "Migrations" en la red blockchain. Este método acepta el contrato inteligente como parámetro y retorna una promesa que se resuelve cuando el despliegue es exitoso.

En resumen, este código JavaScript despliega el contrato inteligente "Migrations" utilizando Truffle en una red blockchain.*/