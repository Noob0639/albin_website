document.addEventListener("DOMContentLoaded", () => {
    fetch('meny.json')
        .then(response => response.json())
        .then(data => {
            const menuGrid = document.getElementById('menu-grid');
            const header = document.querySelector('header');
            
            // 1. Räkna ut nuvarande veckonummer (ISO-8601 standard)
            const nu = new Date();
            const jan4 = new Date(nu.getFullYear(), 0, 4);
            const nuSondag = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate() + (7 - (nu.getDay() || 7)));
            const nuvarandeVecka = Math.ceil((((nuSondag - jan4) / 86400000) + jan4.getDay() + 1) / 7);

            // 2. FILTRERING: Spara bara denna vecka och framtida veckor
            const giltigaVeckor = data.veckor.filter(v => v.vecka >= nuvarandeVecka);

            // Om alla veckor i filen har passerat
            if (giltigaVeckor.length === 0) {
                menuGrid.innerHTML = '<p>Matsedeln är inte uppdaterad för denna vecka ännu.</p>';
                return;
            }

            // 3. Skapa dropdown-meny (visar bara aktuella/framtida veckor)
            const selectContainer = document.createElement('div');
            selectContainer.style.margin = '20px 0';
            
            let selectHTML = '<label for="veckoVal" style="font-weight:bold; margin-right:10px;">Välj vecka: </label>';
            selectHTML += '<select id="veckoVal" style="padding:8px 16px; font-size:1rem; border-radius:4px; border:1px solid #ccc;">';
            
            giltigaVeckor.forEach(v => {
                const arNuvarande = v.vecka === nuvarandeVecka;
                selectHTML += `<option value="${v.vecka}" ${arNuvarande ? 'selected' : ''}>Vecka ${v.vecka} ${arNuvarande ? '(Denna vecka)' : ''}</option>`;
            });
            selectHTML += '</select>';
            selectContainer.innerHTML = selectHTML;
            header.appendChild(selectContainer);

            // 4. Funktion för att rita ut vald vecka
            function visaVecka(veckoNummer) {
                const valdVeckaData = giltigaVeckor.find(v => v.vecka == veckoNummer);
                
                if (!valdVeckaData) {
                    menuGrid.innerHTML = '<p>Ingen matsedel hittades för vald vecka.</p>';
                    return;
                }

                menuGrid.innerHTML = ''; // Rensa gamla kort

                const dagensIndex = new Date().getDay(); // 0 = Söndag, 1 = Måndag...
                const arKorrektVecka = Number(veckoNummer) === nuvarandeVecka;

                valdVeckaData.dagar.forEach(dag => {
                    const isToday = arKorrektVecka && (dagensIndex === dag.index);
                    
                    const card = document.createElement('div');
                    card.className = `day-card ${isToday ? 'is-today' : ''}`;
                    
                    let todayText = isToday ? ' <span style="color:#2e7d32; font-size:0.85rem;">(Idag)</span>' : '';
                    
                    let cardHTML = `
                        <div class="day-header">
                            <h2 class="day-name">${dag.namn}${todayText}</h2>
                            <span class="day-date">${dag.datum}</span>
                        </div>
                    `;

                    dag.ratter.forEach(ratt => {
                        let nyTag = ratt.nyhet ? '<span class="new-tag">NY</span>' : '';
                        let detaljer = ratt.detaljer ? `<span class="meal-details">${ratt.detaljer}</span>` : '';
                        
                        cardHTML += `
                            <div class="meal-option">
                                <span class="badge">${ratt.ikon}</span>
                                <span class="meal-title">${ratt.titel} ${nyTag}</span>
                                ${detaljer}
                            </div>
                        `;
                    });

                    card.innerHTML = cardHTML;
                    menuGrid.appendChild(card);
                });
            }

            // Lyssna på vecko-byten
            document.getElementById('veckoVal').addEventListener('change', (e) => {
                visaVecka(e.target.value);
            });

            // Starta med att visa den aktuella veckan
            const harNuvarandeVecka = giltigaVeckor.some(v => v.vecka === nuvarandeVecka);
            visaVecka(harNuvarandeVecka ? nuvarandeVecka : giltigaVeckor[0].vecka);
        })
        .catch(error => {
            console.error('Kunde inte ladda matsedeln:', error);
            document.getElementById('menu-grid').innerHTML = '<p>Kunde inte ladda matsedeln just nu.</p>';
        });
});

let deferredPrompt;
const pwaBanner = document.getElementById('pwa-banner');
const pwaAccept = document.getElementById('pwa-accept');
const pwaClose = document.getElementById('pwa-close');

// 1. Räkna besök i localStorage så vi inte stör förstagångsbesökare
let visitCount = localStorage.getItem('matsedel_visits') || 0;
visitCount = parseInt(visitCount) + 1;
localStorage.setItem('matsedel_visits', visitCount);

// 2. Fånga upp Android/Chrome-installationstriggern
window.addEventListener('beforeinstallprompt', (e) => {
  // Förhindra att webbläsaren visar sin egen prompt direkt
  e.preventDefault();
  deferredPrompt = e;

  // Kontrollera villkor: Visa bara om användaren har nekat förut och om det är minst andra besöket
  const isDismissed = localStorage.getItem('pwa_dismissed');
  
  if (!isDismissed && visitCount >= 2) {
    // Visa vår snygga, anpassade banner
    pwaBanner.style.display = 'block';
  }
});

// 3. Om användaren klickar på "Lägg till"
pwaAccept.addEventListener('click', async () => {
  if (deferredPrompt) {
    // Visa den riktiga installationsdialogen
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    // Rensa sparad prompt oavsett val
    deferredPrompt = null;
    pwaBanner.style.display = 'none';
  }
});

// 4. Om användaren stänger ner bannern (Spara i localStorage så den aldrig stör igen)
pwaClose.addEventListener('click', () => {
  pwaBanner.style.display = 'none';
  localStorage.setItem('pwa_dismissed', 'true');
});

// 5. Hantera iOS (Safari) separat eftersom det saknar 'beforeinstallprompt'
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIOS && !isInStandaloneMode && visitCount >= 2 && !localStorage.getItem('pwa_dismissed')) {
  // För iOS ändrar vi texten så den förklarar hur man gör manuellt i Safari
  const bannerText = pwaBanner.querySelector('p');
  bannerText.innerHTML = 'För att spara appen: Klicka på dela-knappen <span style="font-size:18px;">⎋</span> i botten av Safari och välj <strong>"Lägg till på hemskärmen"</strong>.';
  
  // Ta bort den vanliga accept-knappen då iOS-användare måste göra det via webbläsaren
  pwaAccept.style.display = 'none';
  pwaBanner.style.display = 'block';
}
