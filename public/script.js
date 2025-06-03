async function nactiSlovicka() {
  const res = await fetch("/slovicka");
  let slovicka = await res.json();

  // Odstranění slovíček, která mají NepravidelnáSlovesa (libovolné číslo)
  slovicka = slovicka.filter(slovo => !slovo.hasOwnProperty("NepravidelnáSlovesa"));

  // Zajistíme, že každé slovíčko má timestamp (fallback na 0)
  slovicka.forEach(slovo => {
    if (!slovo.timestamp) slovo.timestamp = 0;
  });

  const razeni = document.getElementById("razeni").value;
  if (razeni === "trida-asc") {
    slovicka.sort((a, b) => a.trida - b.trida);
  } else if (razeni === "trida-desc") {
    slovicka.sort((a, b) => b.trida - a.trida);
  } else if (razeni === "naposledy") {
    slovicka.sort((a, b) => b.timestamp - a.timestamp);
  }

  zobrazTabulku(slovicka);
}


function zobrazTabulku(slovicka) {
  const select = document.getElementById("razeni");
  const vyber = select ? select.value : "poradi";

  const serazena = [...slovicka];

  if (vyber === "trida-vzestupne") {
    serazena.sort((a, b) => a.trida - b.trida);
  } else if (vyber === "trida-sestupne") {
    serazena.sort((a, b) => b.trida - a.trida);
  }

  const tbody = document.querySelector("#slovicka-tab tbody");
  tbody.innerHTML = "";

  serazena.forEach((slovo) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
  <td title="${slovo.cz}">${slovo.cz}</td>
  <td title="${slovo.en}">${slovo.en}</td>
  <td>${slovo.trida}</td>
  <td>${slovo.unit}</td>
  <td title="${slovo.subunit || ""}">${slovo.subunit || ""}</td>
      <td>
        <button id="button-upravit" title="Upravit" onclick="upravSlovo(${slovo.timestamp})">✏️</button>
        <button id="button-smazat" title="Smazat" onclick="smazatSlovicko(${slovo.timestamp})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function upravSlovo(timestamp) {
  const res = await fetch("/slovicka");
  const slovicka = await res.json();
  const slovo = slovicka.find(s => s.timestamp === timestamp);
  if (!slovo) return;

  const form = document.getElementById("slovicko-form");
  form.cz.value = slovo.cz;
  form.en.value = slovo.en;
  form.trida.value = slovo.trida;
  form.unit.value = slovo.unit;
  form.subunit.value = slovo.subunit || "";

  form.dataset.editTimestamp = timestamp;

  document.getElementById("přidat").textContent = "Upravit";
}



function smazatSlovicko(timestamp) {
  if (!confirm("Opravdu chceš smazat toto slovíčko?")) return;

  fetch(`/smazat/${timestamp}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("vysledek").textContent = data.zprava;
      nactiSlovicka();
    })
    .catch(err => {
      console.error("Chyba při mazání slovíčka:", err);
      document.getElementById("vysledek").textContent = "Chyba při mazání.";
    });
}

document.getElementById("slovicko-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const slovicko = {
    cz: form.cz.value.trim(),
    en: form.en.value.trim(),
    trida: parseInt(form.trida.value),
    unit: parseInt(form.unit.value),
    subunit: form.subunit.value.trim()
  };

  const editTimestamp = form.dataset.editTimestamp;

  try {
    const response = await fetch(
      editTimestamp !== undefined
        ? `/uprav/${editTimestamp}`
        : "/pridat",
      {
        method: editTimestamp !== undefined ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slovicko)
      }
    );

    const text = await response.text();
    document.getElementById("vysledek").textContent = text;

    if (!response.ok) throw new Error(text);

    delete form.dataset.editTimestamp;
    form.reset();
    document.getElementById("přidat").textContent = "Přidat";

    nactiSlovicka();
  } catch (err) {
    document.getElementById("vysledek").textContent = "⚠️ " + err.message;
  }
});

nactiSlovicka();
document.getElementById("razeni").addEventListener("change", nactiSlovicka);
