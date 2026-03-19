Hier ist die aktualisierte README.md. Ich habe die neuen Funktionen so integriert, dass sie sowohl den technischen Fortschritt als auch die verbesserte Benutzerfreundlichkeit hervorheben.

-----

# 📺 MyJeopardy - A Custom Jeopardy Board Creator

[English Version](https://www.google.com/search?q=%23english) | [Deutsche Version](https://www.google.com/search?q=%23deutsch)

-----

\<a name="english"\>\</a\>

## 🇬🇧 English

**MyJeopardy** is a modern, web-based quiz application inspired by the classic TV show. It allows you to create, edit, and play your own Jeopardy boards directly in your browser with full multimedia support.

### ✨ Key Features

  * **Fully Customizable:** Create your own categories and questions directly in the browser.
  * **Multimedia Integration:** Use simple commands to embed media:
      * `/image(url)` – Display images or GIFs.
      * `/video(url)` – Embed YouTube videos or MP4 files.
      * `/audio(url)` – Play sound effects or music snippets.
  * **Special Game Modes & Visual Cues:** \* **Double (x2)** & **Triple (x3)** points for high stakes.
      * **Visual Borders:** Question modals now feature a **Silver (Double)** or **Golden-Pulse (Triple)** border to indicate the point multiplier immediately.
      * **Joker Fields:** Surprise bonus points without a question\!
  * **Easy Sharing & Import:**
      * **Link Sharing:** Generate a compressed URL to share your entire game state with others—no database required\!
      * **Smart Import:** Simply **drag and drop** your saved game files anywhere on the screen to load them instantly.
  * **Interactive Scoreboard:** Fixed "Podiums" for teams with real-time score tracking.
  * **Dynamic Theming:** Change the primary and secondary colors live to match your event's branding.
  * **Winner's Podium:** An automatic end-screen with a 3D-style trophy ceremony.

### ⚠️ Save Your Progress\!

  * **Standard Save:** The app uses LocalStorage to keep your current session alive.
  * **Permanent Export:** Use the **Export** button to save your game as a `.jpdy` file. This custom format keeps your boards organized.
  * **Cloud Link:** Use the **Copy Link** button to create a shareable URL that contains all your game data.

### 🚀 Live Demo

👉 **[games.luda-vision.de/MyJeopardy](https://www.google.com/search?q=https://games.luda-vision.de/MyJeopardy)**

-----

\<a name="deutsch"\>\</a\>

## 🇩🇪 Deutsch

**MyJeopardy** ist eine moderne, webbasierte Quiz-Applikation, inspiriert durch die klassische TV-Show. Erstelle, editiere und spiele deine eigenen Jeopardy-Boards direkt im Browser mit voller Multimedia-Unterstützung.

### ✨ Hauptmerkmale

  * **Vollständig anpassbar:** Erstelle eigene Kategorien und Fragen direkt im Browser-Editor.
  * **Multimedia-Unterstützung:** Nutze einfache Befehle für Medieninhalte (`/image`, `/video`, `/audio`).
  * **Spezial-Modi & Visuelle Effekte:** \* **Double (x2)** & **Triple (x3)** für riskante Runden.
      * **Dynamische Rahmen:** Fragen-Fenster zeigen durch einen **silbernen (Double)** oder **pulsierenden goldenen (Triple)** Rand sofort den Punktemultiplikator an.
      * **Joker-Felder:** Überraschende Bonuspunkte ohne Frage\!
  * **Sharing & Komfort-Import:**
      * **Link-Sharing:** Erzeuge einen komprimierten Link, der den gesamten Spielstand enthält – ideal zum schnellen Teilen ohne Account oder Datenbank.
      * **Datei-Handling:** Exportiere Spiele als eigene **.jpdy** Dateien.
      * **Drag-and-Drop:** Ziehe eine Spieldatei einfach irgendwo in das Browserfenster, um sie sofort zu laden.
  * **Interaktives Scoreboard:** Echtzeit-Punktestand auf digitalen Podesten.
  * **Live-Theming:** Ändere Board- und Akzentfarben passend zu deinem Event.

### ⚠️ Fortschritt Speichern\!

  * **LocalStorage:** Dein Spielstand wird automatisch lokal im Browser zwischengespeichert.
  * **Export:** Nutze den **Export**-Button, um dein Spiel als `.jpdy` Datei dauerhaft zu sichern.
  * **Teilen:** Über den **Link kopieren**-Button erstellst du eine URL, die das komplette Spiel inklusive aller Fragen und Einstellungen beinhaltet.

### 🚀 Live Demo

👉 **[games.luda-vision.de/MyJeopardy](https://www.google.com/search?q=https://games.luda-vision.de/MyJeopardy)**

-----

### 🛠 Tech Stack

  * **Vue.js 3** (Reactivity & Logic)
  * **Tailwind CSS** (Styling)
  * **LZ-String** (High-performance URL compression)

-----