// David Hartnett
// 2015-12-27
// 

"use strict";

var		WIDTH = 1280
,		HEIGHT = 480
//,		PARTICLE_NUM = 32*24
,		PARTICLE_NUM = 100
,		FRICTION = 0.995;
// ,		FRICTION = 0.999;

var main_game = GetGame(WIDTH, HEIGHT);

function GetSphereObject(x,y,radius,color, speed)
{
	var sphere_object = 
	{
		x:x
	,	y:y
	,	theta:-Math.PI/2
	,	phi:0
	,	tilt: 0
	,	radius: radius
	,	color: color
	,	speed: speed
	,	update: function(interval, input_state, object_collection)
		{
			if (input_state.key_state[CONST.KEY_DOWN_CODES["up_arrow"]]) this.theta += this.speed*interval;
			if (input_state.key_state[CONST.KEY_DOWN_CODES["down_arrow"]]) this.theta -= this.speed*interval;
			if (input_state.key_state[CONST.KEY_DOWN_CODES["left_arrow"]]) this.phi += this.speed*interval;
			if (input_state.key_state[CONST.KEY_DOWN_CODES["right_arrow"]]) this.phi -= this.speed*interval;
			
			
			if (input_state.key_state[CONST.KEY_DOWN_CODES["a"]]) this.tilt += this.speed*interval;
			if (input_state.key_state[CONST.KEY_DOWN_CODES["z"]]) this.tilt -= this.speed*interval;
			
			if (this.theta > Math.PI/2) this.theta = Math.PI/2;
			else if (this.theta < -Math.PI/2) this.theta = -Math.PI/2;
			
			if (this.phi > 2*Math.PI) this.phi = 2*Math.PI;
			else if (this.phi < 0) this.phi = 0;
			
			if (this.tilt > Math.PI/4) this.tilt = Math.PI/4;
			else if (this.tilt < 0) this.tilt = 0;
			
			return ["Theta: " + this.theta, "Phi: " + this.phi, "Tilt: " + this.tilt];
		}
	,	draw: function(context)
		{
			context.save();
			
			context.translate(this.x, this.y);
			
			context.fillStyle = "black";
			context.strokeStyle = "black";
			
			
			context.beginPath();
			context.arc(0, 0, this.radius, 0, 2*Math.PI, false);
			context.lineWidth = 1;
			context.stroke();
			
			var x, y, z;
			// z
			x = 0;
			y = -this.radius*Math.cos(2*this.tilt);
			context.beginPath();
			context.moveTo(-x, -y);
			context.lineTo(x, y);
			context.stroke();
			context.fillText("z axis", x, y);
			
			context.scale(1,Math.cos(2*this.tilt));
			context.beginPath();
			context.arc(0, 0, this.radius, 0, 2*Math.PI, false);
			context.lineWidth = 1;
			context.stroke();
			context.scale(1,1/Math.cos(2*this.tilt));
			
			context.scale(1,Math.sin(2*this.tilt));
			context.beginPath();
			context.arc(0, 0, this.radius, 0, 2*Math.PI, false);
			context.lineWidth = 1;
			context.stroke();
			context.scale(1,1/Math.sin(2*this.tilt));
			
			// context.scale(Math.sin(2*this.tilt),1);
			// context.beginPath();
			// context.arc(0, 0, this.radius, 0, 2*Math.PI, false);
			// context.lineWidth = 1;
			// context.stroke();
			
			// context.scale(1/Math.sin(2*this.tilt),1);
			
			// context.scale(3/4,2);
			
			// context.beginPath();
			// context.arc(0, 0, this.radius, 0, 2*Math.PI, false);
			// context.lineWidth = 1;
			// context.stroke();
			
			// context.scale(4/3,1);
			
			// context.scale(1,2);
			// y
			x = this.radius*Math.cos(this.tilt);
			y = this.radius*Math.sin(this.tilt);
			// x = this.radius;
			// y = this.radius;
			context.beginPath();
			context.moveTo(-x,-y);
			context.lineTo(x, y);
			context.stroke();
			context.fillText("y axis", x, y);
			
			// x
			x = -this.radius*Math.cos(this.tilt);
			y = this.radius*Math.sin(this.tilt);
			// x = -this.radius;
			// y = this.radius;
			context.beginPath();
			context.moveTo(-x,-y);
			context.lineTo(x, y);
			context.stroke();
			context.fillText("x axis", x, y);
			
			
			// x = this.radius*Math.cos(this.theta)*Math.cos(this.phi);
			// y = this.radius*Math.cos(this.theta)*Math.sin(this.phi);
			// z = this.radius*Math.sin(this.theta);
			
			// context.fillStyle = color;
			// context.strokeStyle = color;
			// context.lineWidth = 2;
			// context.beginPath();
			// context.moveTo(0,0);
			// context.lineTo(-x*Math.cos(Math.PI/4)+y*Math.cos(Math.PI/4), x*Math.sin(Math.PI/4)/2+y*Math.sin(Math.PI/4)/2+z);
			// context.stroke();
			// context.fillText("vector", -x*Math.cos(Math.PI/4)+y*Math.cos(Math.PI/4), x*Math.sin(Math.PI/4)/2+y*Math.sin(Math.PI/4)/2+z);
			
			
			context.restore();
			return;
		}
	}
	return sphere_object;
}

var s1 = GetSphereObject(WIDTH/2, HEIGHT/2, 200, "green", 0.0005);


main_game.add_object(s1);
main_game.run();


