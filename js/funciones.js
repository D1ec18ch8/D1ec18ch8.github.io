        // Música de fondo
        const music = document.getElementById("music");
        const volumeSlider = document.getElementById("volume-slider");

        // Control de volumen
        volumeSlider.addEventListener("input", () => {
            music.volume = volumeSlider.value;
        });

        // Silenciar/desilenciar música
        function toggleMute() {
            music.muted = !music.muted;
            volumeSlider.disabled = music.muted;
        }

        // Reproducir música después de la interacción del usuario
        document.addEventListener("click", () => {
            if (music.paused) {
                music.play();
            }
        }, { once: true }); // Solo se ejecuta una vez

        // Sonido de tecleo
        const typingSound = document.getElementById("typing-sound");

        // Map para controlar intervalos activos por elemento y evitar solapamientos
        const activeTypingIntervals = new Map();

        // Detener el efecto de tecleo en un elemento (si existe)
        function stopTyping(element) {
            if (!element) return;
            const id = activeTypingIntervals.get(element);
            if (id) {
                clearInterval(id);
                activeTypingIntervals.delete(element);
            }
            try {
                typingSound.pause();
                typingSound.currentTime = 0;
            } catch (e) {}
        }

        // Efecto de texto que se escribe
        function typeText(element, text, speed = 30) {
            if (!element) return;
            text = text || "";

            // Si ya había un efecto activo para este elemento, lo detenemos primero
            stopTyping(element);

            element.textContent = "";
            if (text.length === 0) return;

            // Reproducir sonido de tecleo (intenta, pero no interrumpirá si falla)
            try {
                const playPromise = typingSound.play();
                if (playPromise && playPromise.catch) playPromise.catch(() => {});
            } catch (e) {}

            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    activeTypingIntervals.delete(element);
                    try {
                        typingSound.pause();
                        typingSound.currentTime = 0;
                    } catch (e) {}
                }
            }, speed);

            activeTypingIntervals.set(element, typingInterval);
        }

        // Funciones para abrir y cerrar modales
        function openModal(type) {
                    const modal = document.getElementById(`${type}Modal`);
                    modal.style.display = "flex";

                    // Si abrimos el modal de proyectos, renderizamos la lista dinámicamente
                    if (type === "projects") {
                        renderProjects();
                    }
        }

        function closeModal() {
            document.querySelectorAll(".modal").forEach(modal => {
                modal.style.display = "none";
            });
            // limpiar proyectos renderizados y detener efectos de tipeo
            const projectsList = document.getElementById("projectsList");
            if (projectsList) projectsList.innerHTML = "";
            const projectsText = document.getElementById("projectsText");
            stopTyping(projectsText);
        }

        // Funciones para abrir y cerrar el modal de descripciones de lenguajes
        function openLanguageModal(language) {
            const modal = document.getElementById("languageModal");
            const title = document.getElementById("languageTitle");
            const description = document.getElementById("languageDescription");

            const descriptions = {
                "JavaScript": "JavaScript es un lenguaje de programación interpretado, orientado a objetos y centrado en la web. Se usa para crear páginas dinámicas e interactivas, y también en desarrollo backend, apps móviles y videojuegos.",
                "Python": "Python es un lenguaje de programación interpretado, de alto nivel y multipropósito. Es conocido por su sintaxis simple y legible, ideal para desarrollo web, ciencia de datos e inteligencia artificial.",
                "SQL": "SQL (Structured Query Language) es un lenguaje utilizado para gestionar y manipular bases de datos relacionales. Permite realizar consultas, inserciones, actualizaciones y eliminaciones de datos.",
                "HTML": "HTML (HyperText Markup Language) es el lenguaje estándar para crear páginas web. Define la estructura y el contenido de una página mediante etiquetas.",
                "C#": "C# es un lenguaje de programación orientado a objetos desarrollado por Microsoft. Se utiliza principalmente para desarrollar aplicaciones de escritorio, juegos (Unity) y aplicaciones web con .NET.",
                "PHP": "PHP es un lenguaje de scripting del lado del servidor diseñado para el desarrollo web. Se integra bien con HTML y se usa para crear aplicaciones dinámicas y gestionar formularios y bases de datos."
            };

            title.textContent = language;
            modal.style.display = "flex";
            typeText(description, descriptions[language]);
        }

        function closeLanguageModal() {
            const modal = document.getElementById("languageModal");
            const description = document.getElementById("languageDescription");
            const title = document.getElementById("languageTitle");
            stopTyping(description);
            title.textContent = "";
            description.textContent = "";
            modal.style.display = "none";
        }

        // Cerrar el modal si se hace clic fuera del contenido
        window.onclick = function(event) {
            if (event.target.classList.contains("modal")) {
                closeModal();
                // Asegurarse de detener cualquier tipeo activo al cerrar clic fuera
                const projectsText = document.getElementById("projectsText");
                const languageDescription = document.getElementById("languageDescription");
                stopTyping(projectsText);
                stopTyping(languageDescription);
            }
        };

        // Lista de proyectos para renderizar dinámicamente
        const projects = [
            {
                title: "Biblioteca Pública de Puntarenas",
                description: "Proyecto realizado para la Biblioteca Pública de Puntarenas. Sitio implementado y desplegado en Netlify.",
                url: "https://bibliotecapublica-puntarenas.netlify.app/",
                thumbnail: null
            }
            // Puedes añadir más objetos aquí con las propiedades: title, description, url, thumbnail
        ];

        // Renderiza la lista de proyectos dentro del modal
        function renderProjects() {
            const container = document.getElementById("projectsList");
            if (!container) return;
            // Limpiar contenido previo
            container.innerHTML = "";

            projects.forEach(proj => {
                const item = document.createElement("div");
                item.className = "project-item";

                if (proj.thumbnail) {
                    const img = document.createElement("img");
                    img.src = proj.thumbnail;
                    img.alt = proj.title;
                    img.className = "project-thumb";
                    item.appendChild(img);
                }

                const h3 = document.createElement("h3");
                h3.textContent = proj.title;
                item.appendChild(h3);

                const p = document.createElement("p");
                p.textContent = proj.description;
                item.appendChild(p);

                if (proj.url) {
                    const a = document.createElement("a");
                    a.href = proj.url;
                    a.target = "_blank";
                    a.className = "btn";
                    a.textContent = "Ver proyecto";
                    item.appendChild(a);
                }

                container.appendChild(item);
            });
        }