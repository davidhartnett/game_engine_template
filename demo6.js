// David Hartnett
// 2016-03-03

"use strict";

var		WIDTH = 1200
,		HEIGHT = 600;

var main_game = GetGame(WIDTH, HEIGHT);

main_game.run();

// zip : population
// var zip_pop = {"01001":16769,"01002":29049

// "zip","city","state","latitude","longitude","timezone","dst"]
// var zip_geo = [ ["00210","Portsmouth","NH","43.005895","-71.013202","-5","1"],

function GetZipMapObject(state, map_scale_factor, pop_rad_min, pop_rad_max)
{
	var mouse_proximity = 5;
	var zip_map = [];
	
	for (var i = 0; i < zip_geo.length; i++)
	{
		if (zip_pop[zip_geo[i][0]] && (zip_geo[i][2] == state || state == "USA"))
		{
			zip_map.push(
			[
				zip_geo[i][0]              		// 0 zip
			,	zip_pop[zip_geo[i][0]]     		// 1 population
			,	zip_geo[i][1]					// 2 city
			,	zip_geo[i][2]					// 3 state
			,	zip_geo[i][3]*Math.PI/180  		// 4 latitude
			,	zip_geo[i][4]*Math.PI/180  		// 5 longitude
			,	zip_geo[i][5]					// 6 timezone
			,	zip_geo[i][6]					// 7 dst
			]
			);
		}
	}
	
	var max_pop = zip_map[0][1];
	var min_pop = zip_map[0][1];
	var max_lat = zip_map[0][4];
	var min_lat = zip_map[0][4];
	var max_lon = zip_map[0][5];
	var min_lon = zip_map[0][5];
	var avg_lat = 0;
	var avg_lon = 0;
	
	for (var i = 0; i < zip_map.length; i++)
	{
		if (zip_map[i][1] > max_pop) max_pop = zip_map[i][1];
		if (zip_map[i][1] < min_pop) min_pop = zip_map[i][1];
		if (zip_map[i][4] > max_lat) max_lat = zip_map[i][4];
		if (zip_map[i][4] < min_lat) min_lat = zip_map[i][4];
		if (zip_map[i][5] > max_lon) max_lon = zip_map[i][5];
		if (zip_map[i][5] < min_lon) min_lon = zip_map[i][5];
		avg_lat += zip_map[i][4];
		avg_lon += zip_map[i][5];
	}
	
	avg_lat /= zip_map.length;
	avg_lon /= zip_map.length;
	var pop_scale = (pop_rad_max-pop_rad_min)/(max_pop-min_pop);
	
	//x = 0 + WIDTH*lon/(diff_lon)
	var diff_lat = max_lat - min_lat;
	var diff_lon = max_lon - min_lon;
	
	var mid_lat = (max_lat + min_lat)/2;
	var mid_lon = (max_lon + min_lon)/2;
	
	var y_scale = HEIGHT/diff_lat;
	var x_scale = WIDTH/diff_lon;
	var scale = (y_scale > x_scale ? x_scale : y_scale);
	
	for (var i = 0; i < zip_map.length; i++)
	{
		zip_map[i].push(WIDTH/2 + (zip_map[i][5]-mid_lon)*map_scale_factor*scale);	// 8 x
		zip_map[i].push(HEIGHT/2 + (mid_lat-zip_map[i][4])*map_scale_factor*scale);	// 9 y
		zip_map[i].push(pop_rad_min + (zip_map[i][1]-min_pop)*pop_scale);	// 10 radius
	}
	
	var zip_map_object = 
	{
		x:0
	,	y:0
	,	draw: function(context)
		{
			context.save();
			
			for (var i = 0; i < zip_map.length; i++)
			{
				var x = zip_map[i][8];
				var y = zip_map[i][9];
				var rad = zip_map[i][10];
				context.beginPath();
				context.arc(x, y, rad, 0, 2*Math.PI, false);
				context.fillStyle = "red";
				context.fill();
				context.lineWidth = 1;
				context.strokeStyle = 1;
				context.stroke();
				// context.fillStyle = "black";
				// context.fillText(zip_map[i][1], WIDTH/2 + x, HEIGHT/2 + y);
			}
			
			context.restore();
			return;
		}
	,	update: function(interval, input_state, object_collection)
		{
			this.x = input_state.mouse_state.x;
			this.y = input_state.mouse_state.y;
			var ret = ["x: " + input_state.mouse_state.x, "y: " + input_state.mouse_state.y];
			for (var i = 0; i < zip_map.length; i++)
			{
				if (Math.abs(this.x-zip_map[i][8]) < mouse_proximity && Math.abs(this.y-zip_map[i][9]) < mouse_proximity)
					ret.push(zip_map[i]);
			}
			return ret;
			// return null;
		}
	,	console_dump: function()
		{
			for (var i = 0; i < zip_map.length; i++) console.log(zip_map[i]);
		}
	}
	return zip_map_object;
};

var zm = GetZipMapObject("OK",.8,3,20);

// display mouse location, spam data to confirm it's there
// var m =
// {
		// x: 0
	// ,	y: 0
	// ,	text_index: 0
	// ,	zip_len: zip_pop_geo.length
	// ,	draw: function(context)
		// {
			// context.save();
			
			// context.beginPath();
			// context.arc(this.x, this.y, 10, 0, 2*Math.PI, false);
			// context.fillStyle = "red";
			// context.fill();
			// context.lineWidth = 1;
			// context.strokeStyle = 1;
			// context.stroke();
			
			// context.fillStyle = "black";
			// context.fillText(this.text_index, this.x + 30, this.y);
			// for (var i = 0; i < 100; i++) context.fillText(zip_pop_geo[i+this.text_index], this.x, 30 + i*10 + this.y);
			
			// context.restore();
			// return;
		// }
	// ,	update: function(interval, input_state, object_collection)
		// {
			// this.x = input_state.mouse_state.x;
			// this.y = input_state.mouse_state.y;
			// this.text_index = this.x*this.y%this.zip_len;
			// return ["x: " + input_state.mouse_state.x, "y: " + input_state.mouse_state.y];
			// return null;
		// }
// };

//main_game.add_object(m);
main_game.add_object(zm);


// basic case shows how objects can communicate data internally without any assistance from the display engine

// var a =
// {
	// c: 0
	// ,
	// draw: function(){ return; }
	// ,
	// update: function(interval, input_state, object_collection)
	// {
		// if (!input_state.mouse_state.down) this.c++;
		// if (input_state.mouse_state.down)
		// {
			// return "mouse down " + b.c;
		// }
		// else return null;
	// }
// };


// var b =
// {
	// c: 0
	// ,
	// draw: function(){ return; }
	// ,
	// update: function(interval, input_state, object_collection)
	// {
		// if (input_state.mouse_state.down) this.c++;
		// if (!input_state.mouse_state.down)
		// {
			// return "mouse up " + a.c;
		// }
		// else return null;
	// }
// };


// main_game.add_object(a);
// main_game.add_object(b);


