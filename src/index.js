import "./styles.css" // all css files need to be imported into js

//To import images using JS, import as any file: import odinImage from "./odin.png";

import { Battleships } from "../src/ship.js";
import { DomController } from "../src/domController.js"


const battleship = new Battleships();
new DomController(battleship);




