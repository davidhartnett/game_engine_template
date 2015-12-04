// David Hartnett
// 2015-12-02

function GetContext(width, height)
{
	var main_canvas = $("<canvas id='main_canvas' width='" + width + "' height='" + height + "'>Update your browser :P</canvas>");
	main_canvas.appendTo("body");
	var main_context = main_canvas.get(0).getContext('2d');	
	return main_context;
}