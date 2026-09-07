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
