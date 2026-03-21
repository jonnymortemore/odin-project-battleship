export class DomController {
    constructor(battleshipGame) {
        this.bs = battleshipGame;
        this.bs.dom = this;
        this.createGameBoard(this.bs.mapSize, document.querySelector("#active_gameboard"), this.bs.player1, true);
        this.createGameBoard(this.bs.mapSize, document.querySelector("#enemy_gameboard"), this.bs.player2, false);
    }

    createGameBoard(size, container, player, playerBoard) {
        container.dataset.player = player.number
        container.style.gridTemplateColumns = `repeat(${this.bs.mapSize}, auto)`;
        container.style.gridTemplateRows = `repeat(${this.bs.mapSize}, auto)`;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const el = document.createElement('div');
                el.className = "grid-element empty";
                el.dataset.x = x;
                el.dataset.y = y;
                el.dataset.player = player.number
                if(!playerBoard) {
                    el.addEventListener('click', (e) => {
                        this.registerAttackFromPlayer(e.target, player)
                    })
                }
                container.appendChild(el);
                if (player.gameboard.hasShip(x, y) && playerBoard) {
                    el.classList.remove("empty")
                    el.classList.add("ship")
                }
            }
        }
    }

    registerAttackFromPlayer(el, player) {
        if(this.bs.activePlayer.type === "cpu") return

        const attackEffect = this.bs.playerAttack(el.dataset.x, el.dataset.y, player)

        if (attackEffect === player.gameboard.states.hit) {
            el.classList.add("hit")
        }
        if (attackEffect === player.gameboard.states.miss) {
            el.classList.add("miss")
            el.classList.remove("empty")
        }
    }

    registerCPUAttack(x, y, playerNumber, attackEffect, states) {
        const parent = findParent(document.querySelectorAll(".gameboard"));

        for (const child of parent.children) {
            if(parseInt(child.dataset.x) === x && parseInt(child.dataset.y) === y) {
                if (attackEffect === states.hit) {
                    child.classList.add("hit")
                }
                if (attackEffect === states.miss) {
                    child.classList.add("miss")
                    child.classList.remove("empty")
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

}