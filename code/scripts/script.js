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
		// Contains all room objects
		this.room = [];
		// The number of items in each row of the room array.
		this.roomLayerLength = [0];
		// x and y index for the room array
		this.currentRoom = [0, 0];
	}

	update()
	{
		if (this.room.length > 0)
		{
			this.room[this.currentRoom[0] * this.currentRoom[1]].update();
			this.currentRoom = this.room[this.currentRoom[0] + this.currentRoom[1] * this.roomLayerLength.length].currentRoom;
		}
	}

	addRoom(layer, name = "Room Name", url)
	{
		let offset = 0;
		for (let i = 0; i < layer; i++)
		{
			offset += this.roomLayerLength[i];
		}
		this.room.splice(offset, 0, new Room);
		this.room[offset].name = name;
		this.room[offset].textureURL = url;
		this.room[offset].image.src = this.room[offset].textureURL;
		this.roomLayerLength[layer] += 1;
		// Coordinates for the currently active room in the room array. The first room in the first row would be [0, 0].
		// The third room in the second row would be [1, 2];
		// This prevents a room from switching back to the first room in the room array, as the room objects' currentRoom variable is initialized with 0.
		this.room[offset].currentRoom = [layer, this.roomLayerLength[layer]];
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
		// The buttons this room has.
		this.button = [];
		// The rooms the buttons lead to. Indexed according to the roomManager array of rooms.
		this.buttonTargetRoom = [];
		this.currentRoom = [];
	}

	update()
	{
		//console.log("Room " + this.name + "this.button.length " + this.button.length + "\n");
		// Draw room.
		this.draw();
		// Update buttons of this room.
		let firstClick = false;
		for (let i = 0; i < this.button.length; i++)
		{
			this.button[i].update();

			// If no other button has been clicked before in this tick.
			if (firstClick == false)
			{
				if (this.button[i].isPressed)
				{
					// If the pressed button actually leads to a room.
					if (this.buttonTargetRoom[i] != false)
					{
						this.currentRoom = this.buttonTargetRoom[i];
						firstClick = true;
					}
				}
			}
		}
	}

	addButton(text, target = false, x, y, width = 150, height = 50)
	{
		let i = this.button.length;
		this.button[i] = new Button;
		this.button[i].text = text;
		this.button[i].x = x;
		this.button[i].y = y;
		this.button[i].width = width;
		this.button[i].height = height;
		this.buttonTargetRoom[i] = target;
	}

	handleInput()
	{
	}

	draw()
	{
		// Draw room image
		ctx.drawImage(this.image, this.x, this.y, SCREEN_WIDTH, SCREEN_HEIGHT);
	}

	playAudio()
	{
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
		this.draw();
		this.playAudio();
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
		if (this.isVisible)
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

	playAudio()
	{
		if (this.playSound)
		{
			if (this.isPressed)
			{
				if (audioButtonPressedIsReady) { audioButtonPressed.play(); };
			}
		}
	}
}

let roomManager = new RoomManager;
roomManager.addRoom(0, "Root Room", "textures/roomRoot.png");
roomManager.room[0].addButton("Check left", [1, 0], 50, 50);
roomManager.room[0].addButton("Nothing here", false, SCREEN_WIDTH/2-75, 50);
roomManager.room[0].addButton("Check right", false, SCREEN_WIDTH-200, 50);

//roomManager.addRoom(0, "Another Root Room", "textures/roomRoot.png");

roomManager.addRoom(1, "Left Corridor", "textures/roomRootLeftCorridor.png");



let player = new Player;

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

	roomManager.update();
}

// Start the game loop
main();