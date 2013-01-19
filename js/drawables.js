output = $('#output');

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
	this.type = "text";
	
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
	this.type ="image";
	
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

function BackgroundRenderObject(color){
	this.color = color;
	this.type = "background";
	this.addToOutput = function(pid) {

	}
}