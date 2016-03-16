// David Hartnett
// 2016-03-10

"use strict";

var		WIDTH = 1200
,		HEIGHT = 600;

var main_game = GetGame(WIDTH, HEIGHT);


// globals 

// zip : population
// var zip_pop = {"01001":16769,"01002":29049

// "zip","city","state","latitude","longitude","timezone","dst"]
// var zip_geo = [ ["00210","Portsmouth","NH","43.005895","-71.013202","-5","1"],

function ArcDistanceInMiles(lat_1, lon_1, lat_2, lon_2)
{
	return 3959*Math.acos(Math.sin(lat_1)*Math.sin(lat_2)*Math.cos(lon_1-lon_2)+Math.cos(lat_1)*Math.cos(lat_2));
}

function SumOfDistances(zm, district)
{
	var total = 0, num = 0;
	for (var i = 0; i < zm.zip.length; i++)
	{
		if (zm.district[i] != district) continue;
		for (var j = i+1; j < zm.zip.length; j++)
		{
			if (zm.district[j] != district) continue;			
			total += ArcDistanceInMiles(zm.latitude[i], zm.longitude[i], zm.latitude[j], zm.longitude[j]);
			num++;
		}
	}
	//return {total:total,num:num}; // verify num = N*(N-1)/2
	return total;
}

function GetZipObject (state, district_number)
{
	var zip_object =
	{
		"zip"        :[]
	,	"population" :[]
	,	"city"       :[]
	,	"state"      :[]
	,	"latitude"   :[]
	,	"longitude"  :[]
	,	"district"   :[]
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
	,	"diff_lat"   :null
	,	"diff_lon"   :null
	};
	
	for (var i = 0; i < zip_geo.length; i++)
	{
		if (zip_pop[zip_geo[i][0]] && (zip_geo[i][2] == state || state == "USA"))
		{
			zip_object.zip.push(zip_geo[i][0]);                  					// zip
			zip_object.population.push(zip_pop[zip_geo[i][0]]);  					// population
			zip_object.city.push(zip_geo[i][1]);                 					// city
			zip_object.state.push(zip_geo[i][2]);                					// state
			zip_object.latitude.push(zip_geo[i][3]*Math.PI/180); 					// latitude
			zip_object.longitude.push(zip_geo[i][4]*Math.PI/180);					// longitude
			zip_object.district.push(Math.floor(district_number*Math.random()));	// districts randomized
		}
	}
	
	zip_object.avg_lat = zip_object.latitude.reduce(   function(x,y){ return x+y;     }) / zip_object.latitude.length;
	zip_object.avg_lon = zip_object.longitude.reduce(  function(x,y){ return x+y;     }) / zip_object.longitude.length;
	zip_object.max_pop = zip_object.population.reduce( function(x,y){ return x>y?x:y; });
	zip_object.min_pop = zip_object.population.reduce( function(x,y){ return x<y?x:y; });
	zip_object.max_lat = zip_object.latitude.reduce(   function(x,y){ return x>y?x:y; });
	zip_object.min_lat = zip_object.latitude.reduce(   function(x,y){ return x<y?x:y; });
	zip_object.max_lon = zip_object.longitude.reduce(  function(x,y){ return x>y?x:y; });
	zip_object.min_lon = zip_object.longitude.reduce(  function(x,y){ return x<y?x:y; });
	zip_object.mid_lat = (zip_object.max_lat + zip_object.min_lat) / 2;
	zip_object.mid_lon = (zip_object.max_lon + zip_object.min_lon) / 2;
	zip_object.diff_lat = zip_object.max_lat - zip_object.min_lat;
	zip_object.diff_lon = zip_object.max_lon - zip_object.min_lon;
	
	return zip_object;
}

function GetAverager(points_to_average, avg_val)
{
	var a = [];
	var tot = 0, index = 0;
	for (var i = 0; i < points_to_average; i++)
	{
		a[i] = avg_val;
		tot += avg_val;
	}
	return function(val)
	{
		if (val)
		{
			tot -= a[index];
			a[index] = val;
			tot += a[index];
			if (++index >= points_to_average) index = 0;
		}
		return tot/points_to_average;
	};
}

function GetZipDistrictObject(zip_object, flips, initial_temperature, cooling_rate, temperature_drop, external_object)
{
	var zm = zip_object;
	
	// this is stupid but I couldn't resist
	var district_number = zm.district.reduce( function(x,y)
	{
		if (typeof x == "number") return [x];
		else if (x.indexOf(y) < 0) return x.concat(y);
		else return x;
	}).length;
	
	var district_object = 
	{
		temperature:					initial_temperature
	,	cooling_counter:				0
	,	total_population:				0
	,	ideal_population_per_district:	0
	,	district_counts:				[]
	,	district_populations:			[]
	,	district_tot_distances:			[]
	,	go_flag:						false
	//,	stats:							{e_diff_tot:GetAverager(200,0),n_diff_tot:GetAverager(200,0), numerator_tot:GetAverager(200,0)}
	,	e_diff_avg:						GetAverager(200,0)
	,	n_diff_avg:						GetAverager(200,0)
	,	numerator_avg:					GetAverager(200,0)
	,	district_distance_averages:		[]
	,	draw: function(context)
		{
			return;
		}
	,	update: function(interval, input_state, object_collection)
		{
			//if (!this.go_flag) return;
			var new_district_counts = [];
			var new_district_populations = [];
			var new_district_tot_distances = [];
			
			var log_array = [];			
			
			for (var flip_counter = 0; flip_counter < flips; flip_counter++)
			{
				while (this.cooling_counter*cooling_rate >= 1)
				{
					this.cooling_counter -= 1/cooling_rate;
					this.temperature -= temperature_drop;
					external_object.value = this.temperature;
					if (this.temperature <= 0) this.temperature = 0;
				}
				
				// save old and change microscopics
				var zm_index = Math.floor(zm.zip.length*Math.random());
				
				var district_one = zm.district[zm_index];
				var district_two = Math.floor(district_number*Math.random());
				while (district_two == district_one) district_two = Math.floor(district_number*Math.random());
				
				for (var i = 0; i < district_number; i++)
				{
					new_district_counts[i]			= this.district_counts[i];
					new_district_populations[i]		= this.district_populations[i];
					new_district_tot_distances[i]	= this.district_tot_distances[i];
				}
				
				if (new_district_counts[district_one] <= 2) continue;	// can't let this happen...
				
				new_district_counts[district_one]		-= 1;
				new_district_populations[district_one]	-= zm.population[zm_index];
				for (var i = 0; i < zm.zip.length; i++)
				{
					if (zm.district[i] != district_one || i == zm_index) continue;
					new_district_tot_distances[district_one] -= ArcDistanceInMiles(zm.latitude[i], zm.longitude[i], zm.latitude[zm_index], zm.longitude[zm_index]);
				}
				
				new_district_counts[district_two]		+= 1;
				new_district_populations[district_two]	+= zm.population[zm_index];
				for (var i = 0; i < zm.zip.length; i++)
				{
					if (zm.district[i] != district_two || i == zm_index) continue;	
					new_district_tot_distances[district_two] += ArcDistanceInMiles(zm.latitude[i], zm.longitude[i], zm.latitude[zm_index], zm.longitude[zm_index]);
				}
				
				var condition_flag = false;
				
				var Nn1 = new_district_counts[district_one];
				var Nn2 = new_district_counts[district_two];
				var No1 = this.district_counts[district_one];
				var No2 = this.district_counts[district_two];
				
				var avgn1 = 2*new_district_tot_distances[district_one]/(Nn1*(Nn1-1));
				var avgn2 = 2*new_district_tot_distances[district_two]/(Nn2*(Nn2-1));
				var avgo1 = 2*this.district_tot_distances[district_one]/(No1*(No1-1));
				var avgo2 = 2*this.district_tot_distances[district_two]/(No2*(No2-1));
				
				//log_array.push(avgn1.toFixed(2) + " " + avgn2.toFixed(2) + " " + avgo1.toFixed(2) + " " + avgo2.toFixed(2) );
				
				var e_diff = (avgn1 - avgo1) + (avgn2 - avgo2);
				
				// var n_diff_one = this.district_populations[district_one] - this.ideal_population_per_district - zm.population[zm_index];
				// var n_diff_two = this.ideal_population_per_district - this.district_populations[district_two] + zm.population[zm_index];
				
				var n_diff =
				Math.abs(this.ideal_population_per_district - new_district_populations[district_one]) + Math.abs(this.ideal_population_per_district - new_district_populations[district_two]) 
				- Math.abs(this.ideal_population_per_district - this.district_populations[district_one]) - Math.abs(this.ideal_population_per_district - this.district_populations[district_two]);
				
				// ^^ bad
				var mu = 0.00002*(1-this.temperature); mu = mu <= 0 ? 0 : mu;
				var numerator = e_diff + mu*n_diff;
				// also bad ^^. study gibbs energy
				
				// var numerator = 8000*e_diff + n_diff;
				
				if (flip_counter == 0)
				{
					log_array.push("mu: " + mu);
					log_array.push("avg e_diff: " + this.e_diff_avg(e_diff).toFixed(6));
					log_array.push("avg mu*n_diff: " + this.n_diff_avg(mu*n_diff).toFixed(6));
					log_array.push("avg numerator: " + this.numerator_avg(numerator).toFixed(6));
				}
				else
				{
					this.e_diff_avg(e_diff);
					this.n_diff_avg(mu*n_diff);
					this.numerator_avg(numerator);
				}
				
				//if (avgn1 < avgo1 && avgn2 < avgo2)
				//if (e_diff <= 0)
				//if (e_diff <= 0 && n_diff <= 0)
				if (numerator <= 0)
				{
					condition_flag = true;
					this.district_distance_averages[district_one](avgn1);
					this.district_distance_averages[district_two](avgn2);
				}
				else if (Math.random() < Math.exp(-numerator/this.temperature)) condition_flag = true;	
								
				if (condition_flag)
				{
					for (var i = 0; i < district_number; i++)
					{
						this.district_counts[i] = new_district_counts[i];
						this.district_populations[i] = new_district_populations[i];
						this.district_tot_distances[i]	= new_district_tot_distances[i];
					}
					zm.district[zm_index] = district_two;
				}
			}
			
			this.cooling_counter += flips;
			
			var ret = ["runs per interval: " + flip_counter, "districts: " + district_number, "total population: " + this.total_population, "ideal average: " + this.ideal_population_per_district, "temperature: " + this.temperature];
			ret = ret.concat(this.district_counts).concat(this.district_populations).concat(this.district_distance_averages.map(function(v,i,a){return "dist "+i+" avg dist: "+v().toFixed(3);}));
			ret = ret.concat("total average distance: " + this.district_distance_averages.map(function(v,i,a){return v();}).reduce(function(x,y){return x+y;})/this.district_distance_averages.length);
			ret = ret.concat(log_array);
			
			return ret;
		}
	}
	
	for (var i = 0; i < district_number; i++)
	{
		district_object.district_counts[i] = 0;
		district_object.district_populations[i] = 0;
		district_object.district_tot_distances[i] = SumOfDistances(zm, i);
		district_object.district_distance_averages[i] = GetAverager(1000,100);
	}
	
	district_object.total_population = 0;
	
	for (var i = 0; i < zm.zip.length; i++)
	{
		district_object.total_population += zm.population[i];
		district_object.district_counts[zm.district[i]]++;
		district_object.district_populations[zm.district[i]] += zm.population[i];
	}
	district_object.ideal_population_per_district = district_object.total_population/district_number;
	
	return district_object;
}

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
	var color_arr = ["red", "blue","yellow", "lime", "orange", "purple","green", "slateblue", "crimson","burlywood","gray", "fuchsia","lightseagreen","sandybrown", "sienna"];
	
	zm.x = []; zm.y = []; zm.rad = []; zm.color = [];
	for (var i = 0; i < zm.zip.length; i++)
	{
		zm.x.push(WIDTH/2 + (zm.longitude[i] - zm.mid_lon)*map_scale_factor*scale);	// x
		zm.y.push(HEIGHT/2 + (zm.mid_lat-zm.latitude[i])*map_scale_factor*scale);	// y
		zm.rad.push(pop_rad_min + (zm.population[i]-zm.min_pop)*pop_scale);			// radius
		zm.color.push(color_arr[Math.floor(color_arr[zm.district[i]])]);		
		//zm.color.push(color_arr[Math.floor(color_arr.length*Math.random())]);
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
				grd.addColorStop(0, zm.color[i]);
				grd.addColorStop(.6, zm.color[i]);
				grd.addColorStop(1, "transparent");
				
				// slow
				// context.beginPath();
				// context.arc(zm.x[i], zm.y[i], zm.rad[i], 0, 2*Math.PI, false);
				// context.fillStyle = grd;
				// context.fill();
				
				// fast
				context.fillStyle = grd;
				context.fillRect(zm.x[i]-zm.rad[i],zm.y[i]-zm.rad[i],2*zm.rad[i],2*zm.rad[i]);
				
				// context.fillStyle = zm.color[i];
				// context.fillRect(zm.x[i]-zm.rad[i],zm.y[i]-zm.rad[i],2*zm.rad[i],2*zm.rad[i]);
				
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
					ret.push(i+": "+zm.zip[i]+','+zm.state[i]+','+zm.city[i]+','+zm.latitude[i]+','+zm.longitude[i]+','+zm.population[i]+','+zm.color[i]);
			}
			
			if (zm.district) for (var i = 0; i < zm.zip.length; i++) zm.color[i] = color_arr[zm.district[i]];
			
			return ret;
		}
	,	console_dump: function()
		{
		}
	}
	return zip_map_object;
};

var sliders = $('<label for="temperature_slider">Temperature</label> <input type="range" id="temperature_slider" min="0" style="width: '+WIDTH+'px" max="2" step="0.000001" value="1" oninput="district_obj.temperature = this.value;" /> ');
sliders.appendTo("body");

// var state = "NV";
var state = "AR";
// var state = "OK";
// var state = "IA";
var districts = 4;
var flips_per_update = 20;	
var cooling_rate = 1/4;			// drop by temperature_drop every 1/cooling_rate flips
var initial_temperature = 1;
var temperature_drop = 1/100000;

var zip_obj = GetZipObject(state, districts);
var district_obj = GetZipDistrictObject(zip_obj, flips_per_update, initial_temperature, cooling_rate, temperature_drop, $('#temperature_slider')[0]);
// var map = GetZipMapObject(zip_obj,.9,7,20);
var map = GetZipMapObject(zip_obj,.9,7,7);

main_game.add_object(map);
main_game.add_object(district_obj);
main_game.run();

