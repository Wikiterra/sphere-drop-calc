const R = 6371; // Radius of the spherical Earth in km

function renderKatexEquations() {
    // Method 1: Pythagoras
    katex.render(`
    \\text{\\textbf{Definiciones de variables:}}\\\\
    d: \\text{Distancia observada}\\\\
    d_1: \\text{Distancia hasta el horizonte geométrico}\\\\
    d_2: \\text{Distancia desde el horizonte geométrico al objeto observado}\\\\
    h_0: \\text{Altura del observador}\\\\
    h_1: \\text{Altura oculta o drop de caída}\\\\
    R: \\text{Radio terrestre}
    `, document.getElementById('formula-variables'));

    katex.render(`
    (R + h_0)^2 = d_1^2 + R^2 \\Rightarrow d_1 = \\sqrt{h_0^2 + 2Rh_0}
    `, document.getElementById('formula-pythagoras-1'));

    katex.render(`
    (R + h_1)^2 = d_2^2 + R^2 \\Rightarrow h_1 = \\sqrt{d_2^2 + R^2} - R
    `, document.getElementById('formula-pythagoras-2'));

    katex.render(`
    d = d_0 - d_1 \\Rightarrow h_1 = \\sqrt{(d_0 - d_1)^2 + R^2} - R
    `, document.getElementById('formula-pythagoras-3'));

    // Method 2: Perimeter of a circle
    katex.render(`
    \\text{\\textbf{Definiciones de variables:}}\\\\
    C: \\text{Circunferencia de la Tierra}\\\\
    d: \\text{Distancia observada}\\\\
    R: \\text{Radio terrestre}\\\\
    \\alpha: \\text{Ángulo subtendido en radianes}\\\\
    h_1: \\text{Altura oculta o drop de caída}
    `, document.getElementById('formula-variables'));

    katex.render(`
    C = 2\\pi R
    `, document.getElementById('formula-perimeter-1'));

    katex.render(`
    \\alpha = \\frac{d}{R}
    `, document.getElementById('formula-perimeter-2'));

    katex.render(`
    h_1 = R(1 - \\cos(\\alpha))
    `, document.getElementById('formula-perimeter-3'));

    // Method 3: Trigonometry
    katex.render(`
    \\text{\\textbf{Definiciones de variables:}}\\\\
    C: \\text{Circunferencia de la Tierra}\\\\
    d: \\text{Distancia observada}\\\\
    R: \\text{Radio terrestre}\\\\
    \\alpha: \\text{Ángulo subtendido en radianes}\\\\
    \\alpha_{km}: \\text{Conversión de ángulo por distancia en km}\\\\
    h_1: \\text{Altura oculta o drop de caída}
    `, document.getElementById('formula-variables'));

    katex.render(`
    C = 2\\pi R
    `, document.getElementById('formula-trigonometry-1'));

    katex.render(`
    \\alpha = \\alpha_{km} \\cdot d
    `, document.getElementById('formula-trigonometry-2'));

    katex.render(`
    h_1 = R(1 - \\cos(\\alpha)) \\Rightarrow h_1 = R \\left( \\frac{1}{\\cos\\left(\\frac{d}{R}\\right)} - 1 \\right)
    `, document.getElementById('formula-trigonometry-3'));

    katex.render(
        String.raw`d = 113 \sqrt{h_0}`, 
        document.getElementById('d-geometric-horizon-equation')
    );
}

/**
 * Calculates the drop in height using the Pythagorean theorem.
 * @param {number} h0 - Initial height in km.
 * @param {number} d - Distance in km.
 * @returns {object} - Object containing the calculated drop (h1) rounded to three decimal places.
 */
function calcDropThPythagoras(h0, d) {
    const d1 = Math.sqrt(h0 ** 2 + 2 * R * h0);

    if (d <= d1) {
        return { h1: 0 }; // Target is still visible above horizon
    }
    const h1 = Math.sqrt((d - d1) ** 2 + R ** 2) - R;
    return { h1: h1.toFixed(3) };
}

/**
 * Calculates the drop in height using the perimeter of a circle.
 * @param {number} d - Distance in km.
 * @returns {object} - Object containing the calculated drop (h1) rounded to three decimal places.
 */
function calcDropPerimeterCircle(d) {
    const alpha = d / R;
    const h1 = R * (1 - Math.cos(alpha));
    return { h1: h1.toFixed(3) };
}

/**
 * Calculates the drop in height using trigonometry.
 * @param {number} d - Distance in km.
 * @returns {object} - Object containing the calculated drop (h1) rounded to three decimal places.
 */
function calcDropTrigonometry(d) {
    const h1 = R * (1 / Math.cos(d / R) - 1);
    return { h1: h1.toFixed(3) };
}

document.addEventListener('DOMContentLoaded', () => {
    const methodButtons = document.querySelectorAll('.list-methods button');
    const methods = document.querySelectorAll('.method');
    
    function showMethod(method) {
        methods.forEach(m => m.style.display = 'none');
        const selectedMethod = document.querySelector(`.${method}-method`);
        if (selectedMethod) {
            selectedMethod.style.display = 'block';
        }
    
        // Remove active class from all buttons
        methodButtons.forEach(button => button.classList.remove('active'));
    
        // Add active class to the clicked button
        const activeButton = document.querySelector(`button[data-method="${method}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    // Show the Pythagoras method by default on first load
    showMethod('pythagoras');
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.getAttribute('data-method');
            showMethod(method);
        });
    });

    renderKatexEquations();

    document.querySelector('#form-pythagoras').addEventListener('submit', (event) => {
        event.preventDefault();
        const h0 = parseFloat(document.querySelector('#h0').value);
        const d = parseFloat(document.querySelector('#d-pythagoras').value);
        const output = calcDropThPythagoras(h0, d);
        document.querySelector('#h1-pythagoras').value = output.h1;
    });

    document.querySelector('#form-perimeter').addEventListener('submit', (event) => {
        event.preventDefault();
        const d = parseFloat(document.querySelector('#d-perimeter').value);
        const output = calcDropPerimeterCircle(d);
        document.querySelector('#h1-perimeter').value = output.h1;
    });

    document.querySelector('#form-trigonometry').addEventListener('submit', (event) => {
        event.preventDefault();
        const d = parseFloat(document.querySelector('#d-trigonometry').value);
        const output = calcDropTrigonometry(d);
        document.querySelector('#h1-trigonometry').value = output.h1;
    });
});