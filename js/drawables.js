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
	this.size_x = 0;
	this.size_y = 0;
	
	this.addToOutput = function(pid) {
		// Append div image tag with id
		var item = document.createElement('div');
		output.append($('<div></div>')
        		.attr("id", pid)
        		.addClass("drawable")
        		.append($('<img/>')
        		.attr({ src : this.src, width: this.size_x, height: this.size_y })));
	}
}

function BackgroundRenderObject(color){
	this.color = color;
	this.type = "background";
	this.addToOutput = function(pid) {
		if($("#color").css("display") == "none") {
			$("#color").css("background-color", color);
			$("#color").fadeIn("slow");
		} else {
			$("#color").fadeOut("slow", function() {
				$("#color").css("background-color", color);
				$("#color").fadeIn("slow");
      		});
		}
	}
}