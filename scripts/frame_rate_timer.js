// David Hartnett
// 2015-11-26
// Basic timer for interval tracking and frame rate averaging

function FrameRateTimer(frame_number)
{
	this.frame_number = frame_number;
	
	this.then = Date.now();
	
	this.interval_array_index = 0;
	this.interval_array = [];
	this.total_time_count = 1000;
	this.interval_request_count = 0;
	for (var i = 0; i < this.frame_number; i++) this.interval_array[i] = 1000/this.frame_number;
}

FrameRateTimer.prototype =
{
	get interval()
	{
		var interval = Date.now() - this.then;
		this.then = Date.now();

		this.total_time_count += interval - this.interval_array[this.interval_array_index];
		this.interval_array[this.interval_array_index] = interval;
		this.interval_array_index = this.interval_array_index >= this.frame_number ? 0 : this.interval_array_index + 1;
		this.interval_request_count++;
		
		return interval;
	},
	get i_count() { return this.interval_request_count; },
	get frame_rate() { return 1000*this.frame_number/this.total_time_count; }
};