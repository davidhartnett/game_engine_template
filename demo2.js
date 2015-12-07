// David Hartnett
// 2015-12-06
// Basic particle simulator using Eulerian integration.
// To do: implement Runge Kutta

"use strict";

var WIDTH = 1280, HEIGHT = 480, PARTICLE_NUM = 32*24, FRICTION = 0.995;

var main_game = GetGame(WIDTH, HEIGHT);
main_game.run();

function GetParticle(x,y,dx,dy,color,size)
{
	var particle =
	{
		x: x
	,	y: y
	,	dx: dx
	,	dy: dy
	,	color: color
	,	size: size
	,	halfpsize: size/2
	,	update: function(interval, input_state, object_collection)
		{
			this.x += this.dx*interval;
			this.y += this.dy*interval;
			
			this.dx = FRICTION*this.dx;
			this.dy = FRICTION*this.dy;
			
			if (this.x < 0) this.x = WIDTH;
			if (this.x > WIDTH) this.x = 0;
			if (this.y < 0) this.y = HEIGHT;
			if (this.y > HEIGHT) this.y = 0;
		}
	,	draw: function(context)
		{
			context.save();
			
			context.fillStyle = this.color;
			context.fillRect(this.x-this.halfpsize,this.y-this.halfpsize,this.size,this.size);
			
			context.restore();
			return;
		}
	}
	return particle;
}

var p = [];
for (var i = 0; i < PARTICLE_NUM; i++) p[i] = GetParticle(20 + 40*(i%32), 20 + 20*Math.floor(i/32), 0.0, 0.0, "green", 2);

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
			//canvas.strokeStyle = "transparent";
			context.stroke();
			
			context.restore();
			return;
		}
	}
	return gravity_object;
}


for (var i = 0; i < PARTICLE_NUM; i++) main_game.add_object(p[i]);
var g1 = GetGravityObject(500, 200, 0,0, 20, "green", 20, p);
var g2 = GetGravityObject(800, 400,  0,0, 20, "blue", 20, p);
main_game.add_object(g1);
main_game.add_object(g2);


