import { Battleships } from "../src/ship.js";

export class DomController {
    constructor() {
        this.setupPageButtons();
        this.setupGame();
    }

    setupPageButtons() {
        //reset button 
        const resetButton = document.querySelector("#reset_button")
        resetButton.onclick = () => {
            this.triggerGameReset()
        }

    }

    setupGame() {
        this.bs = new Battleships();
        this.bs.addDomController(this);
        this.createGameBoard(this.bs.mapSize, document.querySelector("#active_gameboard"), this.bs.player1, true);
        this.createGameBoard(this.bs.mapSize, document.querySelector("#enemy_gameboard"), this.bs.player2, false);
    }

    #createShipElements(el, player, x, y) {
        const shipAngle = player.gameboard.getShipAngle(x, y);
        const shipSection = player.gameboard.getShipSection(x, y);
        const shipEl = document.createElement('div');
        shipEl.classList.add("ship");
        shipEl.classList.add(shipSection);
        shipEl.classList.add(`angle-${shipAngle}`);
        shipEl.classList.add("not-hit");
        el.appendChild(shipEl);
        return shipEl;
    }

    createGameBoard(size, container, player, playerBoard) {
        container.dataset.player = player.number
        container.style.gridTemplateColumns = `repeat(${this.bs.mapSize}, auto)`;
        container.style.gridTemplateRows = `repeat(${this.bs.mapSize}, auto)`;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const el = document.createElement('div');
                el.className = "grid-element";
                el.dataset.x = x;
                el.dataset.y = y;
                el.dataset.player = player.number
                const border = document.createElement('div');
                border.className = 'border-element';
                el.appendChild(border);
                if(!playerBoard) {
                    el.addEventListener('click', (e) => {
                        this.registerAttackFromPlayer(e.target, player)
                    })
                }
                container.appendChild(el);
                if (player.gameboard.hasShip(x, y) && playerBoard) {
                    this.#createShipElements(el, player, x, y)
                }
            }
        }
    }

    registerAttackFromPlayer(el, player) {
        if(this.bs.activePlayer.type === "cpu") return

        const attackEffect = this.bs.playerAttack(el.dataset.x, el.dataset.y, player)

        if (attackEffect === player.gameboard.states.hit) {
            const shipEl = this.#createShipElements(el, player, el.dataset.x, el.dataset.y)
            shipEl.classList.remove("not-hit");
            shipEl.classList.add("hit");
        }
        if (attackEffect === player.gameboard.states.miss) {
            el.classList.add("miss");
            el.classList.remove("empty");
        }
    }

    registerCPUAttack(x, y, playerNumber, attackEffect, states) {
        const gameboard = findParent(document.querySelectorAll(".gameboard"));

        for (const boardSquare of gameboard.children) {
            if(parseInt(boardSquare.dataset.x) === x && parseInt(boardSquare.dataset.y) === y) {
                if (attackEffect === states.hit) {
                    for (const element of boardSquare.children) {
                        if (element.classList.contains('ship')) {
                            element.classList.remove("not-hit");
                            element.classList.add("hit");
                        }
                    }
                }
                if (attackEffect === states.miss) {
                    boardSquare.classList.add("miss");
                    boardSquare.classList.remove("empty");
                }
                break;
            }
        }

        function findParent(parents) {
            for(const parent of parents) {
                if (parseInt(parent.dataset.player) === playerNumber) {
                    return parent
                }
            }
        }
            
    }

    updateGameDetails(round, playerName) {
        document.querySelector(".round-counter").innerText = "Round: " + round;
        document.querySelector(".player-turn").innerText = "Current Player: " + playerName
    }

    triggerGameEnd(winner) {
        //show victory popup
        const victoryElement = document.querySelector(".victory");
        victoryElement.hidden = false;
        victoryElement.style.display = "flex"
        victoryElement.innerText = `Winner: ${winner}!`
        //can't use boards anymore
        document.querySelector('#gameboards').style.pointerEvents = 'none';
    }

    triggerGameReset() {
        //empty board elements
        document.querySelectorAll(".gameboard").forEach((div) => {
            div.innerHTML = "";
        })
        //hide victory popup
        const victoryElement = document.querySelector(".victory");
        victoryElement.hidden = false;
        victoryElement.style.display = "none";
        //reactivate boards
        document.querySelector('#gameboards').style.pointerEvents = 'auto';
        //setup new game
        this.setupGame()
    }
}