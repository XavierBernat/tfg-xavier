const extraerMensajeDeError = (e) => {
    let errorMessage = 'Ha ocurrido un error';

    if (typeof e.reason !== 'undefined') {
        errorMessage = e.reason;
    } else if (typeof e.message !== 'undefined') {
        const rawError = e.message;
        const rawErrorMatches = rawError.match(/"reason"\s*:\s*"([^"]*)"/);

        if (typeof rawErrorMatches[1] !== 'undefined') {
            errorMessage = rawErrorMatches[1];
        }
    }

    return errorMessage;
};

App = {

    contracts: {},
    init: async () => {
        console.log('Loaded')
        await App.loadEthereum() // o this.loadEthereum
        await App.loadAccount()
        await App.loadContracts()
        App.render()
        await App.getBlockDetails(1)
        await App.renderCandidato()
        await App.renderGanador()
    },

    loadEthereum: async () => {
        if (window.ethereum) {
          App.web3Provider = window.ethereum;
          console.log('ethereum existe');
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' }); // enlazar cuenta ethereum
            App.web3 = new Web3(App.web3Provider); // Obtener la instancia de web3 utilizando el proveedor de MetaMask
          } catch (error) {
            console.error('Error al solicitar cuenta de MetaMask:', error);
          }
        } else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
          App.web3 = new Web3(App.web3Provider);
          web3.eth.handleRevert = true;
        } else {
          console.log('No hay instalado ningún navegador ethereum. Intenta usar MetaMask.');
        }
      },

    loadAccount: async () => {

        const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
        App.account = account[0]

    },

    loadContracts: async () => {
        const res = await fetch("SistemaElecciones.json")
        const voteContractJSON = await res.json()       //obtengo el JSON

        App.contracts.voteContract = TruffleContract(voteContractJSON)  //Convierto el JSON

        App.contracts.voteContract.setProvider(App.web3Provider)        //Conectar a metamask el contracto

        App.voteContract = await App.contracts.voteContract.deployed() //Intentar utilizar el contrato
    },

    render: () => {
        document.getElementById('account').innerText = App.account
    },

    renderGanador: async () => {
        const ganador = await App.voteContract.winner()
        console.log(ganador)

        let html = ''

        let elementoGanador = `
        <div class="card card-body bg-dark mb-2">
                <div className="card-header">
                    <h5>${ganador[0]}</h5>
                    <h5>${ganador[1]}</h5>
                </div>
        </div>  
        `
        html = elementoGanador;
        document.querySelector('#verGanador').innerHTML = html;
    },

    renderCandidato: async () => {
        const candi = await App.voteContract.verCandidatos()
        longitud = candi.length
        console.log(candi)

        let html = ''

        for (let i = 0; i < longitud; i++) {
            const candidatNom = candi[i][0];
            const candidatId = candi[i][1];

            let elementoCandidato = `
                <div class="card bg-dark mb-2">
                    <div className="card-header">
                        <span>${candidatNom}</span>
                        <span>${candidatId}</span>
                    </div>
                </div>    
            `
            html += elementoCandidato;
        }

        document.querySelector('#listaCandidatos').innerHTML = html;


        console.log(longitud)
    },


    crearCandidato: async (candidato, edad, identificacion) => {
        try {
            const resultado = await App.voteContract.crearCandidato(candidato, edad, identificacion, {
                from: App.account
            })
            document.getElementById("#mensajeError").innerText = "El candidato ha sido creado con éxito"
            console.log('Candidato creado de forma exitosa')
        } catch (e) {
            const errorMessage = extraerMensajeDeError(e);
            document.getElementById('mensajeError').innerText = errorMessage;
            document.getElementById('mensajeError').style.display = 'block';

        }

    },

    voto: async (nombreVoto) => {
        try {
            const resultado = await App.voteContract.voto(nombreVoto, {
                from: App.account
            })
            document.getElementById("#mensajeError").innerText = "Voto realizado correctamente"
            console.log('Voto realizado correctamente')
        } catch (e) {
            const errorMessage = extraerMensajeDeError(e);
            document.getElementById('mensajeError').innerText = errorMessage;
            document.getElementById('mensajeError').style.display = 'block';
        }
    },

    verVotos: async (nombreVotos) => {

        let html = ''

        const resultado = await App.voteContract.verVotos(nombreVotos, {
            from: App.account
        })

        let elementoCandidato = `
        <div class="card bg-dark mb-2">
            <div className="card-header">
                <span>${resultado}</span>
            </div>
        </div>    
    `
        html = elementoCandidato;
        document.querySelector('#votosCandidato').innerHTML = html;

    },
    getBlockDetails: async (blockNumber) => {
        try {
          const block = await App.web3.eth.getBlock(blockNumber); // Utilizar la instancia de web3 para obtener detalles del bloque
          console.log('Block Details:', block);
          // Aquí puedes realizar cualquier acción adicional con los detalles del bloque
        } catch (error) {
          console.error('Error al recuperar detalles del bloque:', error);
        }
      },
}
