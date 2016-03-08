// David Hartnett
// 2016-03-07

"use strict";

var		WIDTH = 1200
,		HEIGHT = 600;

var main_game = GetGame(WIDTH, HEIGHT);

main_game.run();

// globals 

// zip : population
// var zip_pop = {"01001":16769,"01002":29049

// "zip","city","state","latitude","longitude","timezone","dst"]
// var zip_geo = [ ["00210","Portsmouth","NH","43.005895","-71.013202","-5","1"],

function GetZipObject (state)
{
	var zip_object =
	{
		"zip"        :[]
	,	"population" :[]
	,	"city"       :[]
	,	"state"      :[]
	,	"latitude"   :[]
	,	"longitude"  :[]
	,	"avg_lat"    :null
	,	"avg_lon"    :null
	,	"max_pop"    :null
	,	"min_pop"    :null
	,	"max_lat"    :null
	,	"min_lat"    :null
	,	"max_lon"    :null
	,	"min_lon"    :null
	,	"mid_lat"    :null
	,	"mid_lon"    :null
	,	"diff_lat"    :null
	,	"diff_lon"    :null
	};
	
	for (var i = 0; i < zip_geo.length; i++)
	{
		if (zip_pop[zip_geo[i][0]] && (zip_geo[i][2] == state || state == "USA"))
		{
			zip_object.zip.push(zip_geo[i][0]);                     // zip
			zip_object.population.push(zip_pop[zip_geo[i][0]]);     // population
			zip_object.city.push(zip_geo[i][1]);                    // city
			zip_object.state.push(zip_geo[i][2]);                   // state
			zip_object.latitude.push(zip_geo[i][3]*Math.PI/180);    // latitude
			zip_object.longitude.push(zip_geo[i][4]*Math.PI/180);   // longitude
		}
	}
	
	zip_object.avg_lat = zip_object.latitude.reduce(   function(x,y){ return x+y;     })/zip_object.latitude.length;
	zip_object.avg_lon = zip_object.longitude.reduce(  function(x,y){ return x+y;     })/zip_object.longitude.length;
	zip_object.max_pop = zip_object.population.reduce( function(x,y){ return x>y?x:y; });
	zip_object.min_pop = zip_object.population.reduce( function(x,y){ return x<y?x:y; });
	zip_object.max_lat = zip_object.latitude.reduce(   function(x,y){ return x>y?x:y; });
	zip_object.min_lat = zip_object.latitude.reduce(   function(x,y){ return x<y?x:y; });
	zip_object.max_lon = zip_object.longitude.reduce(  function(x,y){ return x>y?x:y; });
	zip_object.min_lon = zip_object.longitude.reduce(  function(x,y){ return x<y?x:y; });
	zip_object.mid_lat = (zip_object.max_lat + zip_object.min_lat)/2;
	zip_object.mid_lon = (zip_object.max_lon + zip_object.min_lon)/2;
	zip_object.diff_lat = zip_object.max_lat - zip_object.min_lat;
	zip_object.diff_lon = zip_object.max_lon - zip_object.min_lon;
	
	return zip_object;
}

var ok_zip = GetZipObject("OK");


function GetZipMapObject(zip_object, map_scale_factor, pop_rad_min, pop_rad_max)
{
	var zm = zip_object;

	var mouse_proximity = 5;
	var pop_scale = (pop_rad_max-pop_rad_min)/(zm.max_pop-zm.min_pop);
	var y_scale = HEIGHT/zm.diff_lat;
	var x_scale = WIDTH/zm.diff_lon;
	var scale = ( y_scale > x_scale ? x_scale : y_scale );
	
	//var color = "#" + (Math.random()>0.5?"FF":"00")+ (Math.random()>0.5?"FF":"00")+ (Math.random()>0.5?"FF":"00");
	//var color_arr = ["#FF0000","#00FF00","#0000FF"];
	var color_arr = ["red", "green", "blue", "orange", "purple","yellow"];	
	
	zm.x = []; zm.y = []; zm.rad = []; zm.color = [];
	for (var i = 0; i < zm.zip.length; i++)
	{
		zm.x.push(WIDTH/2 + (zm.longitude[i] - zm.mid_lon)*map_scale_factor*scale);	// x
		zm.y.push(HEIGHT/2 + (zm.mid_lat-zm.latitude[i])*map_scale_factor*scale);	// y
		zm.rad.push(pop_rad_min + (zm.population[i]-zm.min_pop)*pop_scale);			// radius
		zm.color.push(color_arr[Math.floor(color_arr.length*Math.random())]);
		//zm.color.push("#"+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0"));		
	}
	
	var zip_map_object = 
	{
		x:0
	,	y:0
	,	draw: function(context)
		{
			context.save();
			
			for (var i = 0; i < zm.zip.length; i++)
			{
				
				var grd = context.createRadialGradient(zm.x[i], zm.y[i], 0, zm.x[i], zm.y[i], 1*zm.rad[i]);
				grd.addColorStop(0.6, zm.color[i]);
				grd.addColorStop(1, "transparent");
				context.beginPath();
				context.arc(zm.x[i], zm.y[i], zm.rad[i], 0, 2*Math.PI, false);
				context.fillStyle = grd;
				context.fill();
				
				
				// fast
				// context.fillStyle = "red";
				// context.fillRect(x,y,rad,rad);
				
				// really slow
				// context.beginPath();
				// context.arc(x, y, rad, 0, 2*Math.PI, false);
				// context.fillStyle = "red";
				// context.fill();
				// context.lineWidth = 1;
				// context.strokeStyle = 1;
				// context.stroke();
				
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
			for (var i = 0; i < zm.zip.length; i++)
			{
				if (Math.abs(zm.x[i]-this.x) < mouse_proximity && Math.abs(zm.y[i]-this.y) < mouse_proximity)
					ret.push(zm.zip[i]+','+zm.state[i]+','+zm.city[i]+','+zm.latitude[i]+','+zm.longitude[i]+','+zm.population[i]+','+zm.color[i]);
			}
			
			// for (var i = 0; i < zm.zip.length; i++)
			// {
				// zm.color[i] = "#"+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0")+(Math.random()>0.5?"F":"0");
			// }
			return ret;
		}
	,	console_dump: function()
		{
			
		}
	}
	return zip_map_object;
};

// var zm = GetZipMapObject("OK",.8,4,20);
var zm = GetZipMapObject(ok_zip,.9,10,10);

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

//*/
