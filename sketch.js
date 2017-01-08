/*Maayan Albert 
 */

//global settings so that everything can be easily tweaked

//general settings
var ideateColor = [99, 75, 90, 255]
var smallText = [214, 113, 89, 255]
var numMessages 
var numSkills 
var numViews 

var activeMode = false
var activities = [0, 1, 2]
var activityRate = 5
var activityCount = 0

var dotArray = [];
var numOfCol=25;
var numOfRow=15;
var sizeOfDot = 5;
var spaceBetweenDots = 40;
var dotColor = [77, 77, 77, 50]
var backgroundColor = [16, 19, 32, 255]
var margin = 300

//message settings
var messageSpeed = .85
var messageArray = [];
var messageColor = [249, 199, 201]
var numLinksInMessage = 5
var messages = []
var sizeOfMessage = spaceBetweenDots/2
var numJumps = 2

//view settigns
var viewColor = [240, 105, 81, 255]
var viewMaxSize = spaceBetweenDots * 1.5
var viewThinStroke = 1.5
var viewRow = -1
var viewCol = -1
var viewSpeed = .95
var pause = 7
var views = []

//skill settings
var skills = []
var skillColor = [241, 115, 172, 255]
var skillWidth = spaceBetweenDots/4
var skillSpeed = .9
var numLines = 2
var lineLength = spaceBetweenDots 

//font variables
var taz
var din
var silom
var helvetica

//loads the fonts
function preloadFonts() {
  	din = loadFont('din1.otf');
	taz = loadFont('taz1.otf');
	silom = loadFont('Silom.ttf')
	helvetica = loadFont('HelveticaNeue.dfont')
}

function setup() {
	frameRate(50)
	preloadFonts()

    //randomly set the numbers next to the names of the activities
	numMessages = round(random(100, 300))
	numSkills = round(random(100, 300))
	numViews = round(random(100, 300))

    createCanvas(1920, 1080);
    strokeWeight(0)

    //creates the grid of dots
    for(var r=0; r<numOfRow; r++){
    	for(var c=0; c<numOfCol; c++){
    		var xx = margin + c*spaceBetweenDots;
    		var yy= margin + r*spaceBetweenDots;
    		if((r + c) % 2 == 0){
    			var testForMessage = true
    		}
    		if((r + c) %2 == 1){
    			var testForMessage = false
    		}
    		var aDot = new DotMaker(xx,yy,sizeOfDot, r,c, testForMessage);
    		dotArray.push(aDot);
    	}
    }
}

function draw() {
	background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
	drawWords()

	//sets items to draw randomly if the active mode is on
    if(activeMode){
		activityCount += 1
		if(activityCount >= activityRate){
			activityCount = 0
            //randomly selects a number and passes it into activeModeOn
			index = round(random(activities.length -1))
			activeModeOn(index)
		}
	}

    //draws the dots that make up the grid
	for (var i=0; i<dotArray.length; i++){
		dotArray[i].draw(i);
	}

    //draws messages sent animaition
	if(messages.length > 0){
		for(k = 0; k < messages.length; k++){
			messages[k].move()
			messages[k].draw()
			if(messages[k].fillStatus == 2){
				messages.splice(k, 1)
			}
		}
	}

    //draws skills learned animation
	if(skills.length > 0){
		for(k = 0; k < skills.length; k++){
			skills[k].upDateLines()
			skills[k].drawLines()
			if(round(skills[k].linesCurrent[0]) == round(skills[k].linesEnd)&&
			skills[k].lineStatus == 2){
				skills.splice(k,1)
			}		
		}
	}

    //draws projects viewed animation
	if(views.length > 0){3
		for(k = 0; k < views.length; k++){
			views[k].setDimensions()
			views[k].draw()

			if(views[k].viewStatus == 2 && 
				round(views[k].currentStroke) == round(views[k].baseLineStroke)){
				views.splice(k,1)		
			}
		}
	}
}

//draws items randomly to simulate program picking up data from website
function activeModeOn(index){
    //depending on what number is passed in, it draws an animation
	if(index == 0){
		numMessages += 1
		startMessageIndex = round(random(0, dotArray.length -1))
		startingDotX = dotArray[startMessageIndex].x
		startingDotY = dotArray[startMessageIndex].y
		endMessageIndex = round(random(0, dotArray.length -1)) 
		endX = dotArray[endMessageIndex].x
		endY = dotArray[endMessageIndex].y
        //if the ending point is the same as the starting point, the ending 
        //point will loop through this while loop until it is different 
		while(endX == startingDotX || endY == startingDotY || 
				dotArray[endMessageIndex].testForMessage != dotArray[startMessageIndex].testForMessage){
				endMessageIndex = round(random(0, dotArray.length - 1))
				endX = dotArray[endMessageIndex].x
				endY = dotArray[endMessageIndex].y
		}
		newMessage = new messageMaker(startingDotX, startingDotY, endX, endY, startMessageIndex, endMessageIndex)
		newMessage.create()
		messages.push(newMessage)
		lastMessage = messages.length - 1

	}else if(index == 1){
		numViews += 1
		posInDotArray = round(random(0, dotArray.length -1))
		newView = new viewMaker(posInDotArray)
		views.push(newView)

	}else if(index == 2){
		numSkills += 1
		posInDotArray = round(random(0, dotArray.length -1))
		newSkill = new skillMaker(posInDotArray)
		skills.push(newSkill)
	}
}

//activeMode is turned on when mouse is pressed
function mousePressed(){
	if(activeMode){
		activeMode = false
	}else{
		activeMode = true
	}
}

//draws the words
function drawWords(){
	centerX = margin + numOfCol * spaceBetweenDots/2
	centerY = margin + numOfRow * spaceBetweenDots/2 + spaceBetweenDots * 1.5

	textFont(din)
	textSize(spaceBetweenDots * 5.5)
	textAlign(CENTER, BOTTOM)
	fill(ideateColor)
	text('IDeATe', centerX, centerY)
	widthOFIdeate = textWidth('IDeATe')

	textSize(spaceBetweenDots * .9)
	textAlign(LEFT, TOP)
	fill(skillColor)
	text(str(numSkills), centerX - widthOFIdeate/2 + spaceBetweenDots/4, centerY - spaceBetweenDots*4/8)
	widthOfNumSkills = textWidth(str(numSkills)) + spaceBetweenDots/4

	textFont(taz)
	textSize(spaceBetweenDots * .4)
	fill(smallText)
	textAlign(LEFT, TOP)
	text('tools learned', centerX - widthOFIdeate/2 + widthOfNumSkills + spaceBetweenDots/8, centerY + spaceBetweenDots*1/8)

	//
	textAlign(LEFT, TOP)
	widthViewsText = textWidth('projects viewed')
	text('projects viewed', centerX +spaceBetweenDots/16 - spaceBetweenDots*7/8, centerY + spaceBetweenDots*1/8)

	//
	textFont(din)
	textAlign(RIGHT, TOP)
	fill(viewColor)
	textSize(spaceBetweenDots * .9)
	widthOfNumViews = textWidth(str(numViews)) + spaceBetweenDots/8
	text(str(numViews), centerX - spaceBetweenDots/16 - spaceBetweenDots*7/8, centerY - spaceBetweenDots*4/8)

	textFont(taz)
	textSize(spaceBetweenDots * .4)
	fill(smallText)
	textAlign(RIGHT, TOP)
	text('messages sent', centerX + widthOFIdeate/2, centerY + spaceBetweenDots*1/8)
	widthMessageText = textWidth('messages sent') + spaceBetweenDots/4

	textFont(din)
	textSize(spaceBetweenDots * .9)
	textAlign(RIGHT, TOP)
	fill(MessageColor)
	text(str(numMessages), centerX + widthOFIdeate/2 - widthMessageText + spaceBetweenDots/8, centerY - spaceBetweenDots*4/8)
	widthOfNumMessages = textWidth(str(numMessages)) 
}

function keyPressed(){
    //if the number key '3', is pressed, a messages sent animation is drawn
	if(keyCode == 51){
		numMessages += 1
		startMessageIndex = round(random(0, dotArray.length -1))
		startingDotX = dotArray[startMessageIndex].x
		startingDotY = dotArray[startMessageIndex].y
		endMessageIndex = round(random(0, dotArray.length -1)) 
		endX = dotArray[endMessageIndex].x
		endY = dotArray[endMessageIndex].y
		while(endX == startingDotX || endY == startingDotY || 
				dotArray[endMessageIndex].testForMessage != dotArray[startMessageIndex].testForMessage){
				endMessageIndex = round(random(0, dotArray.length - 1))
				endX = dotArray[endMessageIndex].x
				endY = dotArray[endMessageIndex].y
		}
		newMessage = new messageMaker(startingDotX, startingDotY, endX, endY, startMessageIndex, endMessageIndex)
		newMessage.create()
		messages.push(newMessage)
		lastMessage = messages.length - 1
    
    //if the number key '2', is pressed, a projects viewed animation is drawn
	}else if(keyCode == 50){
		numViews += 1
		posInDotArray = round(random(0, dotArray.length -1))
		newView = new viewMaker(posInDotArray)
		views.push(newView)
    
    //if the number key '1', is pressed, a skills learned animation is drawn
	}else if(keyCode == 49){
		numSkills += 1
		posInDotArray = round(random(0, dotArray.length -1))

		newSkill = new skillMaker(posInDotArray)
		skills.push(newSkill)
	
    //if the shift key is pressed, randomly set the numbers next to the names 
    //of the activities
    }else if(keyCode == 16){
		numMessages = round(random(100, 300))
		numSkills = round(random(100, 300))
		numViews = round(random(100, 300))
	}
}

//makes skills learned animation
function skillMaker(posInDotArray){
	this.originX = dotArray[posInDotArray].x
	this.originY = dotArray[posInDotArray].y
	this.dirs = [[ -1, 'vert'], [1, 'horiz'], [-1, 'horiz'], [1,'vert']]
    //randomly chooses a direction for lines
	this.direction = this.dirs[round(random(0, this.dirs.length -1))]
	this.lineStatus = 1
	this.linesConstant = []
	this.linesStart = null
	this.linesEnd = null
	this.linesCurrent = null
    //sets up lines based on the chosen direction
	for(lineInd = 0; lineInd < numLines; lineInd ++){
		if(this.direction[1] == 'vert'){
			this.linesConstant.push(this.originX +lineInd * spaceBetweenDots)
			this.linesStart = this.originY
			this.linesEnd = this.originY + lineLength * this.direction[0]
			this.linesCurrent = [this.originY, this.originY]
		}
		if(this.direction[1] == 'horiz'){
			this.linesConstant.push(this.originY + lineInd * spaceBetweenDots)
			this.linesStart = this.originX
			this.linesEnd = this.originX + lineLength * this.direction[0]
			this.linesCurrent = [this.originX, this.originX]
		}
	}

    //changes the length of the lines based on their current status
	this.upDateLines = function(){
			if(this.lineStatus == 1){
				this.linesCurrent[1] = this.linesCurrent[1] * skillSpeed + this.linesEnd * (1- skillSpeed)
			}
			if(round(this.linesCurrent[1]) == round(this.linesEnd)){
				this.lineStatus = 2
			}
			if(this.lineStatus == 2){
				this.linesCurrent[0] = this.linesCurrent[0] * skillSpeed + this.linesEnd * (1- skillSpeed)
			}		
	}

    //draws the lines
	this.drawLines = function(){
		colorConverter = map(abs(this.linesCurrent[0] - this.linesEnd),
			0, lineLength, 0, 1)
		//calculates color based on line's current location
        stroke(skillColor[0] * colorConverter + dotColor[0] *(1- colorConverter),
			skillColor[1] * colorConverter + dotColor[1] *(1- colorConverter),
			skillColor[2] * colorConverter + dotColor[2] *(1- colorConverter),
			skillColor[3] * colorConverter + 0 *(1- colorConverter))
		strokeCap(ROUND);
		strokeWeight(skillWidth)
		for(i = 0; i < numLines; i ++){
			if(this.direction[1] == 'vert'){
				line(this.linesConstant[i], this.linesCurrent[0], this.linesConstant[i], this.linesCurrent[1])
			}else if(this.direction[1] == 'horiz'){
				line(this.linesCurrent[0], this.linesConstant[i], this.linesCurrent[1], this.linesConstant[i])
			}
		}		

	} 

}

//draws projects viewed animation
function viewMaker(posInDotArray){
	this.posInDotArray = posInDotArray
	this.xLoc = dotArray[this.posInDotArray].x
	this.yLoc = dotArray[this.posInDotArray].y
	this.baseLineStroke = sizeOfDot
	this.baseLineSize = 0
	this.currentSize = this.baseLineSize
	this.viewStatus = 1
	this.currentStroke = this.baseLineStroke
	this.pauseCount = 0

	//updates the circle's size and color
    this.setDimensions = function(){
		if(this.viewStatus == 1){
			this.currentStroke = this.currentStroke*viewSpeed + viewThinStroke*(1-viewSpeed)
			this.currentSize = this.currentSize*viewSpeed + viewMaxSize*(1-viewSpeed)
		}else if(this.viewStatus == 2){
			this.currentStroke = this.currentStroke*viewSpeed + this.baseLineStroke*(1-viewSpeed)
			this.currentSize = this.currentSize*viewSpeed + (this.baseLineSize)*(1-viewSpeed )
		}
		stroke(viewColor[0], viewColor[1], viewColor[2])
		strokeWeight(this.currentStroke)
		colorFactor = this.currentStroke
		colorFactor = map(this.currentStroke,this.baseLineStroke, viewThinStroke, 0, 2)
		stroke(viewColor[0] * colorFactor + dotColor[0] *(1- colorFactor),
			viewColor[1] * colorFactor + dotColor[1] *(1- colorFactor),
			viewColor[2] * colorFactor + dotColor[2] *(1- colorFactor),
			viewColor[3] * colorFactor + 0 *(1- colorFactor))
		fill(backgroundColor[0], backgroundColor[1], backgroundColor[2], 0)
		if(this.viewStatus == 1 && 
			round(this.currentStroke) == round(viewThinStroke )){
				this.viewStatus = 0
		}
		if(this.viewStatus == 0){
			this.pauseCount += 1
		}
		if(this.pauseCount == pause){
			this.viewStatus = 2
		}
	}

    //draws animation
	this.draw = function(){
		sizeToDraw = this.currentSize
		if(dotArray[this.posInDotArray].size > sizeToDraw){
			sizeToDraw = dotArray[this.posInDotArray].size
		}
		ellipse(this.xLoc, this.yLoc, sizeToDraw, sizeToDraw)
	}
}

//makes messages sent animation
function messageMaker(startingDotX, startingDotY, endX, endY, startMessageIndex, 
    endMessageIndex){
	this.startx = startingDotX;
	this.starty = startingDotY;
	this.endX = endX
	this.endY = endY
	this.listOfLinks = []
	this.newPosX = this.startx
	this.newPosY = this.starty
	this.tempTargetX = this.startx
	this.tempTargetY = this.starty
	this.forBiddenDir = []
	this.dirs = [[-1, -1, 'diag1'], [1, -1, 'diag2'],
				 [-1, 1, 'diag2'], [1, 1, 'diag1']]
	this.highlightedDots = [startMessageIndex]
	this.counter = 0
	this.done = false
	this.fillStatus = 1
	this.fillValue = 1
	this.sizeToDraw = sizeOfMessage
	
    // creates a new animation
    this.create = function(){
        //creates an array made up of links to comprise the animation
		for(i = 0; i < numLinksInMessage; i++){
			newLink = new messageLinkMaker(this.startx, this.starty, sizeOfMessage)
			this.listOfLinks.push(newLink)
		}
	}

    //draws the animation
	this.draw = function(){
		for(j = 0;j < this.highlightedDots.length; j++){
			selectedDot = this.highlightedDots[j]
        for(i = 0; i < this.listOfLinks.length; i++){
			if(i != this.listOfLinks.length -1 && this.fillStatus ==1){
				fill(messageColor[0], messageColor[1], messageColor[2], 75 *i)						
			} else if(this.fillStatus == 3){
		        colorConverter = map(abs(this.newPosX - this.tempTargetX),
					0, spaceBetweenDots, 0, 1)
                //sets the color
			    fill(messageColor[0] * colorConverter + dotColor[0] *(1- colorConverter),
				    messageColor[1] * colorConverter + dotColor[1] *(1- colorConverter),
					messageColor[2] * colorConverter + dotColor[2] *(1- colorConverter),
					100 * colorConverter + 0 *(1- colorConverter))
				}
					//draws all of the links in the array
                    this.listOfLinks[i].draw()
			}
			ellipse(dotArray[selectedDot].x, dotArray[selectedDot].y, this.sizeToDraw, this.sizeToDraw)
			if(this.highlightedDots.length > 1){
				this.highlightedDots.shift()
			}		
		}		
		if(round(this.listOfLinks[0].posX) == this.endX && 
				round(this.listOfLinks[0].posY) == this.endY){
				this.fillStatus = 2
		}if(this.done){
				this.fillStatus = 2
		}
	}

	//sets the initial direction of the messages based on the start and end point
    this.setFirstDirection = function(headOfLink){
			if(this.startx < this.endX && this.starty < this.endY){
				this.tempDir = 3
				this.forbiddenDir = 0
			}else if(this.startx < this.endX && this.starty > this.endY){
				this.tempDir = 1
				this.forbiddenDir = 2
			}else if(this.startx > this.endX && this.starty > this.endY){
				this.tempDir = 0
				this.forbiddenDir = 3
			}else{
				this.tempDir = 2
				this.forbiddenDir = 1
			}
			this.tempTargetX = this.listOfLinks[headOfLink].posX + this.dirs[this.tempDir][0] * spaceBetweenDots
			this.tempTargetY = this.listOfLinks[headOfLink].posY + this.dirs[this.tempDir][1]* spaceBetweenDots
			for(i = 0; i < dotArray.length; i++){
				if(round(this.tempTargetX) == round(dotArray[i].x) &&
					round(this.tempTargetY) == round(dotArray[i].y)){
					this.highlightedDots.push(i)
			}
		}
	}

    //sets the next direction that a message will go in after in reaches its 
    //target dot
	this.setNextDirection = function(headOfLink){
		this.counter += 1
		if(this.counter > numJumps){
			this.done = true
		}
		if(this.done == true){
			return
		}
		if(this.counter == numJumps){
			this.fillStatus = 3
		}
		possibleDirs = []
		for(testDir = 0; testDir < this.dirs.length; testDir++){
			if(testDir != this.forbiddenDir &&
				this.dirs[testDir][2] != this.dirs[this.tempDir][2] &&
				this.tempDir != testDir){
				possibleDirs.push(this.dirs[testDir])
			}
		}
		if(possibleDirs.length == 2){
			tempX0 = this.listOfLinks[headOfLink].posX + possibleDirs[0][0] * spaceBetweenDots
			tempY0 = this.listOfLinks[headOfLink].posY + possibleDirs[0][1] * spaceBetweenDots
			tempX1 = this.listOfLinks[headOfLink].posX + possibleDirs[1][0] * spaceBetweenDots
			tempY1 = this.listOfLinks[headOfLink].posY + possibleDirs[1][1] * spaceBetweenDots
			dist0 = getDistance(tempX0, tempY0, endX, endY)
			dist1 = getDistance(tempX1, tempY1, endX, endY)
			if(tempX0 == endX && tempY0 == endY){
				tempTempDir = 0
			}else if(tempX1 == endX && tempY1 == endY){
				tempTempDir = 1
			}else if(dist0 < dist1){
				tempTempDir = 0
			}else{
				tempTempDir = 1
			}
		}else{
			tempTempDir = 0
		}
		for(testDir = 0; testDir < this.dirs.length; testDir++){
			if(possibleDirs[tempTempDir] == this.dirs[testDir]){
				this.tempDir = testDir
			}
		}
		this.tempTargetX = this.listOfLinks[headOfLink].posX + this.dirs[this.tempDir][0] * spaceBetweenDots
		this.tempTargetY = this.listOfLinks[headOfLink].posY + this.dirs[this.tempDir][1]* spaceBetweenDots
		for(i = 0; i < dotArray.length; i++){
			if(round(this.tempTargetX) == round(dotArray[i].x) &&
				round(this.tempTargetY) == round(dotArray[i].y)){
				this.highlightedDots.push(i)
			}
		}
	}

    //moves the message animation
	this.move = function(){
		headOfLink = this.listOfLinks.length - 1
		this.newPosX = this.listOfLinks[headOfLink].posX * messageSpeed + this.tempTargetX * (1- messageSpeed )
		this.newPosY = this.listOfLinks[headOfLink].posY * messageSpeed + this.tempTargetY * (1 - messageSpeed)
		newLink = new messageLinkMaker(this.newPosX, this.newPosY, sizeOfMessage)
		this.listOfLinks.push(newLink)
		this.listOfLinks.shift()
		if(this.tempTargetX == this.startx && this.tempTargetY == this.starty){
			this.setFirstDirection(headOfLink)
		}
		if(round(this.newPosX) == round(this.endX) && 
			round(this.newPosY) == round(this.endY)){

		}else if(round(this.newPosX) == round(this.tempTargetX) && 
			round(this.newPosY) == round(this.tempTargetY)){			
			this.setNextDirection(headOfLink)
		}
	}
}

//makes the links that comprise the message animation
function messageLinkMaker(posX, posY, size){
	this.posX = posX
	this.posY = posY
	this.size = size
	this.draw = function(){
		strokeWeight(0)
		linkSize = this.size - ((this.size/numLinksInMessage) * (numLinksInMessage- i))/2
		ellipse(this.posX, this.posY, linkSize, linkSize)
	}
}

function getDistance(x0, y0, x1, y1){
	return sqrt((x1 - x0)**2 + (y1 - y0)**2)
}

//makes the dots that comprise the grid
function DotMaker(xx,yy,sizeOfDot,r,c, testForMessage, targetX, targetY){
	this.testForMessage = testForMessage
	this.x = xx;
	this.y = yy;
	this.row = r;
	this.column = c;
	this.size = sizeOfDot;
	this.color = dotColor;

    //draws the dots
	this.draw = function(i){
		sizeToDraw = this.size
		fill(dotColor[0], dotColor[1], dotColor[2], dotColor[3])
		ellipse(this.x, this.y, sizeToDraw, sizeToDraw)
		fill(this.color);
		strokeWeight(0)
		ellipse(this.x, this.y, sizeToDraw, sizeToDraw)
	}
}
