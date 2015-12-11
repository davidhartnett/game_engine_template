// David Hartnett
// 2015-12-09
// Monte Carlo simulation of the Ising model using the Metropolis algorithm

"use strict";

var		WIDTH = 640
,		HEIGHT = 640
,		GRID_SIZE = 480
,		PIXEL_SIZE = 2
;

var main_game = GetGame(WIDTH, HEIGHT);

function GetMetropolis(x,y,size,pixel_size,temperature)
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
	
	var draw_canvas = $("<canvas>").attr("width", size).attr("height", size)[0];
	
	var update_time = 0;
	
	var metropolis_object = 
	{
		temperature: temperature
	,	x: x
	,	y: y
	,	total_iterations: 0
	,	update: function(interval, input_state, object_collection)
		{
			var iterations = 0;
			var iteration_max = size*size/10;			// hitting ~10% of the grid per run seems reasonable but this is entirely arbitrary
			
			var then = Date.now();
			
			// metropolis algorithm
			while(iterations < iteration_max)
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
			
			// set the image array for proper representation
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++)
				{
					var color = m[i][j] > 0 ? 0 : 255;
					var index = 4*i*size + 4*j;
					image_array[index] = image_array[index+1] = image_array[index+2] = color;
				}
			}
			
			update_time = Date.now() - then;
			
			return ["Update iterations: " + iterations, "Total iterations: " + this.total_iterations, "Temperature: " + this.temperature, "Update time: " + update_time];
		}
	,	draw: function(context)
		{
			context.save();
		
			draw_canvas.getContext("2d").putImageData(m_image, 0, 0);
			context.translate(this.x, this.y);
			context.scale(pixel_size, pixel_size);
			context.drawImage(draw_canvas, 0, 0);
			
			// context.putImageData(m_image, this.x, this.y);
			// for (var i = 0; i < size; i++) {
				// for (var j = 0; j < size; j++)
				// {
					// context.fillStyle = m[i][j] > 0 ? "black" : "white";
					// context.fillRect(x+i,x+j, 1, 1);
				// }
			// }
			
			context.restore();
			return;
		}
	}
	return metropolis_object;
}

var mo = GetMetropolis(80,80,GRID_SIZE/PIXEL_SIZE,PIXEL_SIZE,2.5)
var mo_id = main_game.add_object(mo);
console.log(mo_id);

var sliders = $(
'<label for="temperature_slider">Temperature</label> \
<input type="range" id="temperature_slider" min="0" max="500" step="1" value="200"  oninput="mo.temperature = this.value/100;" /> \
<label for="size_slider">Size</label> \
<input type="range" id="size_slider" min="1" max="4" step="1" value="2"  oninput="main_game.remove_object(mo_id); mo = GetMetropolis(80,80,GRID_SIZE/this.value,this.value,2.5); mo_id = main_game.add_object(mo);console.log(mo_id);" /> \
'
);
sliders.appendTo("body");


main_game.run();
