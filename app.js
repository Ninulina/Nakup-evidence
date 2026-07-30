// ------------------------------------
// Nákup 2.0
// app.js - základní funkce
// ------------------------------------


let nakupy = JSON.parse(
    localStorage.getItem("nakupy")
) || [];

// ------------------------------------
// OSOBY
// ------------------------------------

let osoby = JSON.parse(
    localStorage.getItem("osoby")
) || [
    "A",
    "S",
    "K",
    "N",
    "D"
];



function ulozitOsoby(){

    localStorage.setItem(
        "osoby",
        JSON.stringify(osoby)
    );

}



function zobrazOsoby(){

    const select =
    document.getElementById("osoba");


    select.innerHTML = "";


    osoby.forEach(function(osoba){


        const option =
        document.createElement("option");


        option.value = osoba;

        option.textContent = osoba;


        select.appendChild(option);


    });

}

// nastavení dnešního data

document.getElementById("datum").value =
    new Date().toISOString().split("T")[0];



// ULOŽENÍ NÁKUPU

document.getElementById("ulozit")
.addEventListener("click", function () {


    const osoba =
        document.getElementById("osoba").value;


    const castka =
        Number(document.getElementById("castka").value);


    const datum =
        document.getElementById("datum").value;


    const poznamka =
        document.getElementById("poznamka").value;



    if (!castka || castka <= 0) {

        alert("Zadej prosím částku.");

        return;

    }



    const nakup = {

        id: Date.now(),

        osoba: osoba,

        castka: castka,

        datum: datum,

        poznamka: poznamka

    };



    nakupy.push(nakup);


    ulozitData();


    zobrazNakupy();


    vycistitFormular();



});




// ULOŽENÍ DO PROHLÍŽEČE

function ulozitData(){

    localStorage.setItem(
        "nakupy",
        JSON.stringify(nakupy)
    );

}




// VYČIŠTĚNÍ FORMULÁŘE

function vycistitFormular(){

    document.getElementById("castka").value = "";

    document.getElementById("poznamka").value = "";

}





// ZOBRAZENÍ TABULKY

function zobrazNakupy(){


    const tabulka =
        document.getElementById("tabulka");


    tabulka.innerHTML = "";



    nakupy.forEach(function(nakup){



        const radek =
        document.createElement("tr");



        radek.innerHTML = `

        <td>${nakup.datum || ""}</td>

        <td class="${nakup.osoba}">
        ${nakup.osoba || ""}
        </td>


        <td>
        ${formatKc(nakup.castka)}
        </td>


        <td>
        ${nakup.poznamka || ""}
        </td>


        <td>

        <button onclick="smazat(${nakup.id})">
        🗑️
        </button>

        </td>

        `;



        tabulka.appendChild(radek);



    });



    aktualizovatStatistiky();


}





// SMAZÁNÍ

function smazat(id){


    if(confirm("Opravdu chceš smazat tento nákup?")){


        nakupy =
        nakupy.filter(
            function(n){
                return n.id !== id;
            }
        );


        ulozitData();

        zobrazNakupy();


    }

}





// STATISTIKY

function aktualizovatStatistiky(){


    let celkem = 0;


    let osoby = {

        A:0,
        S:0,
        K:0,
        N:0,
        D:0

    };



    nakupy.forEach(function(nakup){



        let castka =
        Number(nakup.castka) || 0;



        celkem += castka;



        if(osoby[nakup.osoba] !== undefined){

            osoby[nakup.osoba] += castka;

        }


    });




    document.getElementById("celkem")
    .textContent =
    formatKc(celkem);



    document.getElementById("pocet")
    .textContent =
    nakupy.length;



    let maximum = 0;


    nakupy.forEach(function(n){

        let c =
        Number(n.castka) || 0;


        if(c > maximum){

            maximum = c;

        }

    });



    document.getElementById("maximum")
    .textContent =
    formatKc(maximum);




    document.getElementById("sumaA")
    .textContent =
    formatKc(osoby.A);


    document.getElementById("sumaS")
    .textContent =
    formatKc(osoby.S);


    document.getElementById("sumaK")
    .textContent =
    formatKc(osoby.K);


    document.getElementById("sumaN")
    .textContent =
    formatKc(osoby.N);


    document.getElementById("sumaD")
    .textContent =
    formatKc(osoby.D);



    // tento měsíc

    const dnes =
    new Date();


    let mesic =
    nakupy
    .filter(function(n){

        let d =
        new Date(n.datum);


        return (
            d.getMonth() === dnes.getMonth()
            &&
            d.getFullYear() === dnes.getFullYear()
        );

    })
    .reduce(function(suma,n){

        return suma + (Number(n.castka)||0);

    },0);



    document.getElementById("mesic")
    .textContent =
    formatKc(mesic);


}





// FORMÁT KČ

function formatKc(cislo){


    cislo =
    Number(cislo) || 0;


    return cislo.toLocaleString("cs-CZ")
    + " Kč";


}




// START APLIKACE

zobrazNakupy();
zobrazOsoby();
// ------------------------------------
// TMAVÝ REŽIM
// ------------------------------------

const darkModeBtn = document.getElementById("darkModeBtn");


darkModeBtn.addEventListener("click", function(){

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

});


// načtení režimu po otevření stránky

if(localStorage.getItem("darkMode") === "true"){

    document.body.classList.add("dark");

}
