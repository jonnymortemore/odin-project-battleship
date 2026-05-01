import { Battleships } from "../src/ship.js";

export class DomController {
    #missSVG =
        '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 512 512"><path fill="#2758c9" fill-opacity="0.8" d="M163.53 21.28c-4.262.042-8.402 1.318-11.936 3.782-14.61 10.188-21.734 41.505 11.03 69.97-.874 22.855 41.786 26.99 24.845-6.657 15.375-44.718-5.465-67.27-23.94-67.094zm255.25 9.564c-6.193.008-12.997 2.884-16.78 8.625-23.15 35.122 1.875 53.016 25.875 14.936 9.863-15.65 1.23-23.575-9.094-23.562zm-41.717 63.468c-63.42 56.883-111.03 138.435-247.688 80.938 18.578 53.492-6.768 71.09-31.313 76.28-8.846-6.104-17.503-14.193-25.374-24.28l-19.282-24.72 2.625 31.25c5.134 61.565 27.576 107.054 64.782 136.376 37.207 29.322 88.146 42.22 149.25 42.22 95.388 0 181.77-60.905 213.563-148l5.344-14.657-15.408 2.186c-5.34.757-9.54.544-12.812-.28l31.688-60.157c-14.324 6.135-29.355 13.593-43.97 20.25 1.73-13.324 5.75-30.14 12.72-50.282l10.312-29.875L446.594 151c-25.463 19.87-52.84 43.613-79.78 63.25-8.948-17.862-7.626-54.075 10.248-119.938zM33.188 139.906c-8.878-.007-18.012 11.466-15.688 22.688 6.156 29.728 35.794 21.19 28.844-7.75-2.593-10.795-7.83-14.934-13.157-14.938zm401.343 44.906c-6.213 24.132-7.675 43.034-3.936 57.844 2.573 10.193 8.258 18.705 16.562 23.5 4.09 2.36 8.58 3.803 13.375 4.47-29.9 20.703-73.522 6.61-53.53-46.72-85.188 114.645-173.707 126.336-202.156 39.125-14.613 86.63-105.328 67.462-125.75-2.342 22.01 18.3 47.298 26.824 70.656 22.25 15.653-3.066 29.977-12.394 40.25-27.438 5.99-8.77 10.622-19.464 13.813-32 13.008 21.732 28.002 35.802 44.812 43.094 22.92 9.942 47.727 6.613 71.688-3.22 39.206-16.086 78.357-49.144 114.218-78.562zm-6 179.688c11.396 7.638 18.095 16.212 18.095 25.125 0 32.772-85.57 59.563-190.375 59.563-104.804 0-189.813-26.79-189.813-59.563 0-8.645 6.17-17.1 16.938-24.53-39.8 13.298-64.844 31.22-64.844 50.81 0 41.02 106.547 74.158 237.72 74.158s237.688-33.137 237.688-74.157c0-19.793-24.892-38.038-65.407-51.406z"/></svg>';

    #hitSVG =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="#d41e1e" fill-opacity="0.8" width="800px" height="800px" viewBox="0 0 32 32" version="1.1"><title>fire</title><path d="M11.87 30.782c2.827-0.004 6.12-0.016 8.583-0.022 6.399-4.805 0.449-11.341-4.919-10.395 4.74 3.583 0.616 9.454-3.664 10.417zM23.245 6.173c0.001 0.045 0 0.090 0 0.136 4.927 11.598-8.514 11.801-7.44 0.717-2.601 6.269-8.292-0.134-5.683-5.695v-0c-11.473 6.657 3.244 14.186-0.636 20.745-2.189 3.7-7.109-1.768-6.756-7.912-3.107 7.886-0.845 13.525 3.212 16.583 0.107 0.026 1.583 0.036 3.653 0.037-0.212-0.054-0.419-0.125-0.622-0.214-1.335-0.586-2.12-3.808 1.822-5.503-0.787 4.838 8.606 0.838 1.458-10.24l0-0c5.318 1.677 8.675 3.745 11.078 7.434 1.694-1.511 2.91-4.074 3.28-6.596 2.713 4.869 1.466 12.355-4.95 15.092 1.419-0.003 2.37-0.002 2.471 0.005 9.657-2.17 8.694-15.283-0.886-24.589z"/></svg>';

    constructor() {
        this.setupPageButtons();
        this.setupGame();
    }

    setupPageButtons() {
        //reset button
        const resetButton = document.querySelector("#reset_button");
        resetButton.onclick = () => {
            this.triggerGameReset();
        };
        const randomShipPositions = document.querySelector(
            "#random_starting_position",
        );
        randomShipPositions.onclick = () => {
            this.triggerGameReset();
            document.querySelectorAll("#active_gameboard").forEach((div) => {
                div.innerHTML = "";
            });
            this.bs.setupPlayerShips(this.bs.player1);
            this.createGameBoard(
                this.bs.mapSize,
                document.querySelector("#active_gameboard"),
                this.bs.player1,
                true,
            );
        };
        const startGame = document.querySelector("#start_game");
        startGame.onclick = () => {
            this.startGame();
        };
    }

    setupGame() {
        this.bs = new Battleships();
        this.bs.addDomController(this);
        document.querySelector("#enemy_gameboard").style.pointerEvents = "none";
        this.createGameBoard(
            this.bs.mapSize,
            document.querySelector("#active_gameboard"),
            this.bs.player1,
            true,
        );
        this.createGameBoard(
            this.bs.mapSize,
            document.querySelector("#enemy_gameboard"),
            this.bs.player2,
            false,
        );
        this.updateGameDetails(1, this.bs.player1.name);
        this.createPlacementShips(this.bs.presetShips);
    }

    startGame() {
        document.querySelector("#enemy_gameboard").style.pointerEvents = "auto";
        document.querySelectorAll("#active_gameboard").forEach((div) => {
            div.innerHTML = "";
        });
        this.createGameBoard(
            this.bs.mapSize,
            document.querySelector("#active_gameboard"),
            this.bs.player1,
            true,
        );
        document.querySelectorAll(".placement-ship").forEach((ship) => {
            ship.remove();
        });
        document.querySelector("#random_starting_position").hidden = true;
    }

    createPlacementShips(ships) {
        const container = document.querySelector(".ship-selection-container");
        container.innerHTML = "";
        for (const ship of ships) {
            const shipElement = document.createElement("div");
            shipElement.classList.add("placement-ship");
            shipElement.draggable = true;
            shipElement.id = ship.name;
            shipElement.dataset.size = ship.size;
            shipElement.dataset.angle = 0;
            shipElement.addEventListener("dragstart", (ev) => {
                ev.dataTransfer.setData("text/plain", ev.target.id);
            });
            shipElement.addEventListener("dblclick", (ev) => {
                const ship = ev.currentTarget;
                //get current ship angle
                let oldShipAngle = parseInt(ship.dataset.angle);
                //find new ship angle
                let shipAngle = oldShipAngle +  90;
                // reset to 0
                if (shipAngle === 360) {
                    shipAngle = 0;
                }
                //for each child -> set new angle class
                shipElement.querySelectorAll('.ship').forEach((shipSection) => {
                    shipSection.classList.remove(`angle-${oldShipAngle}`);
                    shipSection.classList.add(`angle-${shipAngle}`);
                });
                    
                //save new angle to ship
                shipElement.dataset.angle = shipAngle;
                //set flex direction based on angle
                switch (shipAngle) {
                    case 0:
                        shipElement.style.flexDirection = "row";
                        break;
                    case 90:
                        shipElement.style.flexDirection = "column";
                        break;
                    case 180:
                        shipElement.style.flexDirection = "row-reverse";
                        break;
                    case 270:
                        shipElement.style.flexDirection = "column-reverse";
                }
            });
            for (let i = 1; i <= ship.size; i++) {
                const shipSectionContainer = document.createElement("div");
                shipSectionContainer.className = "ship-section-container";
                shipSectionContainer.style.backgroundColor = "none";
                const shipSection = document.createElement("div");
                shipSection.classList.add("ship");
                shipSection.classList.add("angle-0");
                if (i == 1) {
                    shipSection.classList.add('back');
                } else if (i == ship.size) {
                    shipSection.classList.add("front");
                } else {
                    shipSection.classList.add("middle");
                }
                shipSectionContainer.appendChild(shipSection);
                shipElement.appendChild(shipSectionContainer);
            }
            container.appendChild(shipElement);
        }
    }

    #createShipElements(el, player, x, y, immediateHit) {
        if (el.classList.contains("destroyed")) {
            return;
        }
        const shipAngle = player.gameboard.getShipAngle(x, y);
        const shipSection = player.gameboard.getShipSection(x, y);
        const shipEl = document.createElement("div");
        shipEl.classList.add("ship");
        shipEl.classList.add(shipSection);
        shipEl.classList.add(`angle-${shipAngle}`);

        el.appendChild(shipEl);
        if (immediateHit) {
            shipEl.classList.add("hit");
        } else {
            shipEl.classList.add("not-hit");
        }
    }

    createGameBoard(size, container, player, playerBoard) {
        function setupAsDragTarger(element, domController) {
            const doesShipFit = (x, y, angle, shipSize, maxSize) => {
                switch (angle) {
                    case 0:
                        if (x + shipSize > maxSize) {
                            return false
                        }
                        break;
                    case 180: 
                        if (x + shipSize > maxSize) {
                            return false
                        }
                        break;
                    case 90:
                        if (y + shipSize > maxSize) {
                            return false
                        }
                        break;
                    case 270:
                        if (y + shipSize > maxSize) {
                            return false
                        }
                        break;
                }
                return true
            }


            element.addEventListener("dragover", (ev) => {
                ev.preventDefault();
            });
            element.addEventListener("drop", (ev) => {
                const id = ev.dataTransfer.getData("text/plain");
                const newShip = document.getElementById(id);
                const targetX = parseInt(ev.currentTarget.dataset.x);
                const targetY = parseInt(ev.currentTarget.dataset.y);
                const shipSize = parseInt(newShip.dataset.size);
                const shipAngle = parseInt(newShip.dataset.angle);

                //don't place is already the drag object parent
                if (newShip.parentElement === ev.currentTarget) {
                    return;
                }
                //Need to loop through all children to check no ship is already here

                //check if ship would be out of bounds on placement
                if (!doesShipFit(targetX, targetY, shipAngle, shipSize, domController.bs.mapSize)) {
                    return
                }

                ev.preventDefault();
                newShip.style.position = "absolute";
                newShip.style.zIndex = "1000";
                ev.target.append(newShip);


                //On place ship -> add ship to the actual map in this position.
                domController.bs.player1.gameboard.addShip(
                    shipSize,
                    newShip.id,
                    targetX,
                    targetY,
                    shipAngle,
                );
            });
        }
        container.dataset.player = player.number;
        container.style.gridTemplateColumns = `repeat(${this.bs.mapSize}, auto)`;
        container.style.gridTemplateRows = `repeat(${this.bs.mapSize}, auto)`;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const el = document.createElement("div");
                el.className = "grid-element";
                el.dataset.x = x;
                el.dataset.y = y;
                el.dataset.player = player.number;
                if (player.number === 1) {
                    setupAsDragTarger(el, this);
                }
                const border = document.createElement("div");
                border.className = "border-element";
                el.appendChild(border);
                if (!playerBoard) {
                    el.addEventListener("click", (e) => {
                        this.registerAttackFromPlayer(e.target, player);
                    });
                }
                container.appendChild(el);
                if (player.gameboard.hasShip(x, y) && playerBoard) {
                    this.#createShipElements(el, player, x, y, false);
                }
            }
        }
    }

    registerAttackFromPlayer(el, player) {
        if (this.bs.activePlayer.type === "cpu") return;

        const attackEffect = this.bs.playerAttack(
            el.dataset.x,
            el.dataset.y,
            player,
        );

        if (attackEffect === player.gameboard.states.hit) {
            this.#setElementToHit(el);
        }
        if (attackEffect === player.gameboard.states.miss) {
            this.#setElementToMiss(el);
        }
        this.revealDestroyedShip(player);
    }

    revealDestroyedShip(player) {
        const gameboardElement = document.querySelector(
            `.gameboard[data-player="${player.number}"]`,
        );
        for (const ship of player.gameboard.ships) {
            if (!ship.sunk) {
                continue;
            }
            for (const { x, y } of ship.coordinates) {
                const boardSquare = gameboardElement.querySelector(
                    `[data-x="${x}"][data-y="${y}"]`,
                );
                this.#createShipElements(boardSquare, player, x, y, true);
                boardSquare.classList.add("destroyed");
            }
        }
    }

    #setElementToMiss(boardSquare) {
        boardSquare.classList.remove("empty");
        const svgContainer = document.createElement("div");
        svgContainer.innerHTML = this.#missSVG;
        svgContainer.className = "svg-container";
        boardSquare.appendChild(svgContainer);
    }

    #setElementToHit(boardSquare) {
        boardSquare.classList.remove("not-hit");
        boardSquare.classList.add("hit");
        const svgContainer = document.createElement("div");
        svgContainer.innerHTML = this.#hitSVG;
        svgContainer.className = "svg-container";
        boardSquare.appendChild(svgContainer);
    }

    registerCPUAttack(x, y, playerNumber, attackEffect, states) {
        const gameboard = findParent(document.querySelectorAll(".gameboard"));

        for (const boardSquare of gameboard.children) {
            if (
                parseInt(boardSquare.dataset.x) === x &&
                parseInt(boardSquare.dataset.y) === y
            ) {
                if (attackEffect === states.hit) {
                    for (const element of boardSquare.children) {
                        if (element.classList.contains("ship")) {
                            this.#setElementToHit(element);
                        }
                    }
                }
                if (attackEffect === states.miss) {
                    this.#setElementToMiss(boardSquare);
                }
                break;
            }
        }

        function findParent(parents) {
            for (const parent of parents) {
                if (parseInt(parent.dataset.player) === playerNumber) {
                    return parent;
                }
            }
        }
    }

    updateGameDetails(round, playerName) {
        document.querySelector(".round-counter").innerText = round;
        document.querySelector(".player-turn").innerText = playerName;
    }

    triggerGameEnd(winner) {
        //show victory popup
        const victoryContainer = document.querySelector(".victory-container");
        victoryContainer.hidden = false;
        victoryContainer.style.display = "flex";
        document.querySelector("#victory").innerText = `${winner}!`;
        //can't use boards anymore
        document.querySelector("#gameboards").style.pointerEvents = "none";
    }

    triggerGameReset() {
        //empty board elements
        document.querySelectorAll(".gameboard").forEach((div) => {
            div.innerHTML = "";
        });
        //hide victory popup
        const victoryElement = document.querySelector(".victory-container");
        victoryElement.hidden = false;
        victoryElement.style.display = "none";
        //reactivate boards
        document.querySelector("#gameboards").style.pointerEvents = "auto";
        document.querySelector("#random_starting_position").hidden = false;
        //setup new game
        this.setupGame();
    }
}
