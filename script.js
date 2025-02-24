const R = 6371; // Radius of the Earth in km

/**
 * Calculates the drop in height using the Pythagorean theorem.
 * @param {number} h0 - Initial height in km.
 * @param {number} d - Distance in km.
 * @returns {object} - Object containing the calculated drop (h1) rounded to three decimal places.
 */
function calcDropThPythagoras(h0, d) {
    const d1 = Math.sqrt(h0 ** 2 + (2 * R * h0));
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
    // Rendering formulas using KaTeX
    katex.render("d_2^2 + R^2 = (R + h_1)^2 \\Rightarrow h_1 = \\sqrt{d_2^2 - 2Rh_1}", document.getElementById('formula-pythagoras-1'));
    katex.render("d_2=d - d_1", document.getElementById('formula-pythagoras-2'));
    katex.render("h_1 = \\sqrt{(d - d_1)^2 + R^2} - R", document.getElementById('formula-pythagoras-3'));

    katex.render("C = 2\\pi R", document.getElementById('formula-perimeter-1'));
    katex.render("\\alpha = \\frac{d}{R} \\Rightarrow \\alpha = \\frac{2 \\pi d}{C}", document.getElementById('formula-perimeter-2'));
    katex.render("h_1 = R(1 - \\cos(\\frac{2 \\pi d}{C}))", document.getElementById('formula-perimeter-3'));

    katex.render("C = 2\\pi R", document.getElementById('formula-trigonometry-1'));
    katex.render("\\alpha = \\alpha_{km} \\cdot d", document.getElementById('formula-trigonometry-2'));
    katex.render("h_1 = R(1 - \\cos(\\alpha)) \\Rightarrow h_1 = R \\left( \\frac{1}{\\cos\\left(\\frac{d}{R}\\right)} - 1 \\right)", document.getElementById('formula-trigonometry-3'));

    const methodSelect = document.getElementById('method-select');
    const methods = document.querySelectorAll('.method');

    methodSelect.addEventListener('change', (event) => {
        methods.forEach(method => method.style.display = 'none');
        document.querySelector(`.${event.target.value}-method`).style.display = 'block';
    });

    // Set default method to "Pythagoras"
    methodSelect.value = 'pythagoras';
    document.querySelector('.pythagoras-method').style.display = 'block';

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
