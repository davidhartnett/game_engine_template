// David Hartnett
// 2015-12-02

function GetContext(width, height)
{
	var main_canvas = $("<canvas id='main_canvas' width='" + width + "' height='" + height + "'>Update your browser :P</canvas>");
	var main_context = main_canvas.get(0).getContext('2d');	
	main_canvas.appendTo("body");
	return main_context;
}