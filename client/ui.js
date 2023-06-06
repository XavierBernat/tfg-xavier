//Utilizar las id's
const voteForm = document.querySelector("#voteForm")
const addForm = document.querySelector("#addForm")
const seeForm = document.querySelector("#voteKnwForm")


document.addEventListener("DOMContentLoaded", () => {
    App.init()
})



voteForm.addEventListener("submit", e => {
    e.preventDefault(); //Cancelar el autorefresh

    const nombre = voteForm["nombreVoto"].value;

    App.voto(nombre);


}),
    addForm.addEventListener("submit", e => {
        e.preventDefault(); //Cancelar el autorefresh

        const candidato = addForm["candidato"].value;
        const edad = addForm["edad"].value;
        const identificacion = addForm["identificacion"].value;

        App.crearCandidato(candidato, edad, identificacion);


    }),
    seeForm.addEventListener("submit", e => {
        e.preventDefault(); //Cancelar el autorefresh

        const nombreV = seeForm["nombreVotos"].value;
        App.verVotos(nombreV);
    })