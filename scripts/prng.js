
var p_ran = function(x, y, z, w)
{
	var t;
	return function()
	{
		t = x ^ (x << 11);
		x = y;
		y = z;
		z = w;
		w = w ^ (w >> 19) ^ t ^ (t >> 8);
		return w;
	}
};

var p_ran_u = function(x, y, z, w)
{
	var a = new Uint32Array(5);
	a[1] = x;
	a[2] = y;
	a[3] = z;
	a[4] = w;
	return function()
	{
		a[0] = a[1] ^ (a[1] << 11);
		a[1] = a[2];
		a[2] = a[3];
		a[3] = a[4];
		a[4] = a[4] ^ (a[4] >> 19) ^ a[0] ^ (a[0] >> 8);
		return a[4];
	}
};
