const { createApp } = Vue
createApp({
    data() {
        // Standard-Daten (dein bisheriges Setup)
        const defaultData = {
            title: "MYJEOPARDY",
            theme: { primary: '#060ce9', secondary: '#ffcc00' },
            teams: [{ name: "TEAM 1", score: 0 }, { name: "TEAM 2", score: 0 }],
            categories: Array.from({length: 5}, (_, i) => ({ 
                name: "KATEGORIE " + (i+1), 
                questions: Array.from({length: 5}, () => ({ 
                    q: "Frage...", a: "Antwort...", mode: 'normal', done: false 
                })) 
            }))
        };

        // Versuch, Daten aus dem LocalStorage zu laden
        const savedData = localStorage.getItem('myJeopardyData');
        
        return {
            isEditing: false,
            showAnswer: false,
            activeTile: null,
            // Wenn gespeicherte Daten existieren, parsen wir sie, sonst Default
            gameData: savedData ? JSON.parse(savedData) : defaultData
        }
    },
    watch: {
        gameData: {
            handler(newData) {
                // 1. CSS Variablen für das Color Wheel aktualisieren
                document.documentElement.style.setProperty('--primary', newData.theme.primary);
                document.documentElement.style.setProperty('--secondary', newData.theme.secondary);

                // 2. Das gesamte Spiel im LocalStorage speichern
                localStorage.setItem('myJeopardyData', JSON.stringify(newData));
                console.log("Spielstand automatisch gespeichert.");
            },
            deep: true,
            immediate: true
        }   
    },
    mounted() {
        this.checkUrlForData();
        if (this.gameData.theme) {
            document.documentElement.style.setProperty('--primary', this.gameData.theme.primary);
            document.documentElement.style.setProperty('--secondary', this.gameData.theme.secondary);
        }
        // Drag & Drop Listener
        window.addEventListener('dragover', (e) => e.preventDefault());
        window.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) this.processFile(file);
        });
      },
  	computed: {
        rootStyles() { return { '--primary': this.gameData.theme.primary, '--secondary': this.gameData.theme.secondary } },
        
        getModalBorderClass() {
            if (!this.activeTile) return {}; // Falls kein Modal offen ist
            
            const mode = this.activeTile.data.mode;
            
            // Im Edit-Modus lassen wir den Rahmen standardmäßig weiß/primär
            if (this.isEditing) return { 'border-[10px] border-white': true };

            // Logik für den Spiel-Modus
            return {
                'border-[10px]': true, // Basis-Breite
                'border-white': mode === 'normal', // Standard
                'border-double': mode === 'double', // Silber (CSS)
                'border-triple': mode === 'triple', // Gold (CSS)
                'joker-glow': mode === 'joker'     // Akzentfarbe (CSS)
            };
        },
        
        // Prüft, ob alle Fragen auf 'done' stehen
        gameFinished() {
            return this.gameData.categories.every(cat => 
                cat.questions.every(q => q.done === true)
            );
        },
        // Sortiert die Teams nach Score für das Treppchen
        sortedTeams() {
            // 1. Teams nach Score sortieren
            const sorted = [...this.gameData.teams].sort((a, b) => b.score - a.score);
            
            // 2. Den Rang berechnen (Teams mit gleichem Score bekommen gleichen Rang)
            let currentRank = 0;
            return sorted.map((team, index) => {
                if (index > 0 && team.score < sorted[index - 1].score) {
                    currentRank++;
                }
                return { ...team, rank: currentRank };
            });
        }
    },
    methods: {
        shareGame() {
            try {
                // 1. Spielstand komprimieren
                const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(this.gameData));
                
                // 2. URL bauen
                const shareUrl = `${window.location.origin}${window.location.pathname}?data=${compressed}`;
                
                // 3. In Zwischenablage kopieren
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert("Share-Link in die Zwischenablage kopiert! 🔗");
                });
            } catch (e) {
                console.error("Sharing failed", e);
                alert("Fehler beim Erstellen des Links. Das Spiel ist eventuell zu groß.");
            }
        },
        checkUrlForData() {
            const urlParams = new URLSearchParams(window.location.search);
            const data = urlParams.get('data');
            
            if (data) {
                try {
                    const decompressed = LZString.decompressFromEncodedURIComponent(data);
                    if (decompressed) {
                        const importedData = JSON.parse(decompressed);
                        this.gameData = importedData;
                        // URL säubern, damit beim Refresh nicht alles neu lädt
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                } catch (e) {
                    console.error("URL-Import fehlgeschlagen", e);
                }
            }
        },
        // Hilfsfunktion: Platziert den 1. in die Mitte (2-1-3 Layout)
        getPodiumOrder(index) {
            const mapping = [2, 1, 3, 4, 5, 6, 7, 8]; 
            return mapping[index] || index;
        },
        getCalculatedValue() {
            if (!this.activeTile) return 0;
            const base = this.activeTile.value;
            const mode = this.activeTile.data.mode || 'normal';
            if (mode === 'double') return base * 2;
            if (mode === 'triple') return base * 3;
            return base; // Joker gibt jetzt auch die Basis-Punkte gratis
        },
        parseContent(text, isPreview = false) {
            if (!text) return "";
            
            // Regex für das Format /typ(url)
            const mediaRegex = /\/(image|video|audio)\(([^)]+)\)/g;
            
            return text.replace(mediaRegex, (match, type, url) => {
                // YouTube-Logik: Erkennt normale Links und Short-Links
                const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
                let finalUrl = url;

                if (isYouTube) {
                    // Extrahiert die Video-ID
                    const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
                    // Erstellt den Embed-Link (autoplay=1 für direkten Start im Modal)
                    finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                }

                if (type === 'image') {
                    return `<img src="${url}" class="${isPreview ? '' : 'mx-auto shadow-xl'}">`;
                }
                
                if (type === 'video' || type === 'audio') {
                    if (isYouTube) {
                        // YouTube Embed (funktioniert für Video und Audio-Inhalte von YT gleichermaßen)
                        return isPreview ? `[YT-${type.toUpperCase()}]` : 
                            `<div class="aspect-video w-full max-w-3xl mx-auto shadow-2xl rounded-xl overflow-hidden border-4 border-white">
                                <iframe width="100%" height="100%" src="${finalUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            </div>`;
                    } else {
                        // Fallback für direkte Datei-Links (.mp4, .mp3, .wav)
                        return isPreview ? `[FILE-${type.toUpperCase()}]` : 
                            `<${type} src="${url}" controls ${type === 'video' ? 'class="mx-auto shadow-xl"' : 'class="mx-auto w-full max-w-md"'}></${type}>`;
                    }
                }
            });
        },
        handleTileClick(cIdx, rIdx) {
            this.activeTile = { cIdx, rIdx, value: (rIdx + 1) * 100, catName: this.gameData.categories[cIdx].name, data: this.gameData.categories[cIdx].questions[rIdx] };
            this.showAnswer = false;
        },
        assignPoints(teamIdx) { this.gameData.teams[teamIdx].score += this.getCalculatedValue(); this.closeTile(true); },
        closeTile(done) { if(done) this.activeTile.data.done = true; this.activeTile = null; },
        addTeam() { this.gameData.teams.push({ name: "TEAM " + (this.gameData.teams.length + 1), score: 0 }); },
        removeTeam(idx) { if(confirm("Löschen?")) this.gameData.teams.splice(idx, 1); },
        resetGame() { if(confirm("Reset?")) { this.gameData.teams.forEach(t => t.score = 0); this.gameData.categories.forEach(c => c.questions.forEach(q => q.done = false)); } },
        triggerUpload() { document.getElementById('fileInput').click(); },
        // Hilfsfunktion für Upload & Drag-and-Drop
        processFile(file) {
            const reader = new FileReader();
            reader.onload = (event) => { 
                try {
                    const importedData = JSON.parse(event.target.result);
                    // Validierung: Hat das JSON die richtige Struktur?
                    if (!importedData.categories) throw new Error("Kein Jeopardy Format");
                    
                    this.gameData = importedData; 
                    this.gameData.categories.forEach(c => c.questions.forEach(q => { 
                        if(!q.mode) q.mode = 'normal'; 
                    }));
                } catch (e) {
                    alert("Fehler: Das ist keine gültige Jeopardy-Datei!");
                }
            };
            reader.readAsText(file);
        },
        loadJSON(e) {
            if (e.target.files[0]) this.processFile(e.target.files[0]);
        },
        downloadJSON() {
            const dataStr = JSON.stringify(this.gameData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            // Hier setzen wir die neue Endung .jpdy
            const fileName = this.gameData.title.replace(/[^a-z0-0]/gi, '_').toLowerCase();
            a.download = `${fileName}.jpdy`; 
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    },
}).mount('#app')