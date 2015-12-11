// David Hartnett
// 2015-12-10
// Monte Carlo simulation of the Ising model using the Metropolis algorithm

"use strict";



onmessage = function (e) {
	
	//var a = e.map(function(x){return x*x;});
	
	//var a = e.data.map(function(x){return x*x;});
	
	// var ga = new GeneticAlgorithm({gene_string:e.data.gene_string});
	// var total_to_check = e_s.length;
	// var summed_fitness = 0;
	
	// for (var i = 0; i < total_to_check; i++)
	// {
		// bng.update_source(e_s[i].s);
		// ga.run_gene_string();
		// summed_fitness += ga.output == e_s[i].e ? 1 : 0;
	// }
	// for (var i = 0; i < 1000000000; i++);
	
	// var agg_fit = summed_fitness/total_to_check;
	// var a = {worker_id: e.data.worker_id, string_id: e.data.string_id, gene_string:e.data.gene_string, aggregate_fitness:agg_fit};
	
	var c = e.data.counter + 1;
	postMessage({hello:"hello", counter:c});
};

