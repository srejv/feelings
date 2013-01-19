var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var session = models.session;

models.player.observe(models.EVENT.CHANGE, function(event) {
	console.log("Something changed!");
});

var output = $("#output");

var objqueue = new Queue();

function Drawable() {
	this.id = '#id'
	this.x = 0;
	this.y = 0;
	this.easeType = 'linear';
	this.duration = 1;
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
        		.attr({ id : pid })
        		.addClass("drawable")
        		.append($('<img/>')
        		.attr({ src : this.src })));
	}
}
	
function loadQueue() {
	var drawable = new Drawable();
	
	drawable.renderobject = new TextRenderObject("Hello world");
	drawable.x = 100;
	drawable.y = 100;
	drawable.time = 5;
	
	objqueue.enqueue(drawable);
}

$(document).ready(function() {
	init();
	$('#btnplay').click(function () {
		
		var easeType = $("#easingType").val();
		addOpacityTween('#label1', 0, 1, easeType, 10, 10);
		addOpacityTween('#label2', 5, 2, easeType, 100, 150);
		
		var t = player.track;
		player.play(t);
		$.play();
	});	
});

function init() {
	loadQueue();
	setInterval(timelineCallback, 1000);
}

function timelineCallback() {
	console.log("timeline callback");

	var pos = player.position;
	var time = pos / 1000;
	
	while(!objqueue.isEmpty() && (time > objqueue.peek().time - objqueue.peek().duration)) {
		var obj = objqueue.dequeue();
		console.log("Object dequeued");
		obj.renderobject.addToOutput();
		addOpacityTween(obj.id, obj.time, obj.duration, obj.easeType, obj.x, obj.y);
	}
}

function addOpacityTween(target, time, duration, easeType, x, y) {
	$(target).css('left', x).css('top', y);
	
	$(target).tween({
		opacity: {
			start: 0,
			stop: 100,
			time: time,
			duration: duration,
			effect: easeType
		}
	}).tween({
		opacity: {
			start: 100,
			stop: 0,
			time: time + duration,
			duration: duration,
			efect: easeType
		}
	});
}