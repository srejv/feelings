var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var session = models.session;
var uploadImg = new Image();
var currentTrack;
var output = $("#output");
var objqueue = [];
var currentObj = 0;

// kör varje callback 
function loadDataFromCouch(trackid) {
	var url = 'http://festivalify.se:5984/feelings/_design/event/_view/all?startkey=["'+trackid+'",0.0]&endkey=["'+trackid+'","kebab"]';
	
	$.getJSON(url,
		function(data) {
			// if(data.rows.length != objqueue) {  eller bara detta?
				if(data.rows.length > 0 && data.rows.length != objqueue.length) {
					
					if(trackid == currentTrack) {
					// javascript insert difference? fulhax
					reset();
					currentTrack = trackid;
					for(var i = 0; i < data.rows.length; i++) {
						var d = createEvent(data.rows[i].value);
						objqueue.push(d);
					}
				} 
				else {
					reset();
					currentTrack = trackid;
					for(var i = 0; i < data.rows.length; i++) {
						var d = createEvent(data.rows[i].value);
						objqueue.push(d);
					}
				}
			}
		}); 
}


function createEvent(row) {
	var d = new Drawable();
	d.id = row._id; // random unique identifier, doesn't matter
	d.x = row.x;
	d.y = row.y;
	d.easeType = row.easeType;
	d.duration = row.duration;
	d.length = row.length;
	d.time = row.time;

	if(row.event.type == 'image') {
		d.renderobject = new ImageRenderObject(row.event.url);
		d.renderobject.size_x = row.event.size_x;
		d.renderobject.size_y = row.event.size_y;
	} else if(row.event.type == 'text') {
		d.renderobject = new TextRenderObject(row.event.text);
		d.renderobject.size = row.event.size;
	} else if(row.event.type == 'background') {
		d.renderobject = new BackgroundRenderObject(row.event.color);
	}
	
	return d;
}

function addEventToCouch(trackid, x, y, easeType, duration, length, time, eventData) {
	
	var url = 'http://festivalify.se:5984/feelings/';
	var object = {
		"track_id": trackid,
		"x": x,
		"y": y,
		"easeType": easeType,
		"duration": duration,
		"length": length,
		"time": time,
		"event": eventData,
	};
	
	$.ajax({
		url: url,
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(object),

		complete: function() {
	    //called when complete
	},

	success: function() {
	    //called when successful
	},

	error: function() {
	    //called when there is an error
	},
});
	
}

models.player.observe(models.EVENT.CHANGE, function(e) {
	if(e.type = 'playerStateChanged') {
		var pos = player.position;
		var duration = player.track.data.duration;
		var duration_p = 100 / duration;
		var position_p = 100 / pos;
		current_p = Math.round(((duration_p / position_p) * 100 *0.85)*100)/100;
		var tt = player.track.data.uri;
		var text = tt;
		   var track = text.replace(/\bspotify:track:/, "");
		loadDataFromCouch(track);
		correctQueue(pos / 1000);
	}
});

function correctQueue(time) {
	var newid = 0;
	for(var i = 0; i < objqueue.length; i++) {
		if(objqueue[i].time - objqueue[i].duration < time) {
			newid = i;
		} else {
			break;
		}
	}
	
	if(newid != currentObj) {
		output.empty();
		currentObj = newid;
	}
}

function reset() {
	objqueue = [];
	currentObj = 0;
	output.empty();
}


$(document).ready(function() {
	setInterval(timelineCallback, 1000);

	//$('#slider').slider();
	
	
	$('#test_post').click(function () {
		/*
		var tt = player.track.data.uri;
		var text = tt;
	 	var fixed;
	    fixed = text.replace(/\bspotify:track:/, "");
	 
		addEventToCouch(fixed, 0, 0, "linear", 1, 1, 1, "lol", "text");
		*/
		
		//animateBackground("#FF00FF");

		//share();
		
	});	

	$('#output').click(function(e) {
		var yy = e.pageY -12; 
		var xx = e.pageX -11;
		var twinwidth = $(window).width();
		var twinheight = $(window).height();
					
		var  tperwid =   xx  / twinwidth;
		var  tperhet =   yy  /   twinheight;
		
		  
		
		var pos = player.position;
		$( "#text-add" ).dialog({
			resizable: false,
			modal: true,
			buttons: {
				"Add text": function() {
					eventData = {
						"type": "text",
						"size": "20",
						"text": $("#textinput").val()
					};
					var tt = player.track.data.uri;
					var text = tt;
					var ctrack = text.replace(/\bspotify:track:/, "");
					addEventToCouch(ctrack, tperwid * 100, tperhet * 100, "linear", 1, $( "#slider-ranger-max" ).slider( "value" ), (pos/1000), eventData);
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});

		$( "#slider-ranger-max" ).slider({
			range: "max",
			min: 1,
			max: 10,
			value: 2,
			slide: function( event, ui ) {
				$( "#amounte" ).val( ui.value );
			}
		});
		$( "#amounte" ).val( $( "#slider-ranger-max" ).slider( "value" ) );
	});
});

function timelineCallback() {

	var pos = player.position;
	var time = pos / 1000;
	
	while(objqueue[currentObj] && (time >= (objqueue[currentObj].time - objqueue[currentObj].duration))) {
		var obj = objqueue[currentObj];
		currentObj = currentObj + 1;
		
		if(time >= obj.time + obj.length) {
			continue;
		}

		if(obj.type != "background") {
			addObject(obj);
		} else {
			console.log("tjj");
			animateBackground(obj.color);
		}
		
	}
}
function addObject(obj) {
	obj.renderobject.addToOutput(obj.id);
	$('#'+obj.id).css('float','left').css('margin-left', obj.x + "%").css('margin-top', obj.y + "%").css('z-index', currentObj)
	.fadeTo(0,0,"linear", function() {
		$('#'+obj.id).fadeTo(obj.duration*1000, 1, "linear", function() {
			setTimeout(function(){
				$('#' + obj.id).fadeTo(obj.duration*1000, 0, "linear", function() {
					$('#' + obj.id).remove();
				});
			}, obj.length*1000);
		})});
}


var droppables = document.querySelectorAll('.droppable');

[].forEach.call(droppables, function(droppable) {
	droppable.addEventListener('dragenter', handleDragEnter, false)
	droppable.addEventListener('dragover', handleDragOver, false);
	droppable.addEventListener('dragleave', handleDragLeave, false);
	droppable.addEventListener('drop', handleDrop, false);
});

function handleDragEnter(e) {
	this.style.background = '#444444';
}

function handleDragOver(e) {
	e.preventDefault();

	e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.

	return false;
}

function handleDragLeave(e) {
	this.style.background = '#333333';
}

function handleDrop(e) {
	this.style.background = '#333333';
	e.stopPropagation(); // Stops some browsers from redirecting.
	e.preventDefault();

	switch (e.dataTransfer.types[0]) {
		case "Files":
		var ctx = document.getElementById('canvas').getContext('2d'), reader = new FileReader;

		reader.onload = function(event) {
			var img = new Image();

			img.onload = function() {
				canvas.width = img.width;
				canvas.height = img.height;

				ctx.drawImage(img, 0,0);

				share(img.width, img.height);
			};

			img.src = event.target.result;
		};

		reader.readAsDataURL(e.dataTransfer.files[0]);

		break;
	}
}

// Gets the direct url from an imgur id?
function getImage(imageid) {
	$.ajax({
		url: 'https://api.imgur.com/3/image/'+imageid,
		type: 'GET',
		dataType: 'json'
	}).success(function(data) {
		alert("getimagesuccess");
		return data.link;
	}).error(function() {
		alert("ERROR!");
	});
	
	return "";
}

function share(x, y){
	try {
		var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
	} catch(e) {
		var img = canvas.toDataURL().split(',')[1];
	}
    // open the popup in the click handler so it will not be blocked
    var w = window.open();
    w.document.write('Uploading...');
    // upload to imgur using jquery/CORS
    // https://developer.mozilla.org/En/HTTP_access_control
    $.ajax({
    	url: 'http://api.imgur.com/2/upload.json',
    	type: 'POST',
    	data: {
    		type: 'base64',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            key: '75e600ffae7109a47b3c2130ef80073f',
            name: 'neon.jpg',
            title: 'test title',
            caption: 'test caption',
            image: img
        },
        dataType: 'json'
    }).success(addImage).error(function() {
    	alert('Could not reach api.imgur.com. Sorry :(');
    		w.close();
    	});
}

function addImage(data) {
	var url = data.upload.links.original;
	var width = 200;
	var height = 200;
	var pos_x = 40; //in percent 0 - 100
	var pos_y = 20; //in percent 0 - 100
	var easein_easeouttime = 1; //in seconds
	var showtime = 2; //in seconds
	var position = 15; //time to trigger, fetch from player position
	var endW;
	var endH;
	var pos = player.position;

	$("#appender").html('<img width="150px" src="'+data.upload.links.large_thumbnail+'">');
	$("#image_add").html('<img id="rezimg" width="150px" src="'+data.upload.links.original+'">');
	$("#image_add").show("fast");
	$("#image_add").draggable();
	$('#image_add').resizable({

		resize : function(event,ui) {
			endW = $(this).width();
			endH = $(this).height();
			st = $('#image_add').scrollTop();
			sl = $('#image_add').scrollLeft();
			$('#rezimg').attr('width',endW);
			$('#rezimg').attr('height',endH);
			//alert("width changed:"+ (sl) + " -- Height changed:" + (st));

		}
	});
	$( "#save_image" )
	.button()
	.click(function( event ) {
		$( "#dialog-confirm" ).dialog({
			resizable: false,
			modal: true,
			buttons: {
				"Add image": function() {
					eventData = {
						"type": "image",
						"url": data.upload.links.original,
						"size_x": endW,
						"size_y": endH
					};
					var tt = player.track.data.uri;
					var text = tt;
					
					var winwidth = $(window).width();
					var winheight = $(window).height();
					
					var  perwid = $('#image_add').position().left  / winwidth;
					var  perheg = $('#image_add').position().top  / winheight;
					
					var x = $('#image_add').position().left;
					
					
					
					var ctrack = text.replace(/\bspotify:track:/, "");
					addEventToCouch(ctrack, perwid , perheg, "linear", easein_easeouttime, $( "#slider-range-max" ).slider( "value" ), (pos/1000), eventData);
					
					$( this ).dialog( "close" );
					$('#save_image').hide("fast");
					$('#image_add').fadeOut("fast");
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});

		$( "#slider-range-max" ).slider({
			range: "max",
			min: 1,
			max: 10,
			value: 2,
			slide: function( event, ui ) {
				$( "#amount" ).val( ui.value );
			}
		});
		$( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );
	});
$('#save_image').show("fast");

