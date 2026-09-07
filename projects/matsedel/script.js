document.addEventListener("DOMContentLoaded", () => {
    // 1. Hämta datan från din JSON-textfil
    fetch('meny.json')
        .then(response => response.json())
        .then(data => {

            const menuGrid = document.getElementById('menu-grid');
            menuGrid.innerHTML = ''; // Rensa "Laddar..." texten

            const currentDayIndex = new Date().getDay(); // 0 = Söndag, 1 = Måndag...

            // 2. Loopa igenom varje dag i textfilen och bygg korten
            data.dagar.forEach(dag => {
                const isToday = currentDayIndex === dag.index;
                
                // Bygg kortets behållare
                const card = document.createElement('div');
                card.className = `day-card ${isToday ? 'is-today' : ''}`;
                
                // Skapa dagens header
                let todayText = isToday ? ' <span style="color:#2e7d32; font-size:0.85rem;">(Idag)</span>' : '';
                
                let cardHTML = `
                    <div class="day-header">
                        <h2 class="day-name">${dag.namn}${todayText}</h2>
                        <span class="day-date">${dag.datum}</span>
                    </div>
                `;

                // Skapa HTML för varje maträtt på den dagen
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
        })
        .catch(error => {
            console.error('Kunde inte ladda matsedeln:', error);
            document.getElementById('menu-grid').innerHTML = '<p>Kunde inte ladda matsedeln just nu.</p>';
        });
});
