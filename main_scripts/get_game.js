// David Hartnett
// 2015-12-02
// Basic game/display engine

window.requestAnimFrame = (function () {
 return		window.requestAnimationFrame
		||	window.webkitRequestAnimationFrame
		||	window.mozRequestAnimationFrame
		||	window.oRequestAnimationFrame
		||	window.msRequestAnimationFrame
		||	function(callback){window.setTimeout(callback, 1000 / CONST.FPS);};
}
)();

function GetGame(canvas_width, canvas_height)
{
	var state = {self:this, quit:false, debug:true, request_id:null};
	
	var main_context	=	GetContext(canvas_width, canvas_height);
	var input_state		=	GetGameInputState($(window), $(main_context.canvas));
	
	var timer			=	GetFrameRateTimer(CONST.FPS);
	var background		=	GetBackground(canvas_width, canvas_height, CONST.CANVAS_BACKGROUND_COLOR);
	var debug_object	=	GetDebugger(10, 10, 10, CONST.CANVAS_TEXT_COLOR);
	
	input_state.key_down_functions[CONST.KEY_DOWN_CODES["q"]]	= [ function() { state.quit = true; } ];
	input_state.key_down_functions[CONST.KEY_DOWN_CODES["d"]]	= [ function() { state.debug = !state.debug; debug_object.toggle_display(); } ];
	
	var object_collection =
	[
		timer
	,	background
	,	debug_object
	];

	var game =
	{
		run: function()
		{
			timer.accumulator += timer.interval;
			
			while (timer.accumulator >= CONST.PHYSICS_TIME_STEP)
			{
				debug_object.reset();
				for (var o = 0; o < object_collection.length; o++) debug_object.add(object_collection[o].update(CONST.PHYSICS_TIME_STEP, input_state, object_collection));
				timer.accumulator -= CONST.PHYSICS_TIME_STEP;
			}

			for (var o = 0; o < object_collection.length; o++) object_collection[o].draw(main_context);

			if (!state.quit) state.request_id = window.requestAnimFrame(game.run);
		}
		,
		add_object: function(object)
		{
			object_collection.push(object);
			return object_collection.length - 1;
		}
		,
		remove_object: function(object_id)
		{
			return object_collection.splice(object_id,1);
		}
	};
	return game;
};
