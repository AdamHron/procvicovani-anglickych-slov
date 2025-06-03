    document.getElementById("table218").style.display = "none";
    document.getElementById("table219").style.display = "none";
    document.getElementById("table220").style.display = "none";


function vyhledat() {
    const trida = document.getElementById("trida").value.trim();  // třída
    let unit = document.getElementById("unit").value.trim();    // unit
    let subunit = document.getElementById("subunit").value.trim(); // subunit

    // Pokud je unit nebo subunit 0 (nevybráno), změňme to na prázdnou hodnotu
    if (unit === "0") {
        unit = "";
    }
    if (subunit === "0") {
        subunit = "";
    }

    // Pro ladění: Zkontroluj, co se získává
    console.log("Třída: " + trida, "Unit: " + unit, "Subunit: " + subunit);

    // Získání všech tabulek
    const tabulky = document.querySelectorAll(".lekce");

    // Skrytí všech tabulek před filtrací
    tabulky.forEach(table => {
        table.style.display = "none";
    });

    // Kontrola, zda je vyplněná třída
    if (trida === "") {
        document.getElementById("zpráva").innerHTML = "Vyplňte pole třída";
        // Pokud třída není vyplněná, ukážeme všechny tabulky a neprovádíme žádnou filtraci
        tabulky.forEach(table => {
            table.style.display = "inline-block"; // Nebo "flex", pokud používáš flexbox
        });
        return; // Zastaví zbytek funkce
    }

    let foundMatch = false;  // Tento flag nám pomůže zjistit, zda jsme našli shodu

    tabulky.forEach(table => {
        const t = table.getAttribute("data-trida");    // Třída z atributu
        const u = table.getAttribute("data-unit");     // Unit z atributu
        const s = table.getAttribute("data-subunit");  // Subunit z atributu

        // Kontrola třídy (pokud se třída v tabulce shoduje s vybranou třídou)
        if (t === trida) {
            // Pokud jsou unit a subunit prázdné, zobrazíme všechny tabulky pro tuto třídu
            if ((unit === "" || u === unit) && (subunit === "" || s === subunit)) {
                table.style.display = "inline-block"; // Nebo "flex", pokud používáš flexbox
                foundMatch = true;
            }
        }
    });

    // Pokud není žádná tabulka, která odpovídá vybrané třídě, všechny tabulky budou stále viditelné
    if (!foundMatch) {
        document.getElementById("zpráva").innerHTML = "Žádná lekce pro toto vyhledávání.";
        // Ukážeme všechny tabulky, i když není nalezena shoda
        tabulky.forEach(table => {
            table.style.display = "inline-block"; // Nebo "flex", pokud používáš flexbox
        });
    } else {
        document.getElementById("zpráva").innerHTML = ""; // Skryjeme zprávu, pokud jsou nalezeny tabulky
    }
    document.getElementById("table218").style.display = "none";
    document.getElementById("table219").style.display = "none";
    document.getElementById("table220").style.display = "none";
}



function otevriLekci(tableElement) {
    const trida = tableElement.getAttribute("data-trida");
    const unit = tableElement.getAttribute("data-unit");
    const subunit = tableElement.getAttribute("data-subunit");
    const NepravidelnáSlovesa = tableElement.getAttribute("data-NepravidelnáSlovesa");

    localStorage.setItem("selectedTrida", trida);
    localStorage.setItem("selectedUnit", unit);
    localStorage.setItem("selectedSubunit", subunit);
    localStorage.setItem("selectedNepravidelnáSlovesa", NepravidelnáSlovesa);

    window.location.href = "lekce.html";
}

function NepravidelnáSlovesa() {
    const tabulky = document.querySelectorAll(".lekce");
    tabulky.forEach(table => {
        table.style.display = "none";
    });

    document.getElementById("table218").style.display = "inline-block";
    document.getElementById("table219").style.display = "inline-block";
    document.getElementById("table220").style.display = "inline-block";
}
