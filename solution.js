//where the actual work is being done - the rest is just scaffolding
function analyzeText(text) {
    var wordCounts = {};
    //count the number of times each word appears
    $.each(tokenize(text),
	     function() {
		 var old = wordCounts[this] || 0;
		 wordCounts[this] = old+1;
		 });
    delete wordCounts[""]; //remove counts of non-words (e.g., '9' which tokenize transforms to an empty string

    var sortableCounts = []; //objects' properties are unordered, so have to move data into an array
    for(var word in wordCounts) {
	sortableCounts.push({ "word" : word,
			      "count" : wordCounts[word]});	
    }

    //sort the words in the corpus by frequency
    sortableCounts.sort(function(a, b) {
			    return b.count - a.count;
			});
    sortableCounts.length = Math.min(5, sortableCounts.length); //truncate to just the top 5 results
    return sortableCounts;
}

//A really naive and slow 'word tokenizer'. 
//In a real program, I'd probably parse a stream as I read it using
//a more standard english tokenizing algorithm
function tokenize(text) {
    return $.map(text.split(/\s+/),
		 function(word) { 
		     word = word.toLowerCase();
		     word = word.match(/.*?([a-z]+[\']?[a-z]*).*?/); //strip punctuation except for one internal apostraphe
		     return word ? word[1] : ""; //if there's no match for the word (e.g., '8'), return an empty string
		 });
}

$(document).ready(
    function() {
	var defaultText = "Please enter the text to be analyzed here";
	setDefaultText($("#corpus"), defaultText);

	$("#analyze").click(
	    function() {
		var o = $("#output");
		o.empty();

		var textToAnalyze = $("#corpus").val();
		
		if(textToAnalyze == defaultText || textToAnalyze == "") {
		    o.append('<p class="error">Please enter some text for me to analyze</p>');
		    return;
		}

		var results = analyzeText(textToAnalyze);
		if(results.length == 0) {
		    o.append('<p class="error">Please enter some valid words for me to analyze</p>');
		    return;
		}

		//write out the results to HTML
		o.append("<table><tr><th>Word</th><th>Occurrences</th></tr>");
		$.each(results, 
		       function() {
			   o.append('<tr><td>' + this.word + '</td><td>' + this.count + '</td></tr>');
		       });
		o.append("</table>");
	    });
    });

//just a little helper to provide the 'hint' text in the textarea
function setDefaultText(area, defaultText) {
    area.val(defaultText);
    area.css("color","gray");

    area.focus(function() {
		   if(area.val() == defaultText) {
		       area.val("");
		       area.css("color","black");
		   }
	       });

    area.blur(function() {
		  if(area.val() == "") {
		      area.css("color","gray");
		      area.val(defaultText);
		  }
	      });

}
