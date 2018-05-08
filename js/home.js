var projectBox = $(".projectBox");
var drawing = true;
var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");
// center X/Y are real center, sx/sy are simulated center x and y
var cData = {centerX: undefined, centerY: undefined, sx: undefined, sy: undefined};
// numberSquares - number of squares drawn, lineDepth - in percent of screen, speed - in seconds
var tunnelData = {numberSquares:10, lineDepth: .40, speed:5, lineColor: "#888888", maxLinePos:20, websiteLength: 100, lineSpacing: 3, turnPercent:.2}
var tunnelSquares = []
var baseSquare = {}
var camera = {z: 0, rotX: 0, rotY: 0}
var scrollPos = window.scrollY;
var width = window.innerWidth
var mouse = {}



function init(){
	window.addEventListener('resize', resizeCanvas, false);
    // Draw canvas border for the first time.

    resizeCanvas();
    findCenter();
    
    findMin();
    initSquares();
    drawer();
}
// make sure the canvas is the size of the window at all times
function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = window.innerHeight; 
}

function findCenter(){
	cData.centerX = c.width/2;
	cData.centerY = c.height/2;
	tunnelData.turnDist = c.width * tunnelData.turnDist
}

function findMin(){
	tunnelData.minWidth = (1-(tunnelData.lineDepth*2))*c.width
	tunnelData.minHeight = (1-(tunnelData.lineDepth*2))*c.height
}

function initSquares(){
	// initial width and height
	
	for(var i = 0; i < tunnelData.websiteLength; i++){
		tunnelSquares.push({
			x: cData.centerX, 
			y: cData.centerY, 
			z: i * tunnelData.lineSpacing, 
			width: tunnelData.minWidth, 
			height: tunnelData.minHeight
		})
	}
	baseSquare = {x: cData.sx, y: cData.sy, width: tunnelData.minWidth, height: tunnelData.minHeight}
	// tunnelSquares[tunnelSquares.length-1].fillColor = "#111111"
}

function calcSquares(){
	for (var i = 0; i < tunnelSquares.length; i++) {
		
	}
}

function drawTunnel(){

	baseSquare.x = cData.sx;
	baseSquare.y = cData.sy;

	// draw.square(baseSquare)

	// draw rest of squares, if they are with in the camera's range
	for(var i = 0; i < tunnelSquares.length; i++){
		if((tunnelSquares[i].z >= camera.z && tunnelSquares[i].z <= camera.z + tunnelData.maxLinePos)|| i == tunnelSquares.length - 1){
			
			// distance between camera and square (zero is close)
			var diff = tunnelSquares[i].z - camera.z;

			var width = c.width/(Math.pow(1.2, diff))+baseSquare.width
			var height = c.height/(Math.pow(1.2, diff))+baseSquare.height
			var x = cData.sx
			var y = cData.sy

			// imaginary line from 0,0 to (baseSquare.x, baseSquare.y)

			

			tunnelSquares[i].x = x;
			tunnelSquares[i].y = y;
			tunnelSquares[i].width = width;
			tunnelSquares[i].height = height;
			// closer squares are darker
			tunnelSquares[i].lineColor = "rgba(150,150,150," + Math.abs((diff - (tunnelData.maxLinePos - 1))/tunnelData.maxLinePos) + ")"

			// if it is the last one
			if(i == tunnelSquares.length - 1){
				tunnelSquares[i].lineColor = "rgba(150,150,150,.02)"
			}

			draw.centerSquare(tunnelSquares[i])
			// draw.centerSquare(baseSquare)
		}
	}

	

	
}

// canvas drawing
// =================================
var draw = new Object;

draw.square = function(data){
	ctx.beginPath();
	ctx.rect(data.x,data.y,data.width,data.height);

	try{
		ctx.strokeStyle = data.lineColor;
	}catch{
		ctx.strokeStyle = "white"
	}

	try{
		ctx.lineWidth = data.lineWidth;
	}catch{
		ctx.lineWidth = 1
	}

	if(Boolean(data.fillColor)){
		ctx.fillStyle = data.fillColor
		ctx.fill()
	}
	
	
	
	ctx.stroke();
}

draw.centerSquare = function(data){
	ctx.beginPath();
	ctx.rect(data.x - data.width/2,data.y - data.height/2,data.width,data.height);

	try{
		ctx.strokeStyle = data.lineColor;
	}catch{
		ctx.strokeStyle = "white"
	}

	try{
		ctx.lineWidth = data.lineWidth;
	}catch{
		ctx.lineWidth = 1
	}

	if(Boolean(data.fillColor)){
		ctx.fillStyle = data.fillColor
		ctx.fill()
	}
	
	
	
	ctx.stroke();
}

// LISTENERS
// SCROLL LISTENER
window.addEventListener("wheel", function(e){
	if(e.deltaY < 0){
		// scrolled up
		console.log(scrollPos)
		scrollPos += 1
		camera.z += 1
	}else if(e.deltaY > 0){
		// scrolled down
		console.log(scrollPos)
		scrollPos -= 1
		camera.z -= 1
	}	
})

window.addEventListener("mousemove", function(e){
	mouse.x = e.clientX;
	mouse.y = e.clientY;

	// width of smallest square




	
	// put center in correct place
	// turn the first - into a +, to make it go same direction as mouse
	cData.sx = cData.centerX - (mouse.x - cData.centerX)*tunnelData.turnPercent
	cData.sy = cData.centerY - (mouse.y - cData.centerY)*tunnelData.turnPercent


})

function drive(){
	if(camera.z < tunnelData.websiteLength){
		camera.z += .05
	}
}



// animation loop;

function drawer(){
	ctx.clearRect(0, 0, c.width, c.height);
	// drive()

	drawTunnel();

	if(drawing){
		window.requestAnimationFrame(drawer)
	}
};

// initialize page
init()
