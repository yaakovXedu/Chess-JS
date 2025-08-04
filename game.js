//defining constants
const row_index = {
    black_back : 0,
    black_pawn : 1,
    white_pawn : 6,
    white_back : 7
}
const board = document.getElementById("board");
const columns =  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
const boardArr = rows.map(row => columns.map(col => col + row));
const players = { current: "white", opponent: "black"};

/*
function creates the basic board without the pieces
 */
function createBoard(){
    //clear the board
    board.innerHTML = "";
    //create 8 rows
    for (let i = 8; i > 0; i--)
    {
        //create row element
        const current_tr = document.createElement("tr");
        current_tr.id = `row-${i}`;
        current_tr.classList.add("row");

        //create 8 cells in each row
        for (let j = 0; j < 8; j++)
        {
            //create cell element and add properties accordingly
            const current_td = document.createElement("td");
            current_td.id = columns[j] + i;
            current_td.classList.add("cell");
            current_td.classList.add((i + j) % 2 === 0 ? "light" : "dark");
            current_td.innerHTML = `<img draggable="false" src="Assets/null.svg" role="empty" alt="piece">`;
            current_tr.appendChild(current_td);
        }
        //add the row to the board
        board.appendChild(current_tr);
    }
}
/*
function creates the pieces and places them
 */
function createSprites()  {
    //defining
    const back_row = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

//black back row
    for (let i = 0; i < 8; i++) {
        let id = boardArr[row_index.black_back][i]
        const piece = document.getElementById(id).querySelector('img');
        piece.src = "Assets/" + back_row[i] + "_b.svg";
        piece.role = (back_row[i]);
    }
//black pawn row
    for (let i = 0; i < 8; i++) {
        let id = boardArr[row_index.black_pawn][i];
        const piece = document.getElementById(id).querySelector('img');
        piece.src = "Assets/pawn_b.svg";
        piece.role = ("pawn");
    }
//white pawn row
    for (let i = 0; i < 8; i++) {
        let id = boardArr[row_index.white_pawn][i];
        const piece = document.getElementById(id).querySelector('img');
        piece.src = "Assets/pawn_w.svg";
        piece.role = ("pawn");
    }
//white back row
    let j = 8;
    for (let i = 0; i < 8; i++) {
        j--;
        let id = boardArr[row_index.white_back][i]
        const piece = document.getElementById(id).querySelector('img');
        piece.src = "Assets/" + back_row[j] + "_w.svg";
        piece.role = (back_row[j]);
    }

    document.querySelectorAll('img[src*="_b"]').forEach(img => {
        img.classList.add('black-sprite');
    });
    document.querySelectorAll('img[src*="_w"]').forEach(img => {
        img.classList.add('white-sprite');
    });

}

/*
function swaps the turn:
- current player
- header color
- pieces selectability
and removes highlight on possible options
 */
function swapTurns(){
    //remove highlighted cells
    removeHighlight();

    //swap colors
    [players.current, players.opponent] = [players.opponent, players.current];

    //change the color of the header to the current player color
    document.querySelector("header").style.color = players.current;

    //swap selectability
    spritesUnselectable(`.${players.opponent}-sprite`);
    spritesSelectable(`.${players.current}-sprite`);
}

/*
handler for the event listeners
 */
function handleSelectCell() {
    selectCell(this.parentElement);
}
/*
function get and object and makes every element with the id in the object unselectable
 */
function spritesUnselectable(object){
    document.querySelectorAll(object).forEach(sprite => {
        sprite.removeEventListener("click", handleSelectCell);
        sprite.classList.remove("selectable");
    });
}
/*
function get and object and makes every element with the id in the object selectable
 */
function spritesSelectable(object) {
    document.querySelectorAll(object).forEach(sprite => {
        sprite.addEventListener("click", handleSelectCell);
        sprite.classList.add("selectable");
    });
}

/*
function removes all the highlights of previously available options
 */
function removeHighlight() {
    //delete the previous move options circles
    const move_options = document.querySelectorAll(".move-option");
    if (move_options) move_options.forEach(option => { //delete if elements exist
        option.remove();
    });
    //remove the highlight from the previous attack options
    const attack_options = document.querySelectorAll(".attack-option");
    if (attack_options) attack_options.forEach(option =>{
        option.classList.remove("attack-option");
    });
}
/*
function highlights the possible move options and attack options
 */
function highlightCells(option_list) {

    //add the visuals to the available options
    option_list.forEach(id => {
        //select cell
        const cell = document.getElementById(id);
        //create the circle for the move options
        const move_option = document.createElement('div');
        move_option.style.backgroundColor = players.current;
        move_option.classList.add('move-option');

        //add circle to move options
        if (cell.querySelector("img").role === "empty") cell.append(move_option);
        //highlight attack options
        else cell.classList.add("attack-option");
    });
}

/*
function filters out the options that are out of the board
*/
function checkLegalBounds(option_list){
    let filtered_options = [];

    option_list.forEach(option => {
        const id = columns[option[1]] +  rows[option[0]];
        //if within board bounds add to list
        if (option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7)
        {
            filtered_options.push(id);
        }
    });
    return filtered_options;
}

function isEmpty(cell){  return cell.querySelector("img").role == "empty"}



function swapPieces(src_cell, dest_cell) {
    // Get the <img> elements from the source and destination cells
    const src_img = src_cell.querySelector("img");
    const dest_img = dest_cell.querySelector("img");

    // Swap the src, role, and className attributes of the <img> elements
    [src_img.src, dest_img.src] = [dest_img.src, src_img.src];
    [src_img.role, dest_img.role] = [dest_img.role, src_img.role];
    [src_img.className, dest_img.className] = [dest_img.className, src_img.className];
}
function eatPiece(src_cell, dest_cell) {
    // Get the <img> element of the destination cell (opponent's piece)
    const dest_img = dest_cell.querySelector("img");

    // Remove the opponent's piece by setting it to an empty state
    dest_img.src = "Assets/null.svg"; // Replace with the path to your empty cell image
    dest_img.role = "empty";
    dest_img.className = ""; // Clear any classes (e.g., sprite classes)

    // Move the piece from the source cell to the destination cell
    swapPieces(src_cell, dest_cell);
}

function moveToCell(src_cell, dest_cell) {
    const piece = src_cell.querySelector("img");

    if (isEmpty(dest_cell))
        swapPieces(src_cell, dest_cell);
    else 
        eatPiece(src_cell, dest_cell);

    if (isKingUnderAttack(players.opponent)) {
    console.log(`${players.opponent} king is under attack!`);
    }
}
function waitForMove(src_cell, options) {
    return new Promise((resolve) => {
        function handleMoveToCell(event) {
            const dest_cell = event.currentTarget; // The cell that was clicked
            options.forEach(id => {
                const cell = document.getElementById(id);
                cell.removeEventListener('click', handleMoveToCell); // Remove listeners after move
            });
            resolve(dest_cell); // Resolve the promise with the destination cell
        }

        options.forEach(id => {
            const cell = document.getElementById(id);
            cell.addEventListener('click', handleMoveToCell);
        });
    });
}

/* function highlights clicked cell and available moves for it */
async function selectCell(src_cell) {
    // Remove highlight from previously selected cell
    const selected = document.querySelector(".selected");
    if (selected) selected.classList.remove("selected");

    const piece = src_cell.querySelector("img");

    // Add highlight to the clicked cell
    src_cell.classList.toggle("selected");

    // Find available moves
    const available_moves = calcAvailableMoves(piece.role, src_cell.id);
    if (!available_moves){ console.log("Stalemate!"); return;}
    // Highlight the available moves
    highlightCells(available_moves);

    // Wait for the player to select a destination cell
    const dest_cell = await waitForMove(src_cell, available_moves);

    console.log(`${src_cell.id} -> ${dest_cell.id}`);

    // Call moveToCell to move the piece
    moveToCell(src_cell, dest_cell);

    // Swap turns after the move
    swapTurns();
}

// Function to check if the king is under attack
function isKingUnderAttack(color) {
    const pieces = document.querySelectorAll(`.${players.current}-sprite`);
    const kingID = document.querySelector(`.${color}-sprite[role="king"]`).parentElement.id;

    pieces.forEach(piece => {
        const type = piece.role;
        const location = piece.parentElement.id;
        const moves = calcAvailableMoves(type, location);
        moves.forEach(optionID => {
            if (optionID == kingID) return true;
        });
    });

    return false;
}

function calcAvailableMoves(piece_type, src_location){
    //remove previous highlighted possible cells
    removeHighlight();

    let options = [];
    let y = boardArr.findIndex(row => row.includes(src_location));
    let x = y !== -1 ? boardArr[y].indexOf(src_location) : -1;

    //get initial possible moves according to the piece
    switch (piece_type) {
        case "pawn":
        {
            options = pawnMove(x, y, players.current);
        }break;

        case "rook":
        {
            options = rookMove(x, y);
        }break;

        case "knight":
        {
            options = knightMove(x, y);
        }break;

        case "bishop":
        {
            options = bishopMove(x, y);
        }break;

        case "queen":
        {
            options = [...rookMove(x, y), ...bishopMove(x, y)];
        }break;

        case "king":
        {
            options = kingMove(x, y);
        } break;

    }
    console.log("raw: ", options)
    options = checkLegalBounds(options);
    console.log("converted: ",options);

    return options;
}

/*
algorithms for the pieces moves
 */
function kingMove(x, y) {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1],     // rook-like moves
        [1, 1], [-1, 1], [1, -1], [-1, -1]     // bishop-like moves
    ];

    let options = [];

    directions.forEach(dir => {
        const [dx, dy] = dir;
        const i = y + dy;
        const j = x + dx;

        if (i >= 0 && i < 8 && j >= 0 && j < 8) {
            const cell = document.getElementById(boardArr[i][j]).querySelector("img");
            if (!cell.classList.contains(players.current + "-sprite")) {
                options.push([i, j]);
            }
        }
    });

    return options;
}
function pawnMove(x, y, color){
    let all_options = [];
    let directions;
    let dy;

    switch (color) {
        case "white":
        {
            directions = [[-1, -1], [1, -1]];
            dy = -1;
        }
        break;
        case "black":
        {
            directions = [[1 , 1], [-1, 1]];
            dy = 1;
        }
        break;
    }


    //check if next cell is available
    let cell =  document.getElementById(boardArr[y + dy][x]).querySelector("img");
    if (cell.role === "empty")
    {
        //add cell
        all_options.push([y + dy, x]);

        //if it is in the pawn row and the cell is empty then add
        cell = document.getElementById(boardArr[y + dy + dy][x]);
        if (cell != null) {
            cell = cell.querySelector("img")
            if (y === row_index.white_pawn || y === row_index.black_pawn && cell.role === "empty") {
            all_options.push([y + dy + dy, x]);
            }
        }
    }

    //add attack moves
    const attack_moves = checkCloseAttack(x, y, directions);
    if(attack_moves.length > 0) all_options.push(...attack_moves);


    //check for double move on first pawn move if the first cell is available
    return all_options;
}
function knightMove(x, y) {
    const moves = [
        [2, 1], [2, -1],
        [-2, 1], [-2, -1],
        [1, 2], [1, -2],
        [-1, 2], [-1, -2]
    ];
    let options = [];

    moves.forEach((move) => {
        const [dx, dy] = move;
        const i = y + dy;
        const j = x + dx;
        //check legal bounds
        if (!(i > 7 || j > 7 || i < 0 || j < 0)) {
            const cell = document.getElementById(boardArr[i][j]).querySelector("img");
            if (!cell.classList.contains(players.current + "-sprite")) {
                options.push([i, j]);
            }
        }
    });

    // for (let i = 0; i < 8; i++)
    // {
    //     all_options.push([y + offset[i][0], x + offset[i][1]]);
    // }
    return options;
}
function rookMove(x, y) {
    let directions =  [
        [1,0],  //  →
        [-1,0], //  ←
        [0,1],  //  ↑
        [0,-1]  //  ↓
    ];
    return slideMove(x, y, directions);
}
function bishopMove(x, y){
    let directions = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1,-1]
    ];
    return slideMove(x, y, directions);
}

function checkCloseAttack(x, y, directions){
    let options = [];
    directions.forEach(dir => {
        // continue in each direction
        let [dx, dy] = dir;
        let i = y + dy;
        let j = x + dx;

        const cell = document.getElementById(boardArr[i][j]);


        //add cell as option only if it has an enemy piece
        if (cell != null) {
            if (cell.querySelector("img").classList.contains(players.opponent+"-sprite")) {
                options.push([i, j]);
            }
        }
    });
    return options;
}
function slideMove(x, y, directions){
    let options = [];

    // go over each direction
    directions.forEach(dir => {
        //coordinates of directions
        let [dx, dy] = dir;
        //add the directions to the current position
        let i = y + dy;
        let j = x + dx;

        //move in the direction within the board bounds
        while (i >= 0 && i < 8 && j >= 0 && j < 8) {
            //select the element of the square on the board to check
            const cell = document.getElementById(boardArr[i][j]).querySelector('img');

            //cell has a piece of the same color stop looping direction before adding
            if(cell.classList.contains(players.current+"-sprite")) break;

            options.push([i, j]);

            //cell has a piece of the opp color stop looping direction after adding
            if(cell.classList.contains(players.opponent+"-sprite")) break;

            // Move to the next cell in the same direction
            i += dy;
            j += dx;
        }
    });

    return options;
}



function main(){
    //initial setup
    createBoard();
    createSprites();
    swapTurns();
    swapTurns();
}


main();