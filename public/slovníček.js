document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("slovnicek-body");
  const tridaSelect = document.getElementById("trida");
  const unitSelect = document.getElementById("unit");
  const subunitSelect = document.getElementById("subunit");
  const button = document.getElementById("button");
  const nepravidelnáButton = document.getElementById("nepravidelna-button");
  const thead = document.querySelector("#slovnicek thead tr");

  let slovicka = [];
  let nepravidelnáRežim = false;

  const updateTableHead = (zobrazSlovesa) => {
    thead.innerHTML = "";
    if (zobrazSlovesa) {
      thead.innerHTML = `
        <th width="100">anglické slovo</th>
        <th width="100">české slovo</th>
        <th width="100">Past simple</th>
        <th width="100">Past participle</th>
      `;
    } else {
      thead.innerHTML = `
        <th width="100">anglické slovo</th>
        <th width="100">české slovo</th>
      `;
    }
  };

  const renderTable = (data, zobrazSlovesa = false) => {
    tbody.innerHTML = "";
    updateTableHead(zobrazSlovesa);
    data.forEach(slovo => {
      const row = document.createElement("tr");
      if (zobrazSlovesa) {
        row.innerHTML = `
          <td>${slovo.en}</td>
          <td>${slovo.cz}</td>
          <td>${slovo.PastSimple || ""}</td>
          <td>${slovo.PastParticiple || ""}</td>
        `;
      } else {
        row.innerHTML = `
          <td>${slovo.en}</td>
          <td>${slovo.cz}</td>
        `;
      }
      tbody.appendChild(row);
    });
  };

  const filterSlovicka = () => {
    document.getElementById("zpráva").innerHTML = "";
    nepravidelnáRežim = false;
    updateTableHead(false);

    const tridaValue = tridaSelect.value;
    const unitValue = unitSelect.value;
    const subunitValue = subunitSelect.value;

    if (tridaValue === "0") {
      document.getElementById("zpráva").innerHTML = "Žádná slova pro toto vyhledávání.";
      renderTable(slovicka.filter(slovo => !slovo.NepravidelnáSlovesa));
      return;
    }

    if (unitValue === "0" && subunitValue !== "0") {
      document.getElementById("zpráva").innerHTML = "Žádná slova pro toto vyhledávání.";
      renderTable(slovicka.filter(slovo => !slovo.NepravidelnáSlovesa));
      return;
    }

    const filtered = slovicka.filter(slovo => {
      if (slovo.NepravidelnáSlovesa === 1) return false;
      const matchesTrida = slovo.trida == tridaValue;
      const matchesUnit = unitValue === "0" || slovo.unit == unitValue;
      const matchesSubunit = subunitValue === "0" || slovo.subunit === subunitValue;
      return matchesTrida && matchesUnit && matchesSubunit;
    });

    renderTable(filtered);
  };

  const zobrazNepravidelnáSlovesa = () => {
    nepravidelnáRežim = true;
    const nepravidelná = slovicka.filter(slovo => slovo.NepravidelnáSlovesa === 1);
    renderTable(nepravidelná, true);
  };

  const init = () => {
    fetch("/slovicka")
      .then(res => res.json())
      .then(data => {
        slovicka = data;
        renderTable(slovicka.filter(slovo => !slovo.NepravidelnáSlovesa));
      })
      .catch(err => {
        document.getElementById("zpráva").innerHTML = "Nepodařilo se načíst slovíčka.";
        console.error("Chyba při načítání:", err);
      });
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();
    filterSlovicka();
  });

  nepravidelnáButton.addEventListener("click", (event) => {
    event.preventDefault();
    zobrazNepravidelnáSlovesa();
  });

  init(); // spustíme načtení při načtení stránky
});
