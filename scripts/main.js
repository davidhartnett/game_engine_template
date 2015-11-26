(function () {

"use strict";


window.requestAnimFrame = (function () {
 return		window.requestAnimationFrame
		||	window.webkitRequestAnimationFrame
		||	window.mozRequestAnimationFrame
		||	window.oRequestAnimationFrame
		||	window.msRequestAnimationFrame
		||	function(callback){window.setTimeout(callback, 1000 / CONST.FPS);};
}
)();


function Game()
{
	var self = this;
	var quit = false;
	var debug = true;
	var request_id;
	
	var time_then = Date.now();
		
	var main_canvas = $("<canvas id='main_canvas' width='" + CONST.CANVAS_WIDTH + "' height='" + CONST.CANVAS_HEIGHT + "'>Update your browser :P</canvas>");
	var main_context = main_canvas.get(0).getContext('2d');
	
	main_canvas.appendTo("body");
	
	this.run = function () {
		if (!quit) request_id = window.requestAnimFrame(self.run);
		self.draw();
		self.update(Date.now() - time_then);
		time_then = Date.now();
	};
	
	this.draw = function() {
		console.log("Draw");
	};
	
	this.update = function(interval) {
		// if (debug) console.log("Key down: " + key_code.keyCode);
		// if (key_code.keyCode==68) { debug = !debug; console.log("Debug " + (debug?"on.":"off.")); }
		//if (key_code.keyCode==81) quit = true;
		if (key_down[81]) quit = true;		
		// if (debug) console.log("Key up: " + key_code.keyCode);
		//console.log("Update " + interval);
	};
};	

var main_game = new Game();
main_game.run();
	
})();
