var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var session = models.session;

function loadDataFromCouch(trackid) {

	var url = 'http://festivalify.se:5984/feelings/_design/event/_view/all?startkey=["'+trackid+'",0.0]&endkey=["'+trackid+'","kebab"]'
	$.getJSON(url,
		function(data) {
			console.log(data);
	}); 
}

function addEventToCouch() {
	
	{
   		"track_id": null,
   		"x": 0,
   		"y": 0,
   		"easeType": "linear",
   		"duration": 1,
   		"length": 1,
   		"time": 0,
   		"data": "Hello world",
   		"type": "text",
   		"user_id": null
	}
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

function Drawable() {
	this.id = 'id'
	this.x = 0;
	this.y = 0;
	this.easeType = 'linear';
	this.duration = 1;
	this.length = 1;
	this.time = 0;
	this.renderobject = null;
}

function TextRenderObject(txt) {
	this.text = txt;
	
	this.addToOutput = function(pid) {
		// Append div text tag with id
		var item = document.createElement('div');
		output.append($('<div></div>')
				.text(this.text)
        		.attr({ id : pid })
        		.addClass("drawable"));
	}
}

function ImageRenderObject(imgurl) {
	this.src = imgurl;
	
	this.addToOutput = function(pid) {
		// Append div image tag with id
		var item = document.createElement('div');
		output.append($('<div></div>')
        		.attr("id", pid)
        		.addClass("drawable")
        		.append($('<img/>')
        		.attr({ src : this.src })));
	}
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
		
		addObject(obj);
		
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
