export class DomController {
    constructor(battleshipGame) {
        this.bs = battleshipGame
        this.createGameBoard(this.bs.mapSize, document.querySelector("#active_gameboard"), this.bs.player1, true)
        this.createGameBoard(this.bs.mapSize, document.querySelector("#enemy_gameboard"), this.bs.player2, false)
    }

    createGameBoard(size, container, player, playerBoard) {
        console.log(player.gameboard)
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const el = document.createElement('div');
                el.className = "grid-element empty";
                el.dataset.x = x;
                el.dataset.y = y;
                el.dataset.player = player.number
                if(!playerBoard) {
                    el.addEventListener('click', (e) => {
                        this.registerAttack(e.target, player)
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

     registerAttack(el, player) {
        const attackEffect = player.gameboard.receiveAttack(el.dataset.x, el.dataset.y)
        
        if (attackEffect === player.gameboard.states.hit) {
            el.classList.add("hit")
        }
        if (attackEffect === player.gameboard.states.miss) {
            el.classList.add("miss")
            el.classList.remove("empty")
        }
        
    }

}