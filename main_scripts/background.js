// David Hartnett
// 2015-12-02

function GetBackground(width, height, color)
{
	var background =
	{
		draw: function(context)
		{
			context.fillStyle = color;
			context.fillRect(0,0, width, height);
		}
		,
		update: function()
		{
			return null;
		}
	};
	return background;
}