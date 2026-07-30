// ------------------------------------
// Nákup 2.0
// app.js - kompletní verze
// ------------------------------------


let nakupy = JSON.parse(
    localStorage.getItem("nakupy")
) || [];



// ------------------------------------
// OSOBY
// ------------------------------------

let osoby = JSON.parse(
    localStorage.getItem("osoby")
);


if (!Array.isArray(osoby) || osoby.length === 0) {

    osoby = [
        "A",
        "S",
        "K",
        "N",
        "D"
    ];

    ulozitOsoby();

}



function ulozitOsoby(){

    localStorage.setItem(
        "osoby",
        JSON.stringify(osoby)
    );

}



// ZOBRAZENÍ OSOB

function zobrazOsoby(){


    const select =
    document.getElementById("osoba");


    select.innerHTML = "";



    osoby.forEach(function(osoba){


        let option =
        document.createElement("option");


        option.value = osoba;

        option.textContent = osoba;


        select.appendChild(option);


    });



    const seznam =
    document.getElementById("seznamOsob");



    if(seznam){


        seznam.innerHTML = "";


        osoby.forEach(function(osoba){


            let radek =
            document.createElement("div");


            radek.innerHTML = `

            ${osoba}

            <button onclick="smazatOsobu('${osoba}')">
            🗑️
            </button>

            `;


            seznam.appendChild(radek);


        });


    }



    aktualizovatStatistiky();


}




// PŘIDÁNÍ OSOBY

document
.getElementById("pridatOsobu")
.addEventListener("click", function(){



    let nova =
    document.getElementById("novaOsoba")
    .value
    .trim();



    if(nova === ""){

        alert("Zadej jméno osoby.");

        return;

    }



    if(osoby.includes(nova)){

        alert("Tato osoba už existuje.");

        return;

    }



    osoby.push(nova);


    ulozitOsoby();


    zobrazOsoby();



    document.getElementById("novaOsoba")
    .value = "";


});





// SMAZÁNÍ OSOBY

function smazatOsobu(osoba){


    if(confirm("Smazat osobu " + osoba + "?")){


        osoby =
        osoby.filter(function(o){

            return o !== osoba;

        });



        ulozitOsoby();


        zobrazOsoby();


    }


}






// DATUM

document.getElementById("datum").value =
new Date().toISOString().split("T")[0];






// ULOŽENÍ NÁKUPU

document
.getElementById("ulozit")
.addEventListener("click", function(){



    let nakup = {


        id: Date.now(),


        osoba:
        document.getElementById("osoba").value,


        castka:
        Number(document.getElementById("castka").value),


        datum:
        document.getElementById("datum").value,


        poznamka:
        document.getElementById("poznamka").value


    };



    if(!nakup.castka || nakup.castka <=0){

        alert("Zadej částku.");

        return;

    }



    nakupy.push(nakup);


    ulozitData();


    zobrazNakupy();


    vycistitFormular();


});





function ulozitData(){

    localStorage.setItem(
        "nakupy",
        JSON.stringify(nakupy)
    );

}





function vycistitFormular(){


    document.getElementById("castka").value="";


    document.getElementById("poznamka").value="";


}






// TABULKA

function zobrazNakupy(){


    const tabulka =
    document.getElementById("tabulka");


    tabulka.innerHTML="";



    nakupy.forEach(function(nakup){


        let radek =
        document.createElement("tr");



        radek.innerHTML = `

        <td>${nakup.datum}</td>

        <td>${nakup.osoba}</td>

        <td>${formatKc(nakup.castka)}</td>

        <td>${nakup.poznamka || ""}</td>

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




function smazat(id){


    nakupy =
    nakupy.filter(function(n){

        return n.id !== id;

    });


    ulozitData();


    zobrazNakupy();


}







// STATISTIKA

function aktualizovatStatistiky(){


    let celkem = 0;


    let soucty = {};



    osoby.forEach(function(osoba){

        soucty[osoba]=0;

    });



    nakupy.forEach(function(nakup){


        let castka =
        Number(nakup.castka)||0;


        celkem += castka;



        if(soucty[nakup.osoba] !== undefined){

            soucty[nakup.osoba]+=castka;

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

        if(Number(n.castka)>maximum){

            maximum=Number(n.castka);

        }

    });



    document.getElementById("maximum")
    .textContent =
    formatKc(maximum);




    const box =
    document.getElementById("souctyOsob");



    if(box){


        box.innerHTML="";


        osoby.forEach(function(osoba){


            box.innerHTML += `

            <div class="osoba ${osoba}">

            ${osoba}

            <br>

            <span>
            ${formatKc(soucty[osoba])}
            </span>

            </div>

            `;


        });


    }




    let dnes =
    new Date();



    let mesic =
    nakupy.filter(function(n){

        let d =
        new Date(n.datum);


        return d.getMonth()===dnes.getMonth()
        &&
        d.getFullYear()===dnes.getFullYear();


    })
    .reduce(function(s,n){

        return s + Number(n.castka||0);

    },0);



    document.getElementById("mesic")
    .textContent =
    formatKc(mesic);



}







function formatKc(cislo){

    return Number(cislo || 0)
    .toLocaleString("cs-CZ")
    + " Kč";

}







// START

zobrazNakupy();

zobrazOsoby();





// ------------------------------------
// TMAVÝ REŽIM
// ------------------------------------

const darkModeBtn =
document.getElementById("darkModeBtn");



darkModeBtn.addEventListener("click",function(){

    document.body.classList.toggle("dark");


    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );


});



if(localStorage.getItem("darkMode")==="true"){

    document.body.classList.add("dark");

}
