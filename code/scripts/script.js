/* Program: script.js
 * Programmer: Leonard Michel
 * Start Date: 07.08.2021
 * Last Change:
 * End Date: /
 * License: /
 * Version: 0.0.0.0
*/

/**** INITIALIZATION ****/

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

let mouseX = 0;
let mouseY = 0;
let mouseLeftPressed = false,
    mouseRightPressed = false;

let mouseLeftPressedBefore = false,
    mouseRightPressedBefore = false;

/* Audio Object Definitions */
let audioButtonPressed = new Audio("audio/audioButtonPressed.mp3");
let audioButtonPressedIsReady = false;
audioButtonPressed.addEventListener("canplaythrough", function () { audioButtonPressedIsReady = true; });

/* Input Handler Definitions */
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

function mouseMoveHandler(e)
{
    //console.log("Mouse moved.\n");
    mouseX = e.clientX;
    mouseY = e.clientY;

    //console.log("MouseX: " + mouseX + "\n" + "MouseY: " + mouseY + "\n");
}

function mouseDownHandler(e)
{
    //console.log("Mouse pressed.\n");
    if (e.button == 0) { mouseLeftPressed = true; };
    if (e.button == 2) { mouseRightPressed = true; };
}

function mouseUpHandler(e)
{
    //console.log("Mouse released.\n");
    if (e.button == 0) { mouseLeftPressed = false; };
    if (e.button == 2) { mouseRightPressed = false; };
}

class Menu
{
	constructor()
	{
		this.item = [new Button, new Button, new Button];
	}
}

class Player
{
	constructor()
	{
		this.currentRoom = 0;
	}
}

class RoomManager
{
	constructor()
	{
		this.room = [];
		this.roomButton = [];
		this.currentRoom = 0;
	}
}

class Room
{
	constructor()
	{
		this.name = "Room Name";
		this.textureURL = "textures/notexture.png";
		this.image = new Image();
		this.image.src = this.textureURL;
		this.x = 0;
		this.y = 0;
		// Which room leads to this room.
		this.parentRoom = 0;
		// References any rooms that this room leads to.
		this.childRoom = [];
		// Which button leads to a specified room.
		this.childRoomButton = [];
		// Holds the index for the childRoom array.
		this.currentRoom = -1;
	}

	update()
	{
		this.handleInput();
		this.draw();
	}

	handleInput()
	{
		for (let i = 0; i < this.childRoomButton.length; i++)
		{
			this.childRoomButton[i].update();
			if (this.childRoomButton[i].isPressed)
			{
				this.currentRoom = i;
			}
		}
	}

	draw()
	{
		if (this.currentRoom != -1)
		{
			ctx.drawImage(this.childRoom[this.currentRoom].image, this.x, this.y, SCREEN_WIDTH, SCREEN_HEIGHT);
			// Draw all buttons that lead to the next rooms.
			for (let i = 0; i < this.childRoom[this.currentRoom].childRoomButton.length; i++)
			{
				this.childRoom[this.currentRoom].childRoomButton[i].update();
			}
		}
	}
}

class Button
{
	constructor()
	{
        this.x = 0;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        // Colors
        this.colEdgeNeutral = "#888888";
        this.colFaceNeutral = "#00000044";
        this.colEdgeHover = "#bbbbbb";
        this.colFaceHover = "#00000088";
        this.colEdgePressed = "#ffffff";
        this.colFacePressed = "#000000bb";
        this.colTextFill = "#000000";
        this.colTextShadow = "#ffffff";
        // Color assignment
        this.edgeColor = this.colEdgeNeutral;
        this.faceColor = this.colFaceNeutral;

        this.text = "Button";
        this.isPressed = false;
        this.isVisible = true;
		this.playSound = true;
        // How often can the user click the button.
        this.clickSpeed = 50;
        this.clickTick = Date.now();
	}

    update()
    {
        this.collisionDetection();
        if (this.isVisible)
        {
            this.draw();
        }
		if (this.playSound)
		{
			if (this.isPressed)
			{
				if (audioButtonPressedIsReady) { audioButtonPressed.play(); };
			}
		}
    }

    collisionDetection()
    {
        // Only let the user click the button if the wait time has been passed
        if (tp1 - this.clickTick >= this.clickSpeed)
        {
            // If mouse is within button bounds.
            if (mouseX >= this.x && mouseX < this.x + this.width && mouseY >= this.y && mouseY < this.y + this.width)
            {
                // If mouse clicked on button
                if (mouseLeftPressed)
                {
                    if (mouseLeftPressedBefore == false)
                    {
                        this.edgeColor = this.colEdgePressed;
                        this.faceColor = this.colFacePressed;

                        this.isPressed = true;
                        mouseLeftPressedBefore = true;
                    }
                }
                // If mouse is hovering on button
                if (!mouseLeftPressed)
                {
                    this.edgeColor = this.colEdgeHover;
                    this.faceColor = this.colFaceHover;

                    this.isPressed = false;
                    mouseLeftPressedBefore = false;
                }
            }
            // If mouse is out of button bounds.
            else
            {
                this.edgeColor = this.colEdgeNeutral;
                this.faceColor = this.colFaceNeutral;

                this.isPressed = false;
            }

            this.clickTick = Date.now();
        }
    }

    draw()
    {
        // Draw fill
        ctx.fillStyle = this.faceColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw border
        ctx.strokeStyle = this.edgeColor;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw text
        let textPosX = this.x + (this.width / 2),
            textPosY = this.y + (this.height / 1.5),
            textSize = this.height/1.5;

        ctx.textAlign = "center";
        ctx.font = this.height / 2 + "px sans-serif";

        // Text shadow
        ctx.fillStyle = this.colTextShadow;
        ctx.fillText(this.text, textPosX + textSize/128, textPosY + textSize/128);

        // Actual text
        ctx.fillStyle = this.colTextFill;
        ctx.fillText(this.text, textPosX, textPosY);

    }
}

// Create root room and assign subrooms as well as buttons to it.
let rootRoom = new Room;
rootRoom.childRoom = [rootRoom, new Room, new Room, new Room];
rootRoom.childRoomButton = [0, new Button, new Button, new Button];
// Left corridor
rootRoom.childRoomButton[1].text = "Check left";
rootRoom.childRoomButton[1].x = 50;
rootRoom.childRoomButton[1].y = 50;
rootRoom.childRoom[1].textureURL = "textures/rootRoomLeftCorridor.png";
rootRoom.childRoom[1].image.src = rootRoom.childRoomButton[1].textureURL;
// Right corridor
rootRoom.childRoomButton[3].text = "Check right";
rootRoom.childRoomButton[3].x = SCREEN_WIDTH-50;
rootRoom.childRoomButton[3].y = 50;
rootRoom.childRoom[3].textureURL = "textures/rootRoomRightCorridor.png";
rootRoom.childRoom[3].image.src = rootRoom.childRoomButton[3].textureURL;



let player = new Player;
player.currentRoom = rootRoom;

// Time variables
let tp1 = Date.now();
let tp2 = Date.now();
let elapsedTime = 0;

// The game loop
window.main = function ()
{
    window.requestAnimationFrame(main);
    // Get elapsed time for last tick.
    tp2 = Date.now();
    elapsedTime = tp2 - tp1;
    //console.log("elapsedTime:" + elapsedTime + "\n");
    tp1 = tp2;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	rootRoom.update();
}

// Start the game loop
main();