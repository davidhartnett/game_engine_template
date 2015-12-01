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
	
	var timer = new FrameRateTimer(CONST.FPS);
	var time_accumulator = 0;
		
	var main_canvas = $("<canvas id='main_canvas' width='" + CONST.CANVAS_WIDTH + "' height='" + CONST.CANVAS_HEIGHT + "'>Update your browser :P</canvas>");
	var main_context = main_canvas.get(0).getContext('2d');	
	main_canvas.appendTo("body");
	
	var input_state = GameInputState($(window));
	input_state.key_down_functions.push(function(key){ if (key == CONST.KEY_DOWN_CODES["d"]) debug = !debug; });
	input_state.key_down_functions.push(function(key){ if (key == CONST.KEY_DOWN_CODES["q"]) quit = true; });
	
	this.run = function () {
		if (!quit) request_id = window.requestAnimFrame(self.run);
		time_accumulator += timer.interval;
		while (time_accumulator >= CONST.PHYSICS_TIME_STEP)
		{
			self.update(CONST.PHYSICS_TIME_STEP);
			time_accumulator -= CONST.PHYSICS_TIME_STEP;
		}
		self.draw();
	};
	
	this.draw = function() {
		if (debug) console.log("Draw");
	};
	
	this.update = function(interval) {
		if (debug) console.log(interval + " " + timer.frame_rate + " " + timer.total_time_count + " " + timer.interval_array_index + " " + timer.i_count);
		
	};
};	

var main_game = new Game();
main_game.run();
	
})();
