const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, "data", "lekce-data.json");

app.use(express.json());
app.use(express.static("public"));

// Pomocné funkce
function readWords() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeWords(words) {
  fs.writeFileSync(filePath, JSON.stringify(words, null, 2), "utf8");
}

// Přidání nového slovíčka
app.post("/pridat", (req, res) => {
  const slovicka = readWords();

  const noveSlovo = {
    ...req.body,
    timestamp: Date.now()
  };

  // Ověření duplicit
  const existuje = slovicka.some(s =>
    s.cz === noveSlovo.cz &&
    s.en === noveSlovo.en &&
    s.trida === noveSlovo.trida &&
    s.unit === noveSlovo.unit &&
    s.subunit === noveSlovo.subunit
  );

  if (existuje) {
    return res.status(400).send("Toto slovíčko už existuje.");
  }

  slovicka.push(noveSlovo);
  writeWords(slovicka);
  res.send("Slovíčko bylo přidáno.");
});


// Úprava slovíčka
app.put("/uprav/:timestamp", (req, res) => {
  const timestamp = parseInt(req.params.timestamp);
  const slovicka = readWords();

  const index = slovicka.findIndex(s => s.timestamp === timestamp);
  if (index === -1) {
    return res.status(404).send("Slovíčko nenalezeno.");
  }

  const noveSlovo = {
    ...req.body,
    timestamp: Date.now(), // aktualizuj timestamp
  };

  // Zkontroluj duplicitu
  const jeDuplicitni = slovicka.some((s, i) =>
    i !== index &&
    s.cz === noveSlovo.cz &&
    s.en === noveSlovo.en &&
    s.trida === noveSlovo.trida &&
    s.unit === noveSlovo.unit &&
    s.subunit === noveSlovo.subunit
  );

  if (jeDuplicitni) {
    return res.status(400).send("Toto slovíčko už existuje.");
  }

  slovicka[index] = noveSlovo;
  writeWords(slovicka);
  res.send("Slovíčko bylo upraveno.");
});


// Smazání slovíčka podle timestampu
app.delete('/smazat/:timestamp', (req, res) => {
  const timestamp = parseInt(req.params.timestamp);
  const words = readWords();

  const index = words.findIndex(w => w.timestamp === timestamp);
  if (index === -1) {
    return res.status(400).json({ zprava: "Slovíčko nebylo nalezeno." });
  }

  words.splice(index, 1);
  writeWords(words);
  res.json({ zprava: "Slovíčko bylo smazáno." });
});

// Získání všech slovíček
app.get("/slovicka", (req, res) => {
  res.json(readWords());
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
