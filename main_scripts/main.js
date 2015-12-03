// David Hartnett
// 2015-12-02

"use strict";

var main_game = GetGame();
main_game.run();


// basic case shows how objects can communicate data internally without any assistance from the display engine

var a =
{
	c: 0
	,
	draw: function(){ return; }
	,
	update: function(interval, input_state, object_collection)
	{
		if (input_state.mouse_state.down)
		{
			this.c++;
			return "mouse down " + b.c;
		}
		else return null;
	}
};


var b =
{
	c: 0
	,
	draw: function(){ return; }
	,
	update: function(interval, input_state, object_collection)
	{
		if (!input_state.mouse_state.down)
		{
			this.c++;
			return "mouse up " + a.c;
		}
		else return null;
	}
};


main_game.add_object(a);
main_game.add_object(b);


