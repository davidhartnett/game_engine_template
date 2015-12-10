// David Hartnett
// 2015-12-09
// Monte Carlo simulation of the Ising model using the Metropolis algorithm

"use strict";

var		WIDTH = 480
,		HEIGHT = 480
;

var main_game = GetGame(WIDTH, HEIGHT);

function GetMetropolis(x,y,size,temperature)
{
	var m = [];
	for (var i = 0; i < size; i++)
	{
		m[i] = [];
		for (var j = 0; j < size; j++) m[i][j] = Math.random() < 0.5 ? 1 : -1;
	}
	
	var image_array = new Uint8ClampedArray(4*size*size);
	for (var i = 0; i < image_array.length; i += 4)
	{
		image_array[i] = image_array[i+1] = image_array[i+2] = 0;
		image_array[i+3] = 255;
	}
	var m_image = new ImageData(image_array,size,size);
	
	var metropolis_object = 
	{
		temperature: temperature
	,	x: x
	,	y: y
	,	length: length
	,	total_iterations: 0
	,	update: function(interval, input_state, object_collection)
		{
			var then = Date.now()
			
			var iterations = 0;
			while( Date.now() - then < interval/2)
			{
				var i = Math.floor(Math.random()*size);
				var j = Math.floor(Math.random()*size);
				
				var left	= i == 0		? m[size-1][j]	: m[i-1][j];
				var top		= j == 0		? m[i][size-1]	: m[i][j-1];
				var right	= i == size - 1	? m[0][j]		: m[i+1][j];
				var bottom	= j == size - 1	? m[i][0]		: m[i][j+1];
				
				var e_diff = 2*m[i][j]*(left + top + right + bottom);
				
				if (e_diff <= 0) m[i][j] = -m[i][j];
				else if (Math.random() < Math.exp(-e_diff/this.temperature)) m[i][j] = -m[i][j];
				iterations++;
			}
			
			this.total_iterations += iterations;
			
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++)
				{
					var color = m[i][j] > 0 ? 0 : 255;
					var index = 4*i*size + 4*j;
					image_array[index] = image_array[index+1] = image_array[index+2] = color;
				}
			}
			return ["Iterations: " + iterations, "Total iterations: " + this.total_iterations];
		}
	,	draw: function(context)
		{
			context.save();
			
			context.fillStyle = "black";
			context.fillText("Temperature: " + this.temperature, this.x, this.y);
			
			context.putImageData(m_image, this.x, this.y + 10);
			
			context.restore();
			return;
		}
	}
	return metropolis_object;
}

var mo = GetMetropolis(120,120,240,2)

var temperature_slider = $('<input type="range" id="temperature_slider" min="0" max="500" step="1" value="200"  oninput="console.log(this.value/100); mo.temperature = this.value/100;" />');
temperature_slider.appendTo("body");

main_game.add_object(mo);


main_game.run();

