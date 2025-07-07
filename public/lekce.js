const selectedTrida = parseInt(localStorage.getItem("selectedTrida"));
const selectedUnit = parseInt(localStorage.getItem("selectedUnit"));
const selectedSubunit = localStorage.getItem("selectedSubunit");
const selectedNepravidelnáSlovesa = parseInt(localStorage.getItem("selectedNepravidelnáSlovesa"));
document.getElementById("button2").style.display = "none";

let words = [];
let filteredWords = [];
let currentWord = null;
let previousWord = null;
let active = true;
let numberOfAnswers = 0;
let numberOfCorrectAnswers = 0;

async function nactiSlovicka() {
  const res = await fetch("/slovicka");
  if (!res.ok) throw new Error("Nepodařilo se načíst slovíčka.");
  return await res.json();
}

// === Začátek aplikace ===
nactiSlovicka().then(slovicka => {
  words = slovicka;

  // Filtrování až PO načtení
  if (!isNaN(selectedNepravidelnáSlovesa)) {
      filteredWords = words.filter(word =>
          word.NepravidelnáSlovesa === selectedNepravidelnáSlovesa
      );
  } else {
      filteredWords = words.filter(word =>
          word.trida === selectedTrida &&
          word.unit === selectedUnit &&
          word.subunit === selectedSubunit
      );
  }

  // ✅ Spustit až po vytvoření filteredWords
  getRandomWord(); 

}).catch(err => {
  console.error("Chyba při načítání slovíček:", err);
});


// Zbytek tvého kódu zůstává beze změny:


document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    document.getElementById("button1").click();
  }
});

// Funkce pro nastavení focusu do vstupního pole
function focusInput() {
  document.getElementById("userAnswer").focus();
}

// Po načtení stránky
window.addEventListener("DOMContentLoaded", function() {
  focusInput();
});

// Po kliknutí na tlačítko „Další“
document.getElementById("button2").addEventListener("click", function() {
  // ... tady můžeš mít další logiku pro novou otázku
  focusInput(); // kurzor se znovu nastaví do inputu
});


function getRandomWord() {
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * filteredWords.length);
        currentWord = filteredWords[randomIndex];
    } while (previousWord === currentWord && filteredWords.length > 1);

    document.getElementById("h2").textContent = currentWord.en;
    previousWord = currentWord;
}


document.getElementById("myPieChart").style.display = "none";
document.getElementById("button3").style.display = "none";
document.getElementById("button4").style.display = "none";



function updateChart() {
    // Aktualizujte data grafu podle počtu správných a nesprávných odpovědí
    myPieChart.data.datasets[0].data = [numberOfCorrectAnswers, numberOfAnswers + 1 - numberOfCorrectAnswers];
    myPieChart.update(); // Aktualizujte graf, aby se změny projevily
}


function button() {
    const userAnswer = document.getElementById("userAnswer").value.trim().toLowerCase();
    const result = document.getElementById("result");
    let correctAnswer = "";

    if (active) {
        if (userAnswer === "") {
            result.innerHTML = "Vyplňte pole";
            result.style.color = "red";
            return;
        }

        // Vyber správnou odpověď podle hodnoty NepravidelnáSlovesa
        if (currentWord.NepravidelnáSlovesa === 1) {
            correctAnswer = currentWord.PastSimple.toLowerCase().trim();
        } else if (currentWord.NepravidelnáSlovesa === 2) {
            correctAnswer = currentWord.PastParticiple.toLowerCase().trim();
        } else if (currentWord.NepravidelnáSlovesa === 3) {
            correctAnswer = currentWord.cz.toLowerCase().trim();
        } else {
            // fallback pro běžná slovíčka
            correctAnswer = currentWord.cz.toLowerCase().trim();
        }

        if (userAnswer === correctAnswer) {
            result.innerHTML = "Správně!";
            result.style.color = "green";
            numberOfCorrectAnswers++;
        } else {
            result.innerHTML = `Špatně. Správná odpověď je: ${correctAnswer}`;
            result.style.color = "red";
        }

        document.getElementById("button2").style.display = "block";
        active = false;
        updateChart();
    }
}


getRandomWord();
document.getElementById("button2").style.display = "none";

function finish() {
    document.getElementById("button2").style.display = "none";
    document.getElementById("button1").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("userAnswer").style.display = "none";
    document.getElementById("tabulka").style.display = "none";
    document.getElementById("h2").style.display = "none";
    document.getElementById("překlad-nápis").style.display = "none";

        const nadpis = document.getElementById("nadpis");
        nadpis.innerHTML = `Vyhodnocení`;

    document.getElementById("myPieChart").style.display = "block";

    document.getElementById("numberOfCorrectAnswers").innerHTML = `Správně: ${numberOfCorrectAnswers}`;
    document.getElementById("numberOfIncorrectAnswers").innerHTML = `Špatně: ${15 - numberOfCorrectAnswers}`;
    document.getElementById("úspěšnost").innerHTML = `Úspěšnost: ${Math.round(numberOfCorrectAnswers / 15 * 100)}%`;

    document.getElementById("button3").style.display = "block";
    document.getElementById("button4").style.display = "block";  
    
    



        // Data pro koláčový graf
        const data = {
            labels: ['Správně', 'Špatně'],
            datasets: [{
                data: [numberOfCorrectAnswers, 15 - numberOfCorrectAnswers], // Počet nebo procenta
                backgroundColor: ['#33FF57', '#FF5733'], // Barvy pro jednotlivé díly
                borderColor: ['#fff', '#fff'], // Barvy okrajů
                borderWidth: 2
            }]
        };

        // Možnosti grafu (volitelné)
        const options = {
            responsive: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true, // Zobrazit tooltip při najetí na graf
                }
            }
        };

        // Vytvoření grafu
        const ctx = document.getElementById('myPieChart').getContext('2d');
        const myPieChart = new Chart(ctx, {
            type: 'pie',  // Typ grafu: 'pie' pro kulatý graf
            data: data,
            options: options
        });

}


function next() {    
    numberOfAnswers++;

    const button2 = document.getElementById("button2");
    if (numberOfAnswers === 14) {
        button2.innerHTML = `Dokončit`;
    }
    else if(numberOfAnswers === 15) {
        finish();
    }
    else {
        button2.innerHTML = `Další`;
    }

    document.getElementById("userAnswer").value = "";
    result.innerHTML = ``;
    getRandomWord();
    document.getElementById("button2").style.display = "none";
    document.getElementById("userAnswer").value = "";
    active = true;
}
