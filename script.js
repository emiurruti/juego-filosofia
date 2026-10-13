
"use strict";

/* EL PALACIO DEL PODER
   Motor del videojuego - Parte 1
   Configuración, personajes y contenidos.
*/

(() => {

const $ = id => document.getElementById(id);

const canvas = $("game-canvas");
const ctx = canvas.getContext("2d");

const W = 1280;
const H = 720;
const FLOOR = 625;
const WORLD = 2900;

const keys = new Set();

const S = {
    screen: "pantalla-inicio",
    level: 1,
    unlocked: 1,
    completed: new Set(),
    done: new Set(),
    score: 0,
    levelStartScore: 0,
    paused: false,
    modal: null,
    near: null,
    camera: 0,
    last: 0,
    toastUntil: 0,
    audio: false,
    audioCtx: null,
    stamina: 100,
    currentObject: null
};

const P = {
    x: 90,
    y: FLOOR - 66,
    w: 36,
    h: 66,
    vx: 0,
    vy: 0,
    ground: true,
    face: 1,
    walk: 0
};

/* CONTENIDOS DE LAS CUATRO SALAS */

const LEVELS = {

    1: {
        name: "La mirada que vigila",
        author: "Michel Foucault",
        theme: "#8fb7d4",
        sky: "#111f31",
        accent: "#d7b97d",

        intro: "En esta sala, el poder regula comportamientos a través de la vigilancia, las reglas y la disciplina.",

        objectives: [
            "Descubrir cómo funciona la vigilancia",
            "Interpretar una regla disciplinaria",
            "Cuestionar la normalización"
        ],

        objects: [
            {
                id: "camara",
                x: 570,
                name: "Torre de vigilancia",
                symbol: "◉",
                kind: "tower",
                title: "Una mirada que cambia conductas",

                story: "Al entrar en la zona iluminada, las personas dejan de conversar y vuelven a sus puestos. Nadie les ha dado una orden en ese momento. ¿Qué muestra la escena?",

                options: [
                    "La posibilidad de ser observado puede modificar la conducta.",
                    "El poder existe únicamente cuando se utiliza la fuerza.",
                    "La cámara no influye en lo que hacen las personas."
                ],

                why: "Foucault permite pensar la vigilancia como un mecanismo que orienta conductas, incluso sin un castigo inmediato.",

                concept: "Vigilancia",

                hint: "Observá qué hacen las personas antes y después de sentirse observadas."
            },

            {
                id: "norma",
                x: 1350,
                name: "Archivo de horarios",
                symbol: "▤",
                kind: "desk",
                title: "El recorrido obligatorio",

                story: "El palacio señala cuándo caminar, cuándo esperar y por qué pasillo circular. Las reglas hacen que casi todos repitan las mismas rutinas.",

                options: [
                    "La disciplina organiza tiempos, espacios y cuerpos.",
                    "Las reglas no afectan los comportamientos.",
                    "La disciplina solo existe cuando hay violencia física."
                ],

                why: "La disciplina también funciona organizando las prácticas cotidianas y los espacios.",

                concept: "Disciplina",

                hint: "Pensá en horarios, filas, puestos asignados y recorridos."
            },

            {
                id: "puerta",
                x: 2330,
                name: "Puerta de la conducta correcta",
                symbol: "▥",
                kind: "gate",
                title: "¿Quién define lo normal?",

                story: "La puerta reconoce como correcta una única forma de comportarse. Quienes no la siguen quedan señalados como diferentes.",

                options: [
                    "La normalización establece modelos de conducta y clasifica desviaciones.",
                    "Toda conducta es naturalmente igual y no existen normas sociales.",
                    "Normalizar solo significa cerrar puertas."
                ],

                why: "Normalizar implica producir y reforzar criterios sobre lo que se considera adecuado o esperado.",

                concept: "Normalización",

                hint: "La clave está en quién establece el modelo de conducta esperada."
            }
        ]
    },

    2: {
        name: "El laberinto de las normas",
        author: "Paul B. Preciado",
        theme: "#d2a5df",
        sky: "#24172e",
        accent: "#d3a3dd",

        intro: "En esta sala, las normas no solo indican qué hacer: también asignan categorías y afectan el reconocimiento de las personas.",

        objectives: [
            "Investigar el espejo de las categorías",
            "Descubrir los efectos de las etiquetas",
            "Abrir una ruta alternativa"
        ],

        objects: [
            {
                id: "espejo",
                x: 570,
                name: "Espejo clasificador",
                symbol: "◇",
                kind: "mirror",
                title: "El espejo no es neutral",

                story: "El espejo coloca etiquetas a quienes se acercan. La etiqueta determina qué caminos se habilitan, aunque la persona no haya cambiado.",

                options: [
                    "Las categorías pueden producir efectos concretos sobre la vida y el reconocimiento.",
                    "Las clasificaciones nunca afectan a las personas.",
                    "Toda etiqueta es una descripción neutral e indiscutible."
                ],

                why: "Preciado permite problematizar cómo las normas y categorías participan en la producción social de identidades.",

                concept: "Norma",

                hint: "¿La etiqueta solo describe o también modifica las posibilidades de la persona?"
            },

            {
                id: "etiquetas",
                x: 1350,
                name: "Archivo de identidades",
                symbol: "≠",
                kind: "desk",
                title: "El nombre que abre o cierra caminos",

                story: "Dos personas hacen lo mismo, pero el sistema las clasifica de forma distinta y les ofrece oportunidades diferentes.",

                options: [
                    "Clasificar a las personas puede producir diferencias de reconocimiento y acceso.",
                    "Las categorías no intervienen nunca en las relaciones sociales.",
                    "La identidad está completamente fuera de las relaciones de poder."
                ],

                why: "La clasificación puede delimitar qué identidades son reconocidas y cuáles quedan cuestionadas o excluidas.",

                concept: "Identidad",

                hint: "Compará las acciones iguales con los resultados diferentes."
            },

            {
                id: "fuga",
                x: 2330,
                name: "Puerta de las posibilidades",
                symbol: "↗",
                kind: "gate",
                title: "Una salida que no estaba prevista",

                story: "Una persona cuestiona la regla del laberinto y propone otra forma de circular. El sistema afirmaba que solo existía un camino.",

                options: [
                    "Las normas pueden ser cuestionadas y transformadas mediante prácticas de resistencia.",
                    "Resistir exige necesariamente destruir físicamente el palacio.",
                    "No es posible discutir ninguna norma."
                ],

                why: "La resistencia abre la posibilidad de interrogar las categorías y los límites que parecían naturales.",

                concept: "Resistencia",

                hint: "Resistir no siempre significa combatir: también puede ser abrir posibilidades."
            }
        ]
    },

    3: {
        name: "El desafío del rendimiento",
        author: "Byung-Chul Han",
        theme: "#83d4c4",
        sky: "#11282b",
        accent: "#83d4c4",

        intro: "En esta sala nadie te persigue. Sin embargo, los carteles te invitan a producir más, mejorar siempre y no detenerte.",

        objectives: [
            "Reconocer la autoexigencia",
            "Examinar las metas interminables",
            "Descubrir el valor de detenerse"
        ],

        objects: [
            {
                id: "marcador",
                x: 570,
                name: "Marcador de rendimiento",
                symbol: "↑",
                kind: "screen",
                title: "Una meta que nadie impuso",

                story: "Una pantalla dice: ¡Superate! Hacé más en menos tiempo. Nadie te obliga a aceptarla, pero el personaje siente que debe cumplirla.",

                options: [
                    "La exigencia puede interiorizarse y sentirse como una decisión propia.",
                    "Sin una orden externa no existe ninguna presión.",
                    "Toda meta personal es necesariamente una forma de libertad."
                ],

                why: "Han analiza la autoexigencia del sujeto de rendimiento, que puede experimentar la presión como iniciativa propia.",

                concept: "Autoexigencia",

                hint: "¿De dónde parece venir la orden cuando nadie la pronuncia?"
            },

            {
                id: "contador",
                x: 1350,
                name: "Máquina de metas",
                symbol: "＋",
                kind: "screen",
                title: "Cuando alcanzar no alcanza",

                story: "Al cumplir una meta, aparece otra mayor. El contador celebra cada logro, pero nunca permite sentir que es suficiente.",

                options: [
                    "La lógica del rendimiento puede exigir una superación sin fin.",
                    "Cada meta cumplida elimina necesariamente la presión.",
                    "El cansancio solo demuestra falta de esfuerzo."
                ],

                why: "El ideal de rendimiento permanente puede llevar a que el sujeto se mida y exija continuamente.",

                concept: "Rendimiento",

                hint: "Observá qué pasa con la exigencia después de completar cada objetivo."
            },

            {
                id: "descanso",
                x: 2330,
                name: "Banco de la pausa",
                symbol: "Ⅱ",
                kind: "bench",
                title: "La decisión más difícil",

                story: "La salida no exige sumar otra meta. Para abrirla, el personaje debe detenerse y cuestionar por qué siente culpa al descansar.",

                options: [
                    "Reconocer la autoexplotación permite cuestionar la obligación de rendir siempre.",
                    "Descansar significa fracasar en toda circunstancia.",
                    "La libertad consiste exclusivamente en producir más."
                ],

                why: "Han invita a problematizar la autoexplotación: el sujeto puede ser al mismo tiempo quien exige y quien padece la exigencia.",

                concept: "Autoexplotación",

                hint: "Pensá si el personaje está trabajando para una orden visible o para una presión que incorporó."
            }
        ]
    },

    4: {
        name: "El corazón del palacio",
        author: "Síntesis filosófica",
        theme: "#e6c783",
        sky: "#211d29",
        accent: "#e6c783",

        intro: "Las tres salas se conectan. Ahora tendrás que interpretar situaciones que relacionan distintas formas de poder.",

        objectives: [
            "Relacionar poder y comportamiento",
            "Relacionar poder e identidad",
            "Relacionar poder y autoexigencia"
        ],

        objects: [
            {
                id: "sintesis1",
                x: 570,
                name: "La primera memoria",
                symbol: "Ⅰ",
                kind: "altar",
                title: "Lo que hacemos",

                story: "En una institución, las cámaras, los horarios y las rutinas llevan a las personas a ajustar su comportamiento.",

                options: [
                    "Foucault: vigilancia y disciplina organizan conductas.",
                    "Han: las identidades se producen por etiquetas.",
                    "Preciado: el problema central es cumplir metas de productividad."
                ],

                why: "Foucault ayuda a comprender la regulación de cuerpos y conductas en relaciones de poder.",

                concept: "Lo que hacemos",

                hint: "Recordá la sala de vigilancia y las rutinas."
            },

            {
                id: "sintesis2",
                x: 1350,
                name: "La segunda memoria",
                symbol: "Ⅱ",
                kind: "altar",
                title: "Lo que somos",

                story: "Un sistema asigna nombres y categorías, y de acuerdo con ellas decide quién puede ingresar a determinados espacios.",

                options: [
                    "Preciado: las normas participan en la producción y clasificación de identidades.",
                    "Foucault: la productividad es la única forma de poder.",
                    "Han: las categorías sociales son siempre neutrales."
                ],

                why: "Preciado invita a cuestionar las categorías que definen qué identidades se reconocen como normales.",

                concept: "Lo que somos",

                hint: "Recordá el espejo y las etiquetas del laberinto."
            },

            {
                id: "sintesis3",
                x: 2330,
                name: "La tercera memoria",
                symbol: "Ⅲ",
                kind: "altar",
                title: "Lo que nos exigimos",

                story: "Una persona no recibe órdenes de un jefe, pero se impone metas sin descanso y se siente culpable al detenerse.",

                options: [
                    "Han: la autoexigencia puede convertir al sujeto en agente de su propia explotación.",
                    "Preciado: toda autoexigencia se explica únicamente por una etiqueta.",
                    "Foucault: si no hay una cámara, no puede haber poder."
                ],

                why: "Han analiza el paso hacia la presión interiorizada y el sujeto de rendimiento.",

                concept: "Lo que nos exigimos",

                hint: "Recordá el medidor de metas y el banco de la pausa."
            }
        ]
    }
};

const scene = {
    platforms: [],
    obstacles: [],
    npcs: [],
    particles: []
};

// CONTINÚA EN LA PARTE 2.
// NO CIERRES TODAVÍA LA FUNCIÓN PRINCIPAL.

/* ==========================================================
   EL PALACIO DEL PODER
   SCRIPT.JS — PARTE 2 DE 3
   Motor de plataformas, escenarios y controles.
   ========================================================== */


/* ==========================================================
   1. FUNCIONES GENERALES
   ========================================================== */

const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

const distance = (a, b) => Math.abs(a - b);

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    const target = $(id);

    if (!target) return;

    target.classList.remove("hidden");

    S.screen = id;

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}

function announce(message) {

    const region = $("anuncio-accesible");

    if (region) {
        region.textContent = message;
    }
}

function toast(message, seconds = 3) {

    const element = $("game-toast");

    if (!element) return;

    element.textContent = message;
    element.classList.remove("hidden");

    S.toastUntil = performance.now() + seconds * 1000;

    announce(message);
}

function hideToast() {

    $("game-toast")?.classList.add("hidden");

}

function playTone(frequency = 440, duration = 0.12) {

    if (!S.audio) return;

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!S.audioCtx) {
            S.audioCtx = new AudioContextClass();
        }

        const audio = S.audioCtx;

        if (audio.state === "suspended") {
            audio.resume().catch(() => {});
        }

        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.035, audio.currentTime);

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();
        oscillator.stop(audio.currentTime + duration);

    } catch (error) {

        console.warn("Audio no disponible:", error);

    }
}


/* ==========================================================
   2. CREACIÓN DE ESCENARIOS
   ========================================================== */

function buildScene() {

    scene.platforms = [
        { x: 0, y: FLOOR, w: WORLD, h: 95 },

        { x: 360, y: 515, w: 205, h: 23 },
        { x: 735, y: 465, w: 200, h: 23 },
        { x: 1070, y: 520, w: 215, h: 23 },
        { x: 1530, y: 480, w: 220, h: 23 },
        { x: 1900, y: 515, w: 220, h: 23 },
        { x: 2520, y: 485, w: 195, h: 23 }
    ];

    scene.obstacles = [
        { x: 880, y: FLOOR - 36, w: 42, h: 36 },
        { x: 1690, y: FLOOR - 42, w: 48, h: 42 },
        { x: 2160, y: FLOOR - 34, w: 40, h: 34 }
    ];

    scene.npcs = [
        {
            x: 270,
            name: "Guardián",
            text: "Observá las reglas de esta sala. No todo el poder se manifiesta como una orden."
        },
        {
            x: 1120,
            name: "Habitante",
            text: "A veces seguimos las normas sin preguntarnos de dónde vienen."
        },
        {
            x: 2020,
            name: "Viajera",
            text: "Detenerse, observar y preguntar también puede abrir nuevos caminos."
        }
    ];

    scene.particles = [];

    for (let i = 0; i < 42; i++) {

        scene.particles.push({
            x: (i * 193 + 71) % WORLD,
            y: 80 + (i * 79) % 450,
            r: 1 + (i % 3) * 0.5,
            phase: i * 0.9
        });

    }
}

function resetPlayer() {

    P.x = 90;
    P.y = FLOOR - P.h;

    P.vx = 0;
    P.vy = 0;

    P.ground = true;
    P.face = 1;
    P.walk = 0;

    S.camera = 0;
    S.near = null;
    S.stamina = 100;

    keys.clear();

}

function loadLevel(number) {

    const level = LEVELS[number];

    if (!level || number > S.unlocked) return;

    S.level = number;

    S.done = new Set();

    S.levelStartScore = S.score;

    S.paused = false;
    S.modal = null;

    resetPlayer();
    buildScene();

    $("numero-sala-actual").textContent =
        number === 4 ? "DESAFÍO FINAL" : `SALA ${["", "I", "II", "III"][number]}`;

    $("titulo-sala-actual").textContent = level.name;

    $("titulo-mision").textContent = level.name;

    $("descripcion-mision").textContent = level.intro;

    updateHUD();

    showScreen("pantalla-juego");

    canvas.focus({ preventScroll: true });

    toast(level.intro, 5);

    playTone(420, 0.2);
}


/* ==========================================================
   3. OBJETIVOS Y PROGRESO
   ========================================================== */

function updateHUD() {

    const level = LEVELS[S.level];

    const total = level.objects.length;
    const done = level.objects.filter(
        obj => S.done.has(obj.id)
    ).length;

    const percent = Math.round(done / total * 100);

    $("barra-progreso").value = percent;
    $("porcentaje-progreso").textContent = percent + "%";

    $("puntuacion").textContent = S.score;

    $("descubrimientos").textContent =
        S.completed.size + S.done.size;

    const objectives = $("lista-objetivos");

    objectives.replaceChildren();

    level.objectives.forEach((objective, index) => {

        const li = document.createElement("li");

        li.textContent = objective;

        if (S.done.has(level.objects[index].id)) {
            li.classList.add("completed");
            li.textContent = "✓ " + objective;
        }

        objectives.appendChild(li);

    });

    const concepts = $("lista-conceptos");

    concepts.replaceChildren();

    level.objects.forEach(obj => {

        if (!S.done.has(obj.id)) return;

        const li = document.createElement("li");

        li.textContent = obj.concept;

        concepts.appendChild(li);

    });

}


/* ==========================================================
   4. MOVIMIENTO DEL PERSONAJE
   ========================================================== */

const PHYSICS = {
    gravity: 1700,
    speed: 305,
    jump: -690,
    maxFall: 900
};

function isDown(...names) {
    return names.some(name => keys.has(name));
}

function jump() {

    if (S.screen !== "pantalla-juego") return;
    if (S.paused || S.modal) return;
    if (!P.ground) return;

    P.vy = PHYSICS.jump;
    P.ground = false;

    playTone(320, 0.09);

}

function movePlayer(dt) {

    let direction = 0;

    if (isDown("ArrowLeft", "KeyA")) {
        direction -= 1;
    }

    if (isDown("ArrowRight", "KeyD")) {
        direction += 1;
    }

    let speed = PHYSICS.speed;

    // En la sala de Han, correr continuamente
    // consume energía y obliga a administrar el ritmo.

    if (S.level === 3) {

        if (direction !== 0) {

            S.stamina = clamp(
                S.stamina - 8 * dt,
                0,
                100
            );

        } else {

            S.stamina = clamp(
                S.stamina + 15 * dt,
                0,
                100
            );

        }

        if (S.stamina < 18) {
            speed *= 0.55;
        }

    }

    P.vx = direction * speed;

    if (direction !== 0) {

        P.face = direction;
        P.walk += dt * 12;

    }

    P.x = clamp(
        P.x + P.vx * dt,
        0,
        WORLD - P.w
    );

    const oldBottom = P.y + P.h;

    P.vy = Math.min(
        P.vy + PHYSICS.gravity * dt,
        PHYSICS.maxFall
    );

    P.y += P.vy * dt;

    P.ground = false;

    // Colisión vertical con plataformas.

    for (const platform of scene.platforms) {

        const overlapsX =
            P.x + P.w > platform.x &&
            P.x < platform.x + platform.w;

        const crossesTop =
            oldBottom <= platform.y + 10 &&
            P.y + P.h >= platform.y;

        if (
            overlapsX &&
            crossesTop &&
            P.vy >= 0
        ) {

            P.y = platform.y - P.h;
            P.vy = 0;
            P.ground = true;

        }

    }

    // Obstáculos sólidos.

    for (const obstacle of scene.obstacles) {

        const overlapX =
            P.x < obstacle.x + obstacle.w &&
            P.x + P.w > obstacle.x;

        const overlapY =
            P.y < obstacle.y + obstacle.h &&
            P.y + P.h > obstacle.y;

        if (!overlapX || !overlapY) continue;

        if (
            oldBottom <= obstacle.y + 10 &&
            P.vy >= 0
        ) {

            P.y = obstacle.y - P.h;
            P.vy = 0;
            P.ground = true;

        } else if (direction > 0) {

            P.x = obstacle.x - P.w;

        } else if (direction < 0) {

            P.x = obstacle.x + obstacle.w;

        }

    }

    if (P.y > H + 150) {

        P.x = Math.max(90, P.x - 220);
        P.y = FLOOR - P.h;
        P.vy = 0;

        toast("Volviste a un lugar seguro.");

    }

}


/* ==========================================================
   5. CÁMARA Y OBJETOS CERCANOS
   ========================================================== */

function updateCamera(dt) {

    const target = clamp(
        P.x + P.w / 2 - W * 0.43,
        0,
        WORLD - W
    );

    S.camera += (
        target - S.camera
    ) * Math.min(1, dt * 6);

}

function updateNearby() {

    const level = LEVELS[S.level];

    const candidates = [];

    level.objects.forEach(obj => {

        if (S.done.has(obj.id)) return;

        const d = distance(
            P.x + P.w / 2,
            obj.x
        );

        if (d < 115) {

            candidates.push({
                type: "challenge",
                distance: d,
                data: obj
            });

        }

    });

    scene.npcs.forEach(npc => {

        const d = distance(
            P.x + P.w / 2,
            npc.x
        );

        if (d < 100) {

            candidates.push({
                type: "npc",
                distance: d,
                data: npc
            });

        }

    });

    candidates.sort((a, b) => a.distance - b.distance);

    S.near = candidates[0] || null;

    const prompt = $("interaction-prompt");

    if (S.near && !S.modal && !S.paused) {

        $("interaction-text").textContent =
            S.near.type === "npc"
                ? "Hablar con " + S.near.data.name
                : "Examinar: " + S.near.data.name;

        prompt.classList.remove("hidden");

    } else {

        prompt.classList.add("hidden");

    }

}


/* ==========================================================
   6. DIBUJO DEL ESCENARIO
   ========================================================== */

function drawBackground(time) {

    const level = LEVELS[S.level];

    const gradient = ctx.createLinearGradient(
        0, 0, 0, H
    );

    gradient.addColorStop(0, level.sky);
    gradient.addColorStop(1, "#080c15");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Resplandor del palacio.

    const glow = ctx.createRadialGradient(
        W * 0.5, 240, 20,
        W * 0.5, 240, 540
    );

    glow.addColorStop(0, level.theme + "22");
    glow.addColorStop(1, "#00000000");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Arquitectura de fondo con paralaje.

    const offset = (S.camera * 0.23) % 250;

    for (let i = -1; i < 8; i++) {

        const x = i * 250 - offset;

        ctx.fillStyle = "#172133";
        ctx.fillRect(x + 30, 145, 42, 480);
        ctx.fillRect(x + 165, 145, 42, 480);

        ctx.fillStyle = "#29354a";
        ctx.fillRect(x + 20, 138, 197, 23);
        ctx.fillRect(x + 23, 590, 190, 35);

        ctx.fillStyle = "#0a111d";
        ctx.beginPath();
        ctx.roundRect(
            x + 85, 235,
            65, 320,
            [34, 34, 0, 0]
        );
        ctx.fill();

        ctx.strokeStyle = level.theme + "35";
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 85, 280, 65, 240);

    }

    // Partículas ambientales.

    for (const particle of scene.particles) {

        const x = particle.x - S.camera * 0.15;

        if (x < -10 || x > W + 10) continue;

        const opacity =
            0.15 + 0.2 *
            (1 + Math.sin(time * 0.001 + particle.phase)) / 2;

        ctx.fillStyle = `rgba(235,215,165,${opacity})`;

        ctx.beginPath();
        ctx.arc(
            x,
            particle.y + Math.sin(time * 0.001 + particle.phase) * 5,
            particle.r,
            0,
            Math.PI * 2
        );
        ctx.fill();

    }

}

function drawArchitecture() {

    const level = LEVELS[S.level];

    ctx.save();
    ctx.translate(-S.camera, 0);

    // Suelo monumental.

    ctx.fillStyle = "#252d39";
    ctx.fillRect(0, FLOOR, WORLD, H - FLOOR);

    ctx.fillStyle = level.accent;
    ctx.fillRect(0, FLOOR, WORLD, 5);

    for (let x = 0; x < WORLD; x += 90) {

        ctx.strokeStyle = "#445065";
        ctx.lineWidth = 1;

        ctx.strokeRect(
            x,
            FLOOR + 15,
            90,
            80
        );

    }

    // Plataformas elevadas.

    scene.platforms.slice(1).forEach(platform => {

        ctx.fillStyle = "#344054";

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.w,
            platform.h
        );

        ctx.fillStyle = level.accent;

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.w,
            5
        );

        ctx.fillStyle = "#202937";

        ctx.fillRect(
            platform.x + 10,
            platform.y + platform.h,
            platform.w - 20,
            12
        );

    });

    // Obstáculos.

    scene.obstacles.forEach(obstacle => {

        ctx.fillStyle = "#4a5364";

        ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.w,
            obstacle.h
        );

        ctx.strokeStyle = level.accent;
        ctx.lineWidth = 2;

        ctx.strokeRect(
            obstacle.x + 3,
            obstacle.y + 3,
            obstacle.w - 6,
            obstacle.h - 6
        );

        ctx.beginPath();

        ctx.moveTo(
            obstacle.x + 5,
            obstacle.y + 5
        );

        ctx.lineTo(
            obstacle.x + obstacle.w - 5,
            obstacle.y + obstacle.h - 5
        );

        ctx.stroke();

    });

    ctx.restore();

}

function drawInteractiveObjects(time) {

    const level = LEVELS[S.level];

    ctx.save();
    ctx.translate(-S.camera, 0);

    level.objects.forEach(obj => {

        const completed = S.done.has(obj.id);

        const pulse =
            Math.sin(time * 0.003 + obj.x) * 5;

        const baseY = FLOOR - 12;

        // Pedestal.

        ctx.fillStyle = "#394458";

        ctx.fillRect(
            obj.x - 42,
            baseY - 18,
            84,
            18
        );

        ctx.fillStyle = "#1d2635";

        ctx.fillRect(
            obj.x - 31,
            baseY - 90,
            62,
            72
        );

        ctx.strokeStyle =
            completed ? "#80cba1" : level.accent;

        ctx.lineWidth = 3;

        ctx.strokeRect(
            obj.x - 31,
            baseY - 90,
            62,
            72
        );

        // Símbolo del mecanismo.

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 38px Georgia";

        ctx.fillStyle =
            completed ? "#80cba1" : level.theme;

        ctx.fillText(
            completed ? "✓" : obj.symbol,
            obj.x,
            baseY - 55 + (completed ? 0 : pulse)
        );

        // Nombre.

        ctx.font = "bold 15px Segoe UI, Arial";

        ctx.fillStyle = "#f3eee3";

        ctx.fillText(
            obj.name,
            obj.x,
            baseY - 111
        );

        if (!completed) {

            ctx.strokeStyle = level.theme + "77";

            ctx.beginPath();

            ctx.arc(
                obj.x,
                baseY - 55,
                46 + pulse,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        }

    });

    ctx.restore();

}

function drawNPCs(time) {

    ctx.save();
    ctx.translate(-S.camera, 0);

    scene.npcs.forEach((npc, index) => {

        const bob = Math.sin(time * 0.002 + index) * 2;

        // Sombra.

        ctx.fillStyle = "#00000066";

        ctx.beginPath();

        ctx.ellipse(
            npc.x,
            FLOOR - 2,
            24,
            7,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Cuerpo.

        ctx.fillStyle =
            index === 0 ? "#778eae" :
            index === 1 ? "#9277a5" : "#659f9b";

        ctx.beginPath();

        ctx.moveTo(npc.x - 17, FLOOR - 47 + bob);
        ctx.lineTo(npc.x + 17, FLOOR - 47 + bob);
        ctx.lineTo(npc.x + 23, FLOOR - 5);
        ctx.lineTo(npc.x - 23, FLOOR - 5);

        ctx.closePath();
        ctx.fill();

        // Cabeza.

        ctx.fillStyle = "#dfbea2";

        ctx.beginPath();

        ctx.arc(
            npc.x,
            FLOOR - 59 + bob,
            14,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Nombre.

        ctx.textAlign = "center";

        ctx.font = "bold 14px Segoe UI, Arial";

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            npc.name,
            npc.x,
            FLOOR - 94
        );

    });

    ctx.restore();

}

function drawPlayer(time) {

    const x = P.x - S.camera;
    const y = P.y;

    const moving = Math.abs(P.vx) > 1;

    const step = moving && P.ground
        ? Math.sin(P.walk) * 7
        : 0;

    // Sombra.

    ctx.fillStyle = "#00000077";

    ctx.beginPath();

    ctx.ellipse(
        x + P.w / 2,
        FLOOR - 2,
        25,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Piernas.

    ctx.strokeStyle = "#b6c3d5";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(x + 12, y + 44);
    ctx.lineTo(x + 11 + step, y + 62);

    ctx.moveTo(x + 25, y + 44);
    ctx.lineTo(x + 26 - step, y + 62);

    ctx.stroke();

    // Capa.

    ctx.fillStyle = "#bd9257";

    ctx.beginPath();

    ctx.moveTo(x + 8, y + 24);
    ctx.lineTo(x + 30, y + 24);
    ctx.lineTo(x + 35 - P.vx * 0.018, y + 56);
    ctx.lineTo(x + 4 - P.vx * 0.018, y + 56);

    ctx.closePath();
    ctx.fill();

    // Torso.

    ctx.fillStyle = "#354b69";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 22,
        22,
        29,
        6
    );

    ctx.fill();

    // Cabeza.

    ctx.fillStyle = "#e2bfa3";

    ctx.beginPath();

    ctx.arc(
        x + 19,
        y + 13,
        13,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Cabello.

    ctx.fillStyle = "#2d2630";

    ctx.beginPath();

    ctx.arc(
        x + 19,
        y + 8,
        13,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    // Ojo según orientación.

    ctx.fillStyle = "#18202b";

    ctx.beginPath();

    ctx.arc(
        x + 19 + P.face * 5,
        y + 14,
        1.8,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Brillo suave del personaje.

    ctx.strokeStyle = "#f1d99e55";
    ctx.lineWidth = 1.5;

    ctx.strokeRect(
        x + 1,
        y - 3,
        P.w - 2,
        P.h + 3
    );

}

function drawLevelDecoration(time) {

    const level = LEVELS[S.level];

    ctx.save();
    ctx.translate(-S.camera, 0);

    for (let x = 130; x < WORLD; x += 480) {

        const y = 180;

        ctx.fillStyle = "#27354a";

        ctx.fillRect(x - 32, y, 64, 160);

        ctx.strokeStyle = level.accent + "88";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            x - 32,
            y,
            64,
            160
        );

        ctx.fillStyle = level.theme + "66";

        ctx.beginPath();

        ctx.arc(
            x,
            y + 65,
            18 + Math.sin(time * 0.002 + x) * 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    // Portal de salida.

    const portalX = WORLD - 135;

    const allDone = level.objects.every(
        obj => S.done.has(obj.id)
    );

    ctx.fillStyle =
        allDone ? level.theme + "44" : "#18202e";

    ctx.beginPath();

    ctx.roundRect(
        portalX - 48,
        FLOOR - 185,
        96,
        185,
        [48, 48, 0, 0]
    );

    ctx.fill();

    ctx.strokeStyle =
        allDone ? level.accent : "#697387";

    ctx.lineWidth = 8;

    ctx.stroke();

    ctx.textAlign = "center";

    ctx.font = "bold 17px Segoe UI, Arial";

    ctx.fillStyle = "#f6f0df";

    ctx.fillText(
        allDone ? "SALIDA ABIERTA" : "SALIDA CERRADA",
        portalX,
        FLOOR - 205
    );

    ctx.restore();

}

function drawStamina() {

    if (S.level !== 3) return;

    const x = 35;
    const y = 35;
    const width = 210;

    ctx.fillStyle = "#09131ccc";

    ctx.fillRect(
        x - 12,
        y - 18,
        width + 24,
        70
    );

    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 16px Segoe UI, Arial";

    ctx.fillText(
        "Energía del personaje",
        x,
        y
    );

    ctx.fillStyle = "#263e40";

    ctx.fillRect(x, y + 12, width, 14);

    ctx.fillStyle =
        S.stamina < 20 ? "#e88989" : "#83d4c4";

    ctx.fillRect(
        x,
        y + 12,
        width * S.stamina / 100,
        14
    );

}


/* ==========================================================
   7. DIBUJO COMPLETO
   ========================================================== */

function render(time) {

    if (S.screen !== "pantalla-juego") return;

    ctx.clearRect(0, 0, W, H);

    drawBackground(time);
    drawArchitecture();
    drawLevelDecoration(time);
    drawInteractiveObjects(time);
    drawNPCs(time);
    drawPlayer(time);
    drawStamina();

}


/* ==========================================================
   8. BUCLE PRINCIPAL
   ========================================================== */

function gameLoop(time) {

    const dt = S.last
        ? Math.min((time - S.last) / 1000, 0.035)
        : 0;

    S.last = time;

    if (S.screen === "pantalla-juego") {

        if (!S.paused && !S.modal) {

            movePlayer(dt);
            updateCamera(dt);
            updateNearby();

            // Comprobar llegada a la salida.

            const level = LEVELS[S.level];

            const complete = level.objects.every(
                obj => S.done.has(obj.id)
            );

            if (
                complete &&
                P.x > WORLD - 200
            ) {

                S.paused = true;

                // La función se implementa en la Parte 3.
                finishLevel();

            }

        }

        render(time);

    }

    if (S.toastUntil && time > S.toastUntil) {

        hideToast();
        S.toastUntil = 0;

    }

    requestAnimationFrame(gameLoop);

}


/* ==========================================================
   9. CONTROLES DE TECLADO
   ========================================================== */

document.addEventListener("keydown", event => {

    const code = event.code;

    const active = document.activeElement;

    const editing =
        active &&
        (
            active.tagName === "TEXTAREA" ||
            active.tagName === "INPUT" ||
            active.isContentEditable
        );

    if (editing) return;

    if (
        S.screen === "pantalla-juego" &&
        [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "Space"
        ].includes(code)
    ) {
        event.preventDefault();
    }

    if (event.repeat && (
        code === "Space" ||
        code === "KeyE" ||
        code === "Escape"
    )) {
        return;
    }

    if (S.modal) {

        if (code === "Escape") {

            // Cierre controlado en Parte 3.
            closeCurrentModal();

        }

        return;
    }

    if (code === "Escape") {

        if (S.screen === "pantalla-juego") {
            togglePause();
        }

        return;
    }

    if (S.paused) return;

    keys.add(code);

    if (
        code === "Space" ||
        code === "ArrowUp" ||
        code === "KeyW"
    ) {
        jump();
    }

    if (
        code === "KeyE" &&
        S.screen === "pantalla-juego"
    ) {
        interact();
    }

});

document.addEventListener("keyup", event => {

    keys.delete(event.code);

});

window.addEventListener("blur", () => {

    keys.clear();

});


/* ==========================================================
   10. CONTROLES TÁCTILES
   ========================================================== */

function bindHoldButton(id, code) {

    const button = $(id);

    if (!button) return;

    button.addEventListener("pointerdown", event => {

        event.preventDefault();

        button.setPointerCapture(event.pointerId);

        keys.add(code);

    });

    const release = () => {
        keys.delete(code);
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);

}

bindHoldButton("touch-left", "ArrowLeft");
bindHoldButton("touch-right", "ArrowRight");

$("touch-jump")?.addEventListener("pointerdown", event => {

    event.preventDefault();
    jump();

});

$("touch-interact")?.addEventListener("pointerdown", event => {

    event.preventDefault();
    interact();

});


/* ==========================================================
   FIN DE LA PARTE 2

   No agregues todavía:
   })();

   La Parte 3 contendrá:
   - Interacciones con personajes.
   - Desafíos filosóficos.
   - Sistema de respuestas y pistas.
   - Diario filosófico.
   - Pausa y ventanas.
   - Finalización de niveles.
   - Pantalla final.
   - Inicialización del juego.
   ========================================================== */

/* ==========================================================
   EL PALACIO DEL PODER
   SCRIPT.JS — PARTE 3 DE 3
   Interacciones, desafíos, progreso e inicialización.
   ========================================================== */


/* ==========================================================
   1. GESTIÓN DE VENTANAS
   ========================================================== */

let previousFocus = null;

function openModal(id) {

    const modal = $(id);
    if (!modal) return;

    if (!S.modal) {
        previousFocus = document.activeElement;
    } else {
        $(S.modal)?.classList.add("hidden");
    }

    S.modal = id;

    modal.classList.remove("hidden");

    keys.clear();

    const firstFocusable = modal.querySelector(
        "button:not(:disabled), textarea, input, [tabindex='0']"
    );

    firstFocusable?.focus({ preventScroll: true });
}

function closeCurrentModal() {

    if (!S.modal) return;

    const modalId = S.modal;

    // No permitir cerrar un desafío sin resolverlo
    // si el jugador eligió continuar con ese mecanismo.
    // Sí puede cerrarlo mediante el botón correspondiente.

    $(modalId)?.classList.add("hidden");

    S.modal = null;

    keys.clear();

    if (
        previousFocus &&
        previousFocus.isConnected &&
        typeof previousFocus.focus === "function"
    ) {
        previousFocus.focus({ preventScroll: true });
    } else if (S.screen === "pantalla-juego") {
        canvas.focus({ preventScroll: true });
    }

    previousFocus = null;
}

document.querySelectorAll("[data-close-modal]").forEach(button => {

    button.addEventListener("click", closeCurrentModal);

});


/* ==========================================================
   2. INTERACTUAR CON EL ESCENARIO
   ========================================================== */

function interact() {

    if (
        S.screen !== "pantalla-juego" ||
        S.paused ||
        S.modal
    ) return;

    updateNearby();

    if (!S.near) {

        toast("Acercate a un personaje o mecanismo para interactuar.", 2);

        return;
    }

    if (S.near.type === "npc") {

        talkToNPC(S.near.data);

    } else {

        openChallenge(S.near.data);

    }

}

function talkToNPC(npc) {

    $("tipo-desafio").textContent = "CONVERSACIÓN";

    $("titulo-desafio").textContent = npc.name;

    $("descripcion-desafio").textContent =
        "Un habitante del palacio quiere compartir una observación.";

    const body = $("contenido-desafio");

    body.replaceChildren();

    const paragraph = document.createElement("p");

    paragraph.textContent = npc.text;

    paragraph.style.fontSize = "18px";
    paragraph.style.lineHeight = "1.8";

    body.appendChild(paragraph);

    $("retroalimentacion-desafio").classList.add("hidden");

    $("btn-pista").classList.add("hidden");
    $("btn-reintentar").classList.add("hidden");

    $("btn-cerrar-desafio").textContent = "Continuar explorando";

    S.currentObject = null;

    openModal("modal-desafio");

    playTone(480, 0.08);

}


/* ==========================================================
   3. SISTEMA DE DESAFÍOS
   ========================================================== */

let challengeAnswered = false;
let selectedAnswer = -1;

function openChallenge(obj) {

    S.currentObject = obj;

    challengeAnswered = false;
    selectedAnswer = -1;

    $("tipo-desafio").textContent =
        LEVELS[S.level].author.toUpperCase();

    $("titulo-desafio").textContent = obj.title;

    $("descripcion-desafio").textContent = obj.story;

    $("btn-pista").classList.remove("hidden");

    $("btn-reintentar").classList.add("hidden");

    $("btn-cerrar-desafio").textContent = "Volver al juego";

    const feedback = $("retroalimentacion-desafio");

    feedback.textContent = "";
    feedback.className = "challenge-feedback hidden";

    createChallengeOptions(obj);

    openModal("modal-desafio");

    playTone(540, 0.1);

}

function createChallengeOptions(obj) {

    const container = $("contenido-desafio");

    container.replaceChildren();

    const instruction = document.createElement("p");

    instruction.textContent =
        "Observá la situación y elegí la interpretación que mejor la explica.";

    instruction.style.marginBottom = "8px";

    container.appendChild(instruction);

    // El orden se mezcla para evitar que
    // la respuesta correcta ocupe siempre
    // la primera posición.

    const options = obj.options.map((text, index) => ({
        text,
        correct: index === 0
    }));

    for (let i = options.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [options[i], options[j]] = [options[j], options[i]];

    }

    options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";

        button.textContent =
            String.fromCharCode(65 + index) + ". " + option.text;

        button.dataset.correct = String(option.correct);

        button.addEventListener("click", () => {

            if (challengeAnswered) return;

            selectedAnswer = index;

            evaluateAnswer(button, option.correct, obj);

        });

        container.appendChild(button);

    });

}

function evaluateAnswer(button, correct, obj) {

    const feedback = $("retroalimentacion-desafio");

    feedback.classList.remove("hidden");

    if (correct) {

        challengeAnswered = true;

        button.classList.add("correct");

        $("contenido-desafio")
            .querySelectorAll("button")
            .forEach(option => {
                option.disabled = true;
            });

        feedback.className =
            "challenge-feedback success";

        feedback.textContent =
            "¡Muy bien! " + obj.why;

        $("btn-pista").classList.add("hidden");
        $("btn-reintentar").classList.add("hidden");

        $("btn-cerrar-desafio").textContent =
            "Registrar descubrimiento y continuar";

        playTone(660, 0.12);

        window.setTimeout(() => {
            playTone(880, 0.16);
        }, 130);

    } else {

        button.classList.add("incorrect");

        feedback.className =
            "challenge-feedback error";

        feedback.textContent =
            "Esta interpretación no explica correctamente la situación. " +
            "Observá qué ocurre en la escena y volvé a intentarlo.";

        $("btn-reintentar").classList.remove("hidden");

        playTone(230, 0.13);

    }

}

function retryChallenge() {

    if (!S.currentObject || challengeAnswered) return;

    createChallengeOptions(S.currentObject);

    const feedback = $("retroalimentacion-desafio");

    feedback.textContent = "";
    feedback.className = "challenge-feedback hidden";

    $("btn-reintentar").classList.add("hidden");

}

function showHint() {

    if (!S.currentObject || challengeAnswered) return;

    const feedback = $("retroalimentacion-desafio");

    feedback.className = "challenge-feedback";

    feedback.textContent =
        "Pista: " + S.currentObject.hint;

    playTone(390, 0.08);

}

function closeChallenge() {

    if (
        S.currentObject &&
        challengeAnswered &&
        !S.done.has(S.currentObject.id)
    ) {

        S.done.add(S.currentObject.id);

        S.score += 100;

        updateHUD();

        const discovered = S.currentObject.concept;

        closeCurrentModal();

        toast("Descubrimiento registrado: " + discovered, 3);

        playTone(740, 0.13);

        const level = LEVELS[S.level];

        if (
            level.objects.every(
                obj => S.done.has(obj.id)
            )
        ) {

            toast(
                "¡Completaste los mecanismos! Dirigite al portal de salida.",
                5
            );

        }

    } else {

        closeCurrentModal();

    }

    S.currentObject = null;

    challengeAnswered = false;

}


/* ==========================================================
   4. DIARIO FILOSÓFICO
   ========================================================== */

function openDiary() {

    const container = $("diario-contenido");

    container.replaceChildren();

    let count = 0;

    Object.entries(LEVELS).forEach(([number, level]) => {

        level.objects.forEach(obj => {

            const discovered =
                Number(number) === S.level
                    ? S.done.has(obj.id)
                    : S.completed.has(number + ":" + obj.id);

            if (!discovered) return;

            count++;

            const article = document.createElement("article");

            article.className = "diary-entry";

            const title = document.createElement("h3");

            title.textContent =
                obj.concept + " — " + level.author;

            const description = document.createElement("p");

            description.textContent = obj.why;

            article.appendChild(title);
            article.appendChild(description);

            container.appendChild(article);

        });

    });

    if (count === 0) {

        const empty = document.createElement("p");

        empty.textContent =
            "Todavía no registraste descubrimientos. " +
            "Explorá el palacio e interactuá con sus mecanismos.";

        container.appendChild(empty);

    }

    openModal("modal-diario");

}


/* ==========================================================
   5. PAUSA Y REGRESO AL MAPA
   ========================================================== */

function togglePause() {

    if (S.screen !== "pantalla-juego") return;

    if (S.modal === "modal-pausa") {

        closeCurrentModal();

        S.paused = false;

        canvas.focus({ preventScroll: true });

        return;
    }

    if (S.modal) return;

    S.paused = true;

    openModal("modal-pausa");

}

function leaveToMap() {

    if (S.modal) {
        closeCurrentModal();
    }

    S.paused = false;

    keys.clear();

    updateMap();

    showScreen("pantalla-mapa");

}


/* ==========================================================
   6. FINALIZACIÓN DE SALAS
   ========================================================== */

function finishLevel() {

    const levelNumber = S.level;
    const level = LEVELS[levelNumber];

    // Guardar los conceptos descubiertos.

    level.objects.forEach(obj => {

        if (S.done.has(obj.id)) {

            S.completed.add(
                levelNumber + ":" + obj.id
            );

        }

    });

    // Desbloquear la siguiente sala.

    if (levelNumber < 4) {

        S.unlocked = Math.max(
            S.unlocked,
            levelNumber + 1
        );

    }

    // Bonificación por completar la sala.

    S.score += 150;

    $("puntuacion").textContent = S.score;

    if (levelNumber === 4) {

        showEnding();

        return;

    }

    $("titulo-nivel-superado").textContent =
        "¡Superaste la sala " +
        ["", "I", "II", "III"][levelNumber] +
        "!";

    $("resumen-nivel-superado").textContent =
        "Completaste " + level.name +
        " y descubriste tres conceptos fundamentales " +
        "para comprender el poder.";

    $("puntos-nivel").textContent =
        S.score - S.levelStartScore;

    $("conceptos-nivel").textContent =
        level.objects.length;

    const reflection = $("reflexion-nivel");

    reflection.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent =
        "¿Qué aprendiste con " + level.author + "?";

    const paragraph = document.createElement("p");

    const summaries = {

        1:
            "Foucault muestra que el poder no actúa " +
            "solamente mediante prohibiciones. " +
            "También organiza espacios, tiempos y " +
            "comportamientos a través de la vigilancia " +
            "y la disciplina.",

        2:
            "Preciado invita a cuestionar las normas " +
            "que clasifican identidades y cuerpos. " +
            "Estas categorías no son neutrales: " +
            "pueden abrir o limitar posibilidades.",

        3:
            "Byung-Chul Han analiza una forma de poder " +
            "que se incorpora como autoexigencia. " +
            "La búsqueda permanente de rendimiento " +
            "puede producir agotamiento."

    };

    paragraph.textContent = summaries[levelNumber];

    reflection.appendChild(heading);
    reflection.appendChild(paragraph);

    S.paused = false;

    updateMap();

    showScreen("pantalla-nivel-superado");

    playTone(740, 0.22);

}

function updateMap() {

    for (let number = 1; number <= 4; number++) {

        const button = $("btn-sala-" + number);

        const status = $("estado-sala-" + number);

        const card = document.querySelector(
            `.level-card[data-level="${number}"]`
        );

        if (!button || !status || !card) continue;

        const unlocked = number <= S.unlocked;

        const completed = LEVELS[number].objects.every(
            obj => S.completed.has(number + ":" + obj.id)
        );

        button.disabled = !unlocked;

        card.classList.toggle("locked", !unlocked);
        card.classList.toggle("available", unlocked);

        if (completed) {

            status.textContent = "Completada";

            button.textContent = "Volver a explorar";

        } else if (unlocked) {

            status.textContent = "Disponible";

            button.textContent = "Entrar a la sala";

        } else {

            status.textContent = "Bloqueada";

            button.textContent = "Sala bloqueada";

        }

    }

}


/* ==========================================================
   7. FINAL DEL VIDEOJUEGO
   ========================================================== */

function showEnding() {

    $("puntuacion-final").textContent = S.score;

    $("conceptos-final").textContent = S.completed.size;

    showScreen("pantalla-final");

    playTone(880, 0.25);

}

function restartGame() {

    S.level = 1;
    S.unlocked = 1;

    S.completed.clear();
    S.done.clear();

    S.score = 0;
    S.levelStartScore = 0;

    S.paused = false;
    S.modal = null;

    S.currentObject = null;
    S.near = null;

    $("respuesta-reflexion").value = "";

    keys.clear();

    resetPlayer();
    updateMap();

    showScreen("pantalla-inicio");

}

async function copyReflection() {

    const text = $("respuesta-reflexion").value.trim();

    if (!text) {

        announce("Primero escribí tu reflexión.");

        alert("Primero escribí tu reflexión.");

        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        announce("Reflexión copiada.");

        alert("Tu reflexión se copió correctamente.");

    } catch (error) {

        // Alternativa para navegadores que
        // restringen el acceso al portapapeles.

        const area = $("respuesta-reflexion");

        area.focus();
        area.select();

        announce(
            "Seleccioná el texto y presioná Control más C para copiarlo."
        );

        alert(
            "El texto quedó seleccionado. " +
            "Presioná Ctrl + C para copiarlo."
        );

    }

}


/* ==========================================================
   8. AUDIO
   ========================================================== */

function toggleAudio() {

    S.audio = !S.audio;

    const button = $("btn-audio");
    const label = $("audio-label");

    button.setAttribute(
        "aria-pressed",
        String(S.audio)
    );

    label.textContent = S.audio
        ? "Audio activado"
        : "Audio desactivado";

    if (S.audio) {

        playTone(520, 0.12);

    }

}


/* ==========================================================
   9. BOTONES PRINCIPALES
   ========================================================== */

function bindButton(id, callback) {

    const element = $(id);

    if (!element) {

        console.warn(
            "No se encontró el botón:",
            id
        );

        return;

    }

    element.addEventListener("click", callback);

}

bindButton("btn-jugar", () => {

    showScreen("pantalla-introduccion");

});

bindButton("btn-instrucciones", () => {

    openModal("modal-instrucciones");

});

bindButton("btn-ayuda-global", () => {

    openModal("modal-instrucciones");

});

bindButton("btn-continuar-introduccion", () => {

    updateMap();

    showScreen("pantalla-mapa");

});

for (let number = 1; number <= 4; number++) {

    bindButton("btn-sala-" + number, () => {

        loadLevel(number);

    });

}

bindButton("btn-pausa", togglePause);

bindButton("btn-mapa", leaveToMap);

bindButton("btn-diario", openDiary);

bindButton("btn-pista", showHint);

bindButton("btn-reintentar", retryChallenge);

bindButton("btn-cerrar-desafio", closeChallenge);

bindButton("btn-reanudar", togglePause);

bindButton("btn-salir-mapa", leaveToMap);

bindButton("btn-siguiente-nivel", () => {

    updateMap();

    showScreen("pantalla-mapa");

});

bindButton("btn-volver-mapa", () => {

    updateMap();

    showScreen("pantalla-mapa");

});

bindButton("btn-reiniciar", restartGame);

bindButton("btn-copiar-reflexion", copyReflection);

bindButton("btn-audio", toggleAudio);


/* ==========================================================
   10. MEJORAS DE ACCESIBILIDAD
   ========================================================== */

// Mantener el foco dentro de las ventanas modales.

document.addEventListener("keydown", event => {

    if (event.key !== "Tab" || !S.modal) return;

    const modal = $(S.modal);

    if (!modal) return;

    const focusable = Array.from(
        modal.querySelectorAll(
            "button:not(:disabled):not(.hidden), " +
            "textarea:not(:disabled), " +
            "input:not(:disabled), " +
            "[tabindex='0']"
        )
    ).filter(element => {

        return element.getClientRects().length > 0;

    });

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
        event.shiftKey &&
        document.activeElement === first
    ) {

        event.preventDefault();

        last.focus();

    } else if (
        !event.shiftKey &&
        document.activeElement === last
    ) {

        event.preventDefault();

        first.focus();

    }

});

// Evitar que una tecla quede presionada
// cuando el usuario cambia de pestaña.

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        keys.clear();

    }

});


/* ==========================================================
   11. INICIALIZACIÓN DEL VIDEOJUEGO
   ========================================================== */

function initializeGame() {

    if (!canvas || !ctx) {

        console.error(
            "No se pudo inicializar el escenario Canvas."
        );

        return;

    }

    canvas.width = W;
    canvas.height = H;

    buildScene();

    resetPlayer();

    updateMap();

    showScreen("pantalla-inicio");

    requestAnimationFrame(gameLoop);

    console.info(
        "El Palacio del Poder: motor inicializado correctamente."
    );

}

initializeGame();


/* ==========================================================
   FIN DEL ARCHIVO SCRIPT.JS
   ========================================================== */

})();
