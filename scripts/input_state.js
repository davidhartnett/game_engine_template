// David Hartnett
// 2015-11-26

function GameInputState(object)
{
	var input_state =
	{
		key_state: [],
		mouse_state:
		{
			down: null,
			x: null,
			y: null
		},
		key_down_functions: [],
		key_up_functions: []
	};

	object.keydown
	(
		function (event)
		{
			input_state.key_state[event.which] = true;
			for (var i in input_state.key_down_functions) input_state.key_down_functions[i](event.which);
		}
	);

	object.keyup
	(
		function (event)
		{
			input_state.key_state[event.which] = false;
			for (var i in input_state.key_up_functions) input_state.key_up_functions[i](event.which);
		}
	);

	object.mousedown
	(
		function (event_object)
		{
			input_state.mouse_state.down = true;
		}
	);

	object.mouseup
	(
		function (event_object)
		{
			input_state.mouse_state.down = false;
		}
	);

	object.mousemove
	(
		function (event_object)
		{
			console.log(event_object);
		}
	);
	
	return input_state;
}
