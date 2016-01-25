var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var sources = {};

function getData(filename) {
  var source = audioCtx.createBufferSource();
  request = new XMLHttpRequest();

  request.open('GET', filename, true);

  request.responseType = 'arraybuffer';


  request.onload = function() {
	var audioData = request.response;

	audioCtx.decodeAudioData(audioData, function(buffer) {
		source.buffer = buffer;

		source.connect(audioCtx.destination);
		source.loop = true;
	  },

	  function(e){"Error with decoding audio data" + e.err});

  }

  request.send();
  
  return source;
}


updateSoundBindings = function() {
	Exhibit.jQuery(".exhibit-facet").each(function() {
		var soundname = Exhibit.jQuery(this).attr("ex:expression").substring(1);
		Exhibit.jQuery(this).find(".exhibit-facet-value").not(".exhibit-facet-value-selected").click( function() {
			sources[soundname] = getData("sounds/" + soundname + ".mp3");
			sources[soundname].start(0);
			updateSoundBindings();
		});
		Exhibit.jQuery(this).find(".exhibit-facet-value-selected").add(".exhibit-facet-header-filterControl").add(".exhibit-action:contains('Reset All Filters')").click( function() {
			if (sources[soundname]) {
				sources[soundname].stop(0);
				updateSoundBindings();
			}
		});
	});
};

Exhibit.onjQueryLoaded(function() {			
	Exhibit.jQuery(document).on("exhibitConfigured.exhibit", function() {
		updateSoundBindings();
	});
});