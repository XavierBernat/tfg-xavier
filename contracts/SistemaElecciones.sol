// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
pragma experimental ABIEncoderV2;

contract SistemaElecciones {
    //Direccion del propietario del contrato
    address public propietario;

    //Relación entre el nombre del candidato y el hash de sus datos personales
    mapping(string => bytes32) ID_candidato;

    // Relación entre el nombre del candidato y el número de votos
    mapping(string => uint) votos_candidato;

    //Lista para almacenar los nombres de los candidatos
    string[][] candidatos;

    //Lista de los votantes, sirve para identificar a los votantes y que no se vote mas de una vez
    bytes32[] votantes; //hash de la identidad de los votantes

    //Permitir presentarse a las elecciones
    function crearCandidato(
        string memory _nombreCandidato,
        uint _edadCandidato,
        string memory _idCandidato
    ) public {
        //Hash de los datos del candidato
        require(_edadCandidato > 17, unicode"La edad mínima es 18");
        bytes32 hash_Candi = keccak256(
            abi.encodePacked(_nombreCandidato, _edadCandidato, _idCandidato)
        );
        //A continuación se verá si el id tiene un tamaño de 9 carácteres
        bytes memory idBytes = bytes(_idCandidato);
        require(
            idBytes.length == 9,
            unicode"El ID del candidato debe tener exactamente 9 caracteres"
        );
        // Verificar si ya existe un candidato con la misma ID
        for (uint i = 0; i < candidatos.length; i++) {
            if (
                keccak256(abi.encodePacked(candidatos[i][1])) ==
                keccak256(abi.encodePacked(_idCandidato))
            ) {
                // Si ya existe un candidato con la misma ID, lanzamos una excepción
                revert("Ya existe un candidato con la misma ID");
            }
        }

        //Almacenar hash de los datos del candidato ligados a su nombre
        ID_candidato[_nombreCandidato] = hash_Candi;

        //Almacenar nombre del candidato con funcion push
        //candidatos.push(_nombreCandidato);
        candidatos.push([_nombreCandidato, _idCandidato]);
    }

    //función que indique que candidatos hay
    function verCandidatos() public view returns (string[][] memory) {
        // Inicializamos una nueva matriz de cadenas para almacenar los nombres y Id's de los candidatos
        string[][] memory nomId = new string[][](candidatos.length);

        // Recorremos la matriz candidatos y almacenamos los nombres e Id's de cada candidato en la nueva matriz
        for (uint i = 0; i < candidatos.length; i++) {
            // Creamos una nueva sub-matriz para almacenar el nombre y los Id's del candidato actual
            nomId[i] = new string[](2);
            nomId[i][0] = candidatos[i][0]; // Almacenamos el nombre del candidato
            nomId[i][1] = candidatos[i][1]; // Almacenamos la Id del candidato
        }

        // Devolvemos la nueva matriz de nombres y Id's
        return nomId;
    }

    //funcion que permite votar
    function voto(string memory _candidatoId) public {
        //Calculo del hush de la persona que ha intentado votar
        bytes32 hash_votante = keccak256(abi.encodePacked(msg.sender));

        //Verificación de que el votante NO ha votado
        for (uint i = 0; i < votantes.length; i++) {
            require(votantes[i] != hash_votante, unicode"Usted ya ha votado!");
        }

        //Se verifica la existencia del candidato
        bool existe = false;
        for (uint i = 0; i < candidatos.length; i++) {
            if (
                keccak256(abi.encodePacked(candidatos[i][1])) ==
                keccak256(abi.encodePacked(_candidatoId))
            ) {
                existe = true;
                break;
            }
        }
        require(existe, unicode"El candidatoindicado No existe");

        //Almacenamos el hash del votante dentro del array de votantes
        votantes.push(hash_votante);

        //Añadir un voto al candidato
        votos_candidato[_candidatoId]++;
    }

    //Dado el nombre del candidato se devuelve el número de votos que tiene
    function verVotos(string memory _candidatoId) public view returns (uint) {
        return votos_candidato[_candidatoId]; //Obtener los votos que tiene el candidato
    }

    //Obtención del candidato ganador de las elecciones
    function winner() public view returns (string memory, string memory) {
        //Esta variable va a obtener el nomre del ganador
        string memory idGanador = candidatos[0][1];
        string memory nomGanador = candidatos[0][0];
        bool empate;

        for (uint i = 1; i < candidatos.length; i++) {
            if (
                votos_candidato[idGanador] < votos_candidato[candidatos[i][1]]
            ) {
                idGanador = candidatos[i][1];
                nomGanador = candidatos[i][0];
                empate = false;
            } else {
                if (
                    votos_candidato[idGanador] ==
                    votos_candidato[candidatos[i][1]]
                ) {
                    empate = true;
                }
            }
        }
        if (empate == true) {
            nomGanador = unicode"¡Hay un empate entre candidatos!";
            idGanador = "";
        }
        return (nomGanador, idGanador);
    }
}
