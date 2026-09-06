function faqIniciarAcordeon() {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains("active");

            // Cerrar todas
            document.querySelectorAll(".faq-answer").forEach(item => {
                item.classList.remove("active");
            });

            document.querySelectorAll(".faq-question").forEach(item => {
                item.querySelector("span").textContent = "+";
            });

            if (!isOpen) {
                answer.classList.add("active");
                question.querySelector("span").textContent = "×";
            }
        });
    });
}

function faqIniciarRevelado() {
    const elementos = document.querySelectorAll(".faq__revelar");
    if (!elementos.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elementos.forEach((el) => el.classList.add("faq__revelar--visible"));
        return;
    }

    elementos.forEach((el, indice) => {
        el.style.transitionDelay = (indice % 4 * 0.08) + "s";
    });

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add("faq__revelar--visible");
            observador.unobserve(entrada.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    elementos.forEach((el) => observador.observe(el));
}

function faqIniciarEnredaderas() {
    const contenedor = document.querySelector(".faq__enredaderas");
    const seccion = document.querySelector(".faq-content");

    if (!contenedor || !seccion) return;

    const izquierda = contenedor.querySelector(".vida__enredadera--izq");

    if (izquierda && !contenedor.querySelector(".vida__enredadera--der")) {
        const derecha = izquierda.cloneNode(true);
        derecha.classList.remove("vida__enredadera--izq");
        derecha.classList.add("vida__enredadera--der");
        contenedor.appendChild(derecha);
    }

    const piezas = Array.from(contenedor.querySelectorAll("[data-s]")).map((el) => ({
        el,
        inicio: parseFloat(el.dataset.s) / 100,
        fin: parseFloat(el.dataset.e) / 100,
        esHoja: el.classList.contains("vida__enr-hoja")
    }));

    if (!piezas.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        piezas.forEach(({ el, esHoja }) => {
            if (esHoja) {
                el.style.opacity = 1;
                el.style.transform = "scale(1)";
            } else {
                el.style.strokeDashoffset = 0;
            }
        });
        return;
    }

    const actualizar = () => {
        const rect = seccion.getBoundingClientRect();
        const mira = window.innerHeight / 2 - rect.top;
        const progreso = rect.height > 0
            ? Math.min(1, Math.max(0, mira / rect.height))
            : 0;

        piezas.forEach(({ el, inicio, fin, esHoja }) => {
            const avance = Math.min(1, Math.max(0, (progreso - inicio) / (fin - inicio)));

            if (esHoja) {
                el.style.opacity = avance;
                el.style.transform = "scale(" + (0.15 + avance * 0.85) + ")";
            } else {
                el.style.strokeDashoffset = 1 - avance;
            }
        });
    };

    let pendiente = false;

    window.addEventListener("scroll", () => {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => {
            actualizar();
            pendiente = false;
        });
    }, { passive: true });

    window.addEventListener("resize", actualizar);
    actualizar();
}

document.addEventListener("DOMContentLoaded", () => {
    faqIniciarAcordeon();
    faqIniciarRevelado();
    faqIniciarEnredaderas();
});