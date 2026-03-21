export class DomController {
    constructor() {

    }

    createGameBoard(size, container) {
        for (let i = 0; i < size * size; i++) {
            const el = document.createElement('div');
            el.className = "grid-element";
            container.appendChild(el);
        }
    }
}