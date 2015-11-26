// David Hartnett
// 2015-11-26
// Requires jQuery

var key_down = {};

$(window).keydown
(
	function (key_code)
	{
		key_down[key_code.keyCode] = true;
	}
);
	
$(window).keyup
(
	function (key_code)
	{
		key_down[key_code.keyCode] = false;
		console.log(key_down);
	}
);
