const searchBtn = document.getElementById("searchBtn");
const pokemonInput = document.getElementById("pokemonInput");
const pokemonDisplay = document.getElementById("pokemonDisplay");
const teamDisplay = document.getElementById("teamDisplay");

const cache = {};

searchBtn.addEventListener("click", async () => {
    const query = pokemonInput.value.toLowerCase();

    if (cache[query]) {
        displayPokemon(cache[query]);
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        const data = await response.json();

        cache[query] = data; // cache it
        displayPokemon(data);
    } catch (error) {
        alert("Pokemon not found!");
    }
});

function displayPokemon(data) {

    pokemonDisplay.innerHTML = "";

    const img = document.createElement("img");
    img.src = data.sprites.front_default;

    const audio = document.createElement("audio");
    audio.controls = true;

    if (data.cries && data.cries.latest) {
        audio.src = data.cries.latest;
    }

    pokemonDisplay.appendChild(img);
    pokemonDisplay.appendChild(audio);

    createMoveDropdowns(data.moves, data.name);
}

function createMoveDropdowns(moves, pokemonName) {

    for (let i = 1; i <= 4; i++) {
        const select = document.createElement("select");
        select.id = `move${i}`;

        moves.slice(0, 20).forEach(moveObj => {
            const option = document.createElement("option");
            option.value = moveObj.move.name;
            option.textContent = moveObj.move.name;
            select.appendChild(option);
        });

        pokemonDisplay.appendChild(select);
        pokemonDisplay.appendChild(document.createElement("br"));
    }

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add to Team";

    addBtn.addEventListener("click", () => {
        addToTeam(pokemonName);
    });

    pokemonDisplay.appendChild(addBtn);
}

function addToTeam(pokemonName) {

    const selectedMoves = [
        document.getElementById("move1").value,
        document.getElementById("move2").value,
        document.getElementById("move3").value,
        document.getElementById("move4").value
    ];

    const teamMember = document.createElement("div");

    teamMember.innerHTML = `
        <h3>${pokemonName}</h3>
        <p>Moves:</p>
        <ul>
            <li>${selectedMoves[0]}</li>
            <li>${selectedMoves[1]}</li>
            <li>${selectedMoves[2]}</li>
            <li>${selectedMoves[3]}</li>
        </ul>
    `;

    teamDisplay.appendChild(teamMember);
}
