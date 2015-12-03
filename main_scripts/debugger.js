// David Hartnett
// 2015-12-02

function GetDebugger(x, y, vertical_distance, color)
{
	var debug_array = [];
	var display = true;
	
	var debug_object =
	{
			reset: function(){ debug_array = []; }
		,	add: function(message)
			{
				if (message === null) return;
				if (typeof message == "object") for (var i in message) debug_array.push(message[i]);
				else if (typeof message == "string") debug_array.push(message);
			}
		,	draw: function(context)
			{
				if ( !display ) return;
				context.save();
				context.fillStyle = color;
				for ( var i = 0; i < debug_array.length; i++ ) context.fillText(debug_array[i], x, y + vertical_distance*i);
				context.restore();
			}
		,	update: function(){ return null; }
		,	toggle_display: function(){ display = !display; }
	};
	
	return debug_object;
}