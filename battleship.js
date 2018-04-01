// set grid rows and columns and the size of each square
var rows = 10;
var cols = 10;
var squareSize = 50;

// get the container element
var gameBoardContainer = document.getElementById("gameboard");

// make the grid columns and rows
for (i = 0; i < cols; i++) {
	for (j = 0; j < rows; j++) {
		
		// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div");
		gameBoardContainer.appendChild(square);

    // give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i;			
		
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;			
		
		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';						
	}
}

/* lazy way of tracking when the game is won: just increment hitCount on every hit
   in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
   there are 17 hits to be made in order to win the game:
      Carrier     - 5 hits
      Battleship  - 4 hits
      Destroyer   - 3 hits
      Submarine   - 3 hits
      Patrol Boat - 2 hits
*/
var hitCount = 0;
var torpedoCount = 0;


/* create the 2d array that will contain the status of each square on the board
   and place ships on the board (later, create function for random placement!)

   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
*/

var gameBoard = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
];

placeShip(2);
placeShip(3);
placeShip(3);
placeShip(4);
placeShip(5);

// set event listener for all elements in gameboard, run fireTorpedo function when square is clicked
gameBoardContainer.addEventListener("click", fireTorpedo, false);

function placeShip(length) {
	var x, y, dir, retry, count=0;
	do {
		count++;
		retry = false;
		dir = Math.floor((Math.random() * 2));
		y = Math.floor((Math.random() * (10-(length-1)*(1-dir))));
		x = Math.floor((Math.random() * (10-(length-1)*dir)));
		for (var i = 0; i<length; i++) {
			if (!isFree(x+i*dir, y+i*(1-dir))) retry = true;
		}
	} while (retry && count<100);
	if (count >= 100) alert("falied to find a place");
	for (i = 0; i<length; i++) {
		console.log(dir, i, x, y, y+i*(1-dir), x+i*dir);
		gameBoard[y+i*(1-dir)][x+i*dir] = 1;
	}
}

function isFree(x, y) {
	for (var i=-1; i<=1; i++) {
		for (var j=-1; j<=1; j++) {
			if (y+j<0 || x+i<0 || y+j>=10 || x+i>=10) continue;
			if (gameBoard[y+j][x+i] == 1) {
				return false;
			}
		}
	}
	return true;
}

function cheat() {
	for (var x = 0; x<10; x++) {
		for (var y = 0; y<10; y++) {
			if (gameBoard[y][x] == 1) {
				var id="s" + y + x;
				document.getElementById(id).style.background = 'red';
			}
		}
	}
}

// initial code via http://www.kirupa.com/html5/handling_events_for_many_elements.htm:
function fireTorpedo(e) {
    // if item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
	if (e.target !== e.currentTarget) {
        // extract row and column # from the HTML element's id
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
		torpedoCount++;
		document.getElementById("torpedoCount").innerHTML = torpedoCount;
        //alert("Clicked on row " + row + ", col " + col);
				
		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard[row][col] == 0) {
			e.target.style.background = '#bbb';
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard[row][col] = 3;
		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoard[row][col] == 1) {
			e.target.style.background = 'red';
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard[row][col] = 2;

			
			// increment hitCount each time a ship is hit
			hitCount++;
			document.getElementById("hitCount").innerHTML = hitCount;
			// this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
			if (hitCount == 17) {
				alert("All enemy battleships have been defeated! You win!");
			}
			
		// if player clicks a square that's been previously hit, let them know
		} else if (gameBoard[row][col] > 1) {
			alert("Stop wasting your torpedos! You already fired at this location.");
		}		
    }
    e.stopPropagation();
}
