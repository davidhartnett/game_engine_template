// David Hartnett
// 2015-11-26
// Basic timer for interval tracking and frame rate averaging

function GetFrameRateTimer(fn)
{
	function FrameRateTimer(frame_number)
	{
		this.frame_number = frame_number;
		
		this.then = Date.now();
		
		this.interval_array_index = 0;
		this.interval_array = [];
		
		this.interval_request_count = 0;
		
		this.accumulator = 0;
		
		this.total_time_count = 1000;
		for (var i = 0; i < this.frame_number; i++) this.interval_array[i] = 1000/this.frame_number;
		
		this.draw = function(){return;};
		this.update = function()
		{
			return ["Frame rate: " + this.frame_rate.toFixed(2), "Total time: " + this.total_time_count, "Array index: " + this.interval_array_index, "Count: " + this.interval_request_count];
		};
	}

	FrameRateTimer.prototype =
	{
		get interval()
		{
			var interval = Date.now() - this.then;
			this.then = Date.now();

			this.total_time_count += interval - this.interval_array[this.interval_array_index];
			this.interval_array[this.interval_array_index] = interval;
			if (++this.interval_array_index >= this.frame_number) this.interval_array_index = 0;
			this.interval_request_count++;
			
			return interval;
		},
		get frame_rate() { return 1000*this.frame_number/this.total_time_count; }
	};
	
	return new FrameRateTimer(fn);
}