// David Hartnett
// 2015-12-08
// Basic string simulator using Eulerian integration.
// To do: implement Runge Kutta

"use strict";

var		WIDTH = 1280
,		HEIGHT = 480
//,		PARTICLE_NUM = 32*24
,		PARTICLE_NUM = 100
,		FRICTION = 0.995;
// ,		FRICTION = 0.999;

var main_game = GetGame(WIDTH, HEIGHT);

function GetGravityObject(x,y,dx,dy,mass,color,radius,particle_collection)
{
	var gravity_object = 
	{
		x: x
	,	y: y
	,	dx: dx
	,	dy: dy
	,	mass: mass
	,	color: color
	,	radius: radius
	,	update: function(interval, input_state, object_collection)
		{
			for (var i in particle_collection)
			{
				var distance_x = this.x - particle_collection[i].x;
				var distance_y = this.y - particle_collection[i].y;
				var d2 = distance_x*distance_x + distance_y*distance_y;
				if (d2 > this.radius*this.radius)
				{
					var d = Math.sqrt(d2);
					var f = this.mass/d2;
					particle_collection[i].dx += distance_x*f/d;
					particle_collection[i].dy += distance_y*f/d;
				}
			}
			
			this.x += this.dx*interval;
			this.y += this.dy*interval;
			
			if (this.x < 0) this.x = WIDTH;
			if (this.x > WIDTH) this.x = 0;
			if (this.y < 0) this.y = HEIGHT;
			if (this.y > HEIGHT) this.y = 0;
		}
	,	draw: function(context)
		{
			context.save();
			
			var grd = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, 1*this.radius);
			grd.addColorStop(0, "transparent")
			grd.addColorStop(0.5, this.color);
			grd.addColorStop(1, "transparent");
			
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
			context.fillStyle = grd;
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 1;
			context.stroke();
			
			context.restore();
			return;
		}
	}
	return gravity_object;
}


function GetGravityField(x,y,width,height,strength,particle_collection)
{
	var gravity_field = 
	{
		update: function(interval, input_state, object_collection)
		{
			for (var i in particle_collection)
			{
				particle_collection[i].dy += strength*interval;
			}
		}
	,	draw: function(context)
		{
			context.save();
			
			context.rect(x, y, width, height);
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();
			
			context.restore();
			return;
		}
	}
	return gravity_field;
}

function GetString(x,y,dx,dy,distance,spring_constant,count,color,size,fixed_points)
{
	var particle_collection = [];
	for (var i = 0; i < count; i++)
	{
		particle_collection[i] = {};
		particle_collection[i].x = x + i*distance;
		particle_collection[i].y = y;
		particle_collection[i].dx = dx;
		particle_collection[i].dy = dy;
	}
	
	var string =
	{
		p: particle_collection
	,	update: function(interval, input_state, object_collection)
		{
			var r = [];
			
			
			for (var i = 0; i < count; i++)
			{
				this.p[i].x += this.p[i].dx*interval;
				this.p[i].y += this.p[i].dy*interval;				
			}
			
			for (var i in fixed_points)
			{
				this.p[i].x = fixed_points[i].x;
				this.p[i].y = fixed_points[i].y;
			}
			
			for (var i = 1; i < count; i++)
			{
				var vi = (this.p[i].x - this.p[i-1].x);
				var vj = (this.p[i].y - this.p[i-1].y);
				var vm = Math.sqrt(vi*vi + vj*vj);
				var vdel = vm - distance;
				var dx = interval*spring_constant*vdel*vi/vm;
				var dy = interval*spring_constant*vdel*vj/vm;
				this.p[i-1].dx	+= dx;
				this.p[i-1].dy	+= dy;
				this.p[i].dx	-= dx;
				this.p[i].dy	-= dy;
			}
			for (var i = 0; i < count; i++)
			{
				this.p[i].dx = FRICTION*this.p[i].dx;
				this.p[i].dy = FRICTION*this.p[i].dy;
			}
			
			
			return r;
		}
	,	draw: function(context)
		{
			context.save();
			
			context.beginPath();
			
			context.lineWidth = size;
			context.strokeStyle = color;
			context.fillStyle = color;
			
			// context.moveTo(this.p[0].x, this.p[0].y);
			for (var i = 0; i < count; i++)
			{
				// context.lineTo(this.p[i].x, this.p[i].y);
				context.fillRect(this.p[i].x, this.p[i].y, size, size);
			}


			// context.stroke();


			context.restore();
			return;
		}
	}
	return string;
}

var s2 = GetString(0,50,0,0,WIDTH/80,0.002,81,"green",4,{0:{x:0, y:50}, 40:{x:WIDTH/2, y:50}, 80:{x:WIDTH, y:50}});
// GetString(x,y,dx,dy,distance,spring_constant,count,color,size,fixed_points)
var s1 = GetString(s2.p[10].x,s2.p[10].y,0,0,4,0.0035,50,"red",3,{0:s2.p[10]});
var s3 = GetString(350,50,0,0,5,0.0035,40,"blue",3,{0:{x:350, y:50}});
var s4 = GetString(550,50,0,0,10,0.0035,20,"purple",3,{0:{x:550, y:50}});
var gf1 = GetGravityField(0, 0, WIDTH/2, HEIGHT, 0.0002, s1.p.concat(s3.p).concat(s4.p));
// var gf2 = GetGravityField(3*WIDTH/4, 0, WIDTH/4, HEIGHT, 0.01, s1.p);


var s5 = GetString(s2.p[60].x,s2.p[60].y,0,0,6,0.0035,10,"purple",3,{0:s2.p[60]});
var s6 = GetString(s2.p[65].x,s2.p[65].y,0,0,6,0.0035,10,"purple",3,{0:s2.p[65]});

main_game.add_object(s1);
main_game.add_object(s2);
main_game.add_object(s3);
main_game.add_object(s4);
main_game.add_object(s5);
main_game.add_object(s6);
main_game.add_object(gf1);
// main_game.add_object(gf2);
main_game.add_object(GetGravityObject(WIDTH/4, 3*HEIGHT/4, 0,0, 20, "green", 30, s2.p.concat(s5.p).concat(s6.p)));
main_game.add_object(GetGravityObject(3*WIDTH/4, 3*HEIGHT/4,  0,0, 100, "blue", 30, s2.p.concat(s5.p).concat(s6.p)));

main_game.run();


