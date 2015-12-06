// David Hartnett
// 2015-12-02

"use strict";

var main_game = GetGame(CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT);
main_game.run();

// display mouse location
var m =
{
		x: 0
	,	y: 0
	,	draw: function(context)
		{
			context.save();
			
			context.beginPath();
			context.arc(this.x, this.y, 10, 0, 2*Math.PI, false);
			context.fillStyle = "red";
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 1;
			context.stroke();
			
			context.restore();
			return;
		}
	,	update: function(interval, input_state, object_collection)
		{
			this.x = input_state.mouse_state.x;
			this.y = input_state.mouse_state.y;
			return ["x: " + input_state.mouse_state.x, "y: " + input_state.mouse_state.y];
			// return null;
		}
};

main_game.add_object(m);

// basic case shows how objects can communicate data internally without any assistance from the display engine

// var a =
// {
	// c: 0
	// ,
	// draw: function(){ return; }
	// ,
	// update: function(interval, input_state, object_collection)
	// {
		// if (!input_state.mouse_state.down) this.c++;
		// if (input_state.mouse_state.down)
		// {
			// return "mouse down " + b.c;
		// }
		// else return null;
	// }
// };


// var b =
// {
	// c: 0
	// ,
	// draw: function(){ return; }
	// ,
	// update: function(interval, input_state, object_collection)
	// {
		// if (input_state.mouse_state.down) this.c++;
		// if (!input_state.mouse_state.down)
		// {
			// return "mouse up " + a.c;
		// }
		// else return null;
	// }
// };


// main_game.add_object(a);
// main_game.add_object(b);


