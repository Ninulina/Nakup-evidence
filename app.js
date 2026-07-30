// ------------------------------------
// Nákup 2.0
// Základní logika aplikace
// ------------------------------------


// načtení uložených nákupů

let nakupy = JSON.parse(
    localStorage.getItem("nakupy")
) || [];




// nastavení dnešního data

document.getElementById("datum").value =
    new Date().toISOString().split("T")[0];





// tlačítko uložit

document.getElementById("ulozit")
.addEventListener("click", function(){



    let osoba =
    document.getElementById("osoba").value;


    let castka =
    Number(document.getElementById("castka").value);


    let datum =
    document.getElementById("datum").value;


    let poznamka =
    document.getElementById("poznamka").value;



    if(!castka){

        alert("Zadej částku.");

        return;

    }




    let nakup = {

        id: Date.now(),

        osoba,

        castka,

        datum,

        poznamka

    };



    nakupy.push(nakup);



    ulozitData();



    zobrazNakupy();



    vycistitFormular();



});







// uložení dat

function ulozitData(){

    localStorage.setItem(
        "nakupy",
        JSON.stringify(nakupy)
    );

}






// vyčištění formuláře

function vycistitFormular(){


    document.getElementById("castka").value="";

    document.getElementById("poznamka").value="";


}







// zobrazení tabulky

function zobrazNakupy(){



let tabulka =
document.getElementById("tabulka");


tabulka.innerHTML="";



nakupy
.sort((a,b)=> new Date(b.datum)-new Date(a.datum))
.forEach(function(nakup){



let radek = document.createElement("tr");



radek.innerHTML = `


<td>${nakup.datum}</td>

<td class="${nakup.osoba}">
${nakup.osoba}
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









// mazání

function smazat(id){


if(confirm("Opravdu chceš smazat tento nákup?")){


nakupy =
nakupy.filter(
n => n.id !== id
);


ulozitData();


zobrazNakupy();


}


}










// statistiky


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



celkem += nakup.castka;



if(osoby[nakup.osoba] !== undefined){

    osoby[nakup.osoba]
    += nakup.castka;

}



});





document.getElementById("celkem")
.textContent =
formatKc(celkem);



document.getElementById("pocet")
.textContent =
nakupy.length;



let maximum =
nakupy.length
?
Math.max(...nakupy.map(n=>n.castka))
:
0;



document.getElementById("maximum")
.textContent =
formatKc(maximum);





document.getElementById("sumaA")
.textContent=formatKc(osoby.A);


document.getElementById("sumaS")
.textContent=formatKc(osoby.S);


document.getElementById("sumaK")
.textContent=formatKc(osoby.K);


document.getElementById("sumaN")
.textContent=formatKc(osoby.N);


document.getElementById("sumaD")
.textContent=formatKc(osoby.D);





// tento měsíc


let dnes =
new Date();



let mesic =
nakupy
.filter(n=>{

let d =
new Date(n.datum);

return (
d.getMonth()
===
dnes.getMonth()
&&
d.getFullYear()
===
dnes.getFullYear()
);

})
.reduce(
(sum,n)=>sum+n.castka,
0
);





document.getElementById("mesic")
.textContent =
formatKc(mesic);



}









// formát částky


function formatKc(cislo){


return cislo.toLocaleString(
"cs-CZ"
)
+
" Kč";


}







// první načtení


zobrazNakupy();
