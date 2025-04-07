const canvas = document.getElementById('pizzaRuleta');
const ctx = canvas.getContext('2d');
const botonGirar = document.getElementById('girarBtn');
const resultado = document.getElementById('resultado');

// Datos de la pizza (premios y colores)
const premios = [
    "🎁 Pizza Gratis",
    "🤑 20% de Descuento",
    "🍕 Rebanada Gratis",
    "🎯 Una chance más",
    "🥤 Bebida Gratis",
    "🤩 30% de Descuento"
];
const colores = ["#ffcc99", "#ff9966", "#ff6633", "#ff3300", "#cc0000", "#990000"];

let anguloActual = 0;
let girando = false;

// Dibujar pizza dividida en rebanadas
function dibujarPizza() {
    const total = premios.length;
    const anguloPorcion = (2 * Math.PI) / total;

    for (let i = 0; i < total; i++) {
        const inicio = anguloPorcion * i;
        const final = inicio + anguloPorcion;

        // Dibujar una rebanada
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, inicio, final);
        ctx.fillStyle = colores[i % colores.length];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        // Dibujar texto del premio
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(inicio + anguloPorcion / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Arial";
        ctx.fillText(premios[i], 150, 10);
        ctx.restore();
    }
}

// Girar la ruleta con suavizado
function girarPizza() {
    if (girando) return;
    girando = true;

    const anguloFinal = Math.random() * 360 + 720; // Gira al menos 2 vueltas
    const duracion = 5000; // Duración en ms
    const inicio = Date.now();

    function animarGiro() {
        const progreso = (Date.now() - inicio) / duracion;
        if (progreso < 1) {
            const easing = Math.pow(progreso, 3); // Suavizar el movimiento
            anguloActual = easing * anguloFinal;
            dibujarRotacion();
            requestAnimationFrame(animarGiro);
        } else {
            anguloActual = anguloFinal % 360;
            dibujarRotacion();
            animarRebote(); // Efecto adicional al terminar
            mostrarPremio();
        }
    }

    requestAnimationFrame(animarGiro);
}

// Rebote al finalizar
function animarRebote() {
    let rebote = 0;
    const maxRebote = 10;
    const interval = setInterval(() => {
        if (rebote >= maxRebote) {
            clearInterval(interval);
            girando = false;
        } else {
            anguloActual += rebote % 2 === 0 ? 2 : -2;
            dibujarRotacion();
            rebote++;
        }
    }, 50);
}

// Dibujar la ruleta rotada
function dibujarRotacion() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate((anguloActual * Math.PI) / 180);
    ctx.translate(-250, -250);
    dibujarPizza();
    ctx.restore();
}

// Mostrar el premio obtenido
function mostrarPremio() {
    const total = premios.length;
    const anguloPorPremio = 360 / total;
    const indice = Math.floor((360 - anguloActual % 360) / anguloPorPremio) % total;
    resultado.textContent = `¡Ganaste: ${premios[indice]}! 🍕`;
}

// Eventos
dibujarPizza();
botonGirar.addEventListener('click', girarPizza);