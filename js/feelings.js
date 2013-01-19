var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var session = models.session;

function loadDataFromCouch(trackid) {

	var url = 'http://festivalify.se:5984/feelings/_design/event/_view/all?startkey=["'+trackid+'",0.0]&endkey=["'+trackid+'","kebab"]';
	
	//console.log(url);
	
	$.getJSON(url,
		function(data) {
			if(data.rows.length > 0) {
				objqueue = [];
				for(var i = 0; i < data.rows.length; i++) {
					var d = createEvent(data.rows[i].value);
					objqueue.push(d);
				}
			}
			//console.log(data);
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
	} else if(row.event.type == 'text') {
		d.renderobject = new TextRenderObject(row.event.data);
	} else if(row.event.type == 'background') {
		d.renderobject = new BackgroundRenderObject(row.event.color);
	}
	
	return d;
}

function addEventToCouch(trackid, x, y, easeType, duration, length, time, data, type) {
	
	var url = 'http://festivalify.se:5984/feelings/';
	var object = {
   		"track_id": trackid,
   		"x": x,
   		"y": y,
   		"easeType": easeType,
   		"duration": duration,
   		"length": length,
   		"time": time,
   		"data": data,
   		"type": type,
   		"user_id": null
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
	 	var fixed;
	    fixed = text.replace(/\bspotify:track:/, "");
	 
	 	loadDataFromCouch(fixed);
	 	CorrectQueue(pos / 1000);
	}
});

function CorrectQueue(time) {
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

var output = $("#output");

var objqueue = [];
var currentObj = 0;

function reset() {
	objqueue = [];
	currentObj = 0;
	output.empty();
}


	
function loadQueue() {
	var drawable = new Drawable();
	
	drawable.renderobject = new TextRenderObject("Hello world");
	drawable.x = 50;
	drawable.y = 50;
	drawable.time = 5;
	drawable.id = "derp";
	
	objqueue.push(drawable);
	
	drawable = new Drawable();
	
	drawable.renderobject = new ImageRenderObject('/images/381460.jpeg');
	drawable.x = 10;
	drawable.y = 15;
	drawable.time = 10;
	drawable.id = "img";
	drawable.easeType = 'quadIn';
	
	objqueue.push(drawable);	
	
	
	drawable = new Drawable();
	
	drawable.renderobject = new ImageRenderObject('images/dwid.gif');
	drawable.x = 30;
	drawable.y = 30;
	drawable.time = 15;
	drawable.length = 5;
	drawable.id = "dwit";
	
	objqueue.push(drawable);
	
	drawable = new Drawable();
	
	drawable.renderobject = new BackgroundRenderObject('images/dwid.gif');
	drawable.x = 30;
	drawable.y = 30;
	drawable.time = 15;
	drawable.length = 5;
	drawable.id = "dwit";
	
	objqueue.push(drawable);
	
	
}

$(document).ready(function() {
	init();
	$('#btnplay').click(function () {
		
		//var easeType = $("#easingType").val();
		//addOpacityTween('#label1', 0, 1, easeType, 10, 10);
		//addOpacityTween('#label2', 5, 2, easeType, 100, 150);
		
		reset();
		loadQueue();
		
		var t = player.track;
		player.playing = false;
		player.position = 0;
		player.play(t);
	});	
	
	
	$('#test_post').click(function () {
		var tt = player.track.data.uri;
		var text = tt;
	 	var fixed;
	    fixed = text.replace(/\bspotify:track:/, "");
	 
		addEventToCouch(fixed, 0, 0, "linear", 1, 1, 1, "lol", "text");
	});	
});

function init() {
	setInterval(timelineCallback, 1000);
}

function timelineCallback() {

	var pos = player.position;
	var time = pos / 1000;
	
	while(objqueue[currentObj] && (time >= (objqueue[currentObj].time - objqueue[currentObj].duration))) {
		var obj = objqueue[currentObj];
		currentObj = currentObj + 1;
		
		if(obj.type != "background") {
			addObject(obj);
		} else {
			animateBackground(obj.color);
		}
		
	}
}
function addObject(obj) {
	obj.renderobject.addToOutput(obj.id);
	$('#'+obj.id).css('left', obj.x + "%").css('top', obj.y + "%")
		.fadeTo(0,0,"linear", function() {
			$('#'+obj.id).fadeTo(obj.duration*1000, 1, "linear", function() {
			setTimeout(function(){
  				$('#' + obj.id).fadeTo(obj.duration*1000, 0, "linear", function() {
  					$('#' + obj.id).remove();
  				});
			}, obj.length*1000);
		})});
}


var drop = document.querySelector('#friend-drop');

drop.addEventListener('dragenter', handleDragEnter, false);
drop.addEventListener('dragover', handleDragOver, false);
drop.addEventListener('dragleave', handleDragLeave, false);
drop.addEventListener('drop', handleDrop, false);

function handleDragEnter(e) {
	this.style.background = '#444444';
}

function handleDragOver(e) {
	e.preventDefault();

	e.dataTransfer.dropEffect = 'link'; // See the section on the DataTransfer object.

	return false;
}

function handleDragLeave(e) {
	this.style.background = '#333333';
}

function handleDrop(e) {
	this.style.background = '#333333';
	e.stopPropagation(); // Stops some browsers from redirecting.
	e.preventDefault();
	
	console.log(e.dataTransfer);
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

// Supposed to upload an image FILE to imgur
function uploadImageFileToImgur(image) {
	// open the popup in the click handler so it will not be blocked
    var w = window.open();
    w.document.write('Uploading...');
    // upload to imgur using jquery/CORS
    // https://developer.mozilla.org/En/HTTP_access_control
    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'POST',
        data: {
            type: 'file',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            key: '75e600ffae7109a47b3c2130ef80073f',
            image: image
        },
        dataType: 'json'
    }).success(function(data) {
        w.location.href = data['upload']['links']['imgur_page'];
    }).error(function() {
        alert('Could not reach api.imgur.com. Sorry :(');
        w.close();
    });
}

// imgur api: 75e600ffae7109a47b3c2130ef80073f
function uploadURLToImgur(url) {
	
    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'POST',
        data: {
            type: 'URL',
            key: '75e600ffae7109a47b3c2130ef80073f',
            image: url
        },
        dataType: 'json'
    }).success(function(data) {
    	// Return data? just the link?
        //w.location.href = data['upload']['links']['imgur_page'];
        console.log(data);
    }).error(function() {
        console.log('Could not reach api.imgur.com. Sorry :(');
    });
}

function animateBackground(color) {
	$(document.body).animate({ 
		backgroundColor:color
	}, 1000); 
}

/*

           _     ___   ___  _  __     _  _____   __  ____   __         
          | |   / _ \ / _ \| |/ /    / \|_   _| |  \/  \ \ / /         
          | |  | | | | | | | ' /    / _ \ | |   | |\/| |\ V /          
          | |__| |_| | |_| | . \   / ___ \| |   | |  | | | |           
          |_____\___/ \___/|_|\_\ /_/   \_\_|   |_|  |_| |_|           
                                                                       
                     __        ___    _   _  ____                      
                     \ \      / / \  | \ | |/ ___|                     
                      \ \ /\ / / _ \ |  \| | |  _                      
                       \ V  V / ___ \| |\  | |_| |                     
                        \_/\_/_/   \_\_| \_|\____|                     
                                                        .   .          
                                                       /(  /(          
                                                      /  \/  \         
                                               /(/(  /    \___\        
                                              /  \.-~         ~-._     
                                        /^\.-~   __            /^~~~^\ 
        ___                        /\.-~       /~  ~\         (o\   /o)
       (_  `.                 /\.-~            |    |         |.     .|
         `.  :           /\.-~  __             |    |         |\'. .'/|
        ,' .'          .~    .-~  ~-.          |    |         |\\___//|
      .' .'           /     :        \         (    |    _.-~`\ \) )/ /
   .'  .'           .'      \         \         \   \_.-~      \_( (_/ 
 .'  .'           .'        '\         \        .\   \___        )/\)  
(   (           .'            \         \   _.-~  \_  _ _\             
`   '.        .'               \         \-~        `\\\\\\            
 `    '.    .'                  \        /           )/)/)/            
  `     '..'                ___.~)      /`-.                           
   `                      _-    /      /    `-.(\                      
    `.                  _-/-._.-\     /-.        \                     
      `-._            .'  \    ( \   /   `-._     :                    
          '---..__---~     \   | /   \_     (____.'                    
                            \__||     ~-.___                           
      jro                    \/ /__________/>
      

*/
