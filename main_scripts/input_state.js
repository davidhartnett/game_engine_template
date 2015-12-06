// David Hartnett
// 2015-11-26

function GetGameInputState(object, canvas)
{
	var input_state =
	{
		key_state: [],
		mouse_state:
		{
			down: null,
			x: null,
			y: null,
			event_object: null
		},
		key_down_functions: [],
		key_up_functions: [],
		mouse_down_functions: []
	};

	object.keydown
	(
		function (event)
		{
			input_state.key_state[event.which] = true;
			if (input_state.key_down_functions[event.which]) for (var i in input_state.key_down_functions[event.which]) input_state.key_down_functions[event.which][i]();
		}
	);

	object.keyup
	(
		function (event)
		{
			input_state.key_state[event.which] = false;
			if (input_state.key_up_functions[event.which]) for (var i in input_state.key_up_functions[event.which]) input_state.key_up_functions[event.which][i]();
		}
	);

	object.mousedown
	(
		function (event_object)
		{
			input_state.mouse_state.down = true;
			if (input_state.mouse_down_functions[event.which]) for (var i in input_state.mouse_down_functions[event.which]) input_state.mouse_down_functions[event.which][i]();
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
			input_state.mouse_state.x = event_object.pageX - canvas.offset().left;
			input_state.mouse_state.y = event_object.pageY - canvas.offset().top;
			input_state.mouse_state.event_object = event_object;
		}
	);
	
	return input_state;
}
