'use strict';
//------------------- LOW LEVEL ENGINE DEFINITIONS ------------------------//

//in order to use keyboard events, you'll need to follow a similar pattern.
//I used KeyDrown, a lightweight javascript extension. 
//but in theory anything works, just follow that pattern.
//you'll need to define a new key in the same fashion (and in the default "stdobj" later)
kd.A.down(function(){
	if (gameobjects.length>0)
	gameobjects.forEach(function(o,i)
    	{
    		gameobjects[i].keydown_A(i);
    	})
})

kd.D.down(function(){
	if (gameobjects.length>0)
	gameobjects.forEach(function(o,i)
    	{
    		gameobjects[i].keydown_D(i);
    	})
})

kd.W.down(function(){
	if (gameobjects.length>0)
	gameobjects.forEach(function(o,i)
    	{
    		gameobjects[i].keydown_W(i);
    	})
})

kd.S.down(function(){
	if (gameobjects.length>0)
	gameobjects.forEach(function(o,i)
    	{
    		gameobjects[i].keydown_S(i);
    	})
})

document.body.addEventListener('click', function(){
	if (gameobjects.length>0)
	gameobjects.forEach(function(o,i){
		//var i=0; i<gameobjects.length; i++
		gameobjects[i].click_lm(i);
	})

}, true); 

var gameobjects=[];

//this is default object. Make sure everything that would break your game if it's missing is included here. 
//thanks Mcmonkey for fixing this!
function stdobj(){
	return	{
		x:0,
		y:0,
		id:0,
		type:0,
		dir:0,
		create:function(){},
		destroy:function(){},
		step:function(){},
		keydown_A:function(){},
		keydown_D:function(){},
		keydown_W:function(){},
		keydown_S:function(){},
		click_lm:function(){},
		click_rm:function(){},
		draw:function(){}
	}
};

var mpos={x:0,y:0}

$("body").mousemove(function(e) {
    mpos.x = e.pageX;
   	mpos.y = e.pageY;
})

var canvas = document.getElementById('canvas');
	if (canvas.getContext) 
	{
    	var ctx = canvas.getContext('2d');
    }

var main=function(){
	//instance_create(oRoomMng,0,0)

	drawscr();
}



function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}
window.onresize = function(event) {
resizeDiv();
}


function resizeDiv() {
	var vpw = $(window).width();
	var vph = $(window).height();


	var m=detectmob()

	if (m)
	{

	}
}

//------------------------------ MID LEVEL ENGINE -------------------------//
//draw frame event. 
function drawscr(){
	ctx.clearRect(0, 0, 800, 800)
	ctx.fillStyle="black"
	ctx.fillRect(0,0,800,800)

	//keydrown needs this.
	kd.tick();

	if (gameobjects.length>0)
	gameobjects.forEach(function(o,i)
	{
		gameobjects[i].draw(i);
	})

	if (gameobjects.length>0)
	gameobjects.forEach(function(o,i)
	{
		gameobjects[i].step(i);
	})

	requestAnimationFrame(drawscr);
}

$(document).ready(main)
$(document).ready(resizeDiv)

function lengthdir(dis, dir)
{
	var xp=Math.cos(dtr(-dir)) * dis 
	var yp=Math.sin(dtr(-dir)) * dis

	return {x:xp, y:yp}
}

function instance_create(obj,x,y)
{
	//console.log(JSON.stringify(obj));

	var l=gameobjects.length;
	gameobjects.push(obj)

	gameobjects[l].x=x
	gameobjects[l].y=y

	gameobjects[l].id=l

	gameobjects[l].create(l);

	return l;
}

function instance_destroy(id)
{
	gameobjects[id].destroy(id);

	gameobjects[id]=stdobj();
}

function dtr(inp)
{
	return ((inp*Math.PI)/180)
}

function angle_difference(x,y)
{
	x=dtr(x)
	y=dtr(y)
	var res=Math.atan2(Math.sin(x-y), Math.cos(x-y))
	res=res*180/Math.PI
	return res
}

function point_distance(x1,y1,x2,y2)
{
	return (Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)))
}

function point_direction(x1,y1,x2,y2)
{
	return (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
}

function draw_sprite(sprite, x,y, angle)
{
	var ang=-dtr(angle);

	var width = sprite.width;
	var height = sprite.height;

	ctx.translate(x, y);
	ctx.rotate(ang);
	ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
	ctx.rotate(-ang);
	ctx.translate(-x, -y);
}

function project(pnt,subt,axis)
{
	//var s=(((pnt.x-subt.x)*axis.x)+((pnt.y-subt.y)*axis.y))/(Math.pow(axis.x,2)+Math.pow(axis.y,2))
	var s=(((pnt.x)*axis.x)+((pnt.y)*axis.y))/(Math.pow(axis.x,2)+Math.pow(axis.y,2))
	return {x:s*axis.x,y:s*axis.y}
}

function dotp(a,b)
{
	return ((a.x*b.x)+(a.y*b.y))
}

function point_in_triangle(a,b,c,p){
    let twoA = b.x*c.y - b.y*c.x + (c.x-b.x)*a.y + (b.y-c.y)*a.x;
    let sign = twoA < 0 ? -1 : 1;
    let s = (a.y*c.x - a.x*c.y + (c.y-a.y)*p.x + (a.x-c.x)*p.y)*sign;
    let t = (a.x*b.y - a.y*b.x + (a.y-b.y)*p.x + (b.x-a.x)*p.y)*sign;
    return s > 0 && t > 0 && s+t < twoA*sign;
}

function point_in_rectangle(x,y,height,width,dir,p){
	//x,y are origin
	// p is point in question
	//This function is specific for collisions using the sprite.

	var a1=lengthdir(height/2,dir-90);
	var a2=lengthdir(width/2,dir);

	var UR={x:x+a1.x+a2.x,y:y+a1.y+a2.y}
	var UL={x:x+a2.x-a1.x,y:y+a2.y-a1.y}
	var BR={x:x+a1.x-a2.x,y:y+a1.y-a2.y}
	var BL={x:x-(a1.x+a2.x),y:y-(a1.y+a2.y)}

	var t1=point_in_triangle(UR,UL,BR,p)
	var t2=point_in_triangle(BL,UL,BR,p)

	return (t1 || t2)
}

//raycasting collision system. Sprite masks used as collision masks.
function rc_col(id,len,dir,type){
	//id of triggering body, length of ray, direction of ray, type of target
	var col=-1;
	var dis=5*len
	//create list of possible targets
	var list=[];

	gameobjects.forEach(function(ol,i){
		if (ol.type==type)
		{
			if (point_distance(gameobjects[id].x,gameobjects[id].y,ol.x,ol.y)<dis)
			{
				list.push(i);
			}
		}
	})

	var xx=gameobjects[id].x
	var yy=gameobjects[id].y
	var ld=lengthdir(4,dir)

	for (var i=0; i<len; i+=4)
	{
		xx+=ld.x
		yy+=ld.y

		list.forEach(function(o,i){
			var t=gameobjects[list[i]]

			var r=point_in_rectangle(t.x,t.y,t.sprite.width,t.sprite.height,t.dir,{x:xx,y:yy})

			if (r)
			{
				col=list[i]
			}
		})
	}

	return col;
}

//--------------------- SPRITE DEFINITIONS ----------------------------------//
//this is how you define a sprite.
var sShip=new Image();
sShip.src="spr_ship.png"

//--------------------- OBJECT DEFINITIONS ----------------------------------//
//this is how you define an object.
function oShip(){
	//first create a temporary var to hold everything
	//set it to stdobj();
	var temp=stdobj();
	//define everything you need to; sprite is optional. Type is mandatory for collision functions.
	temp.sprite=sShip;
	temp.type=2
	temp.create=function(id){
		gameobjects[id].xspd=0;
	};
	//step happens once a step
	temp.step=function(id){
		if (Math.abs(gameobjects[id].xspd)>0)
		{
			gameobjects[id].x+=gameobjects[id].xspd
		}

		if (Math.abs(gameobjects[id].yspd)>0)
		{
			gameobjects[id].y+=gameobjects[id].yspd
		}

		gameobjects[id].xspd=gameobjects[id].xspd*.6;
		gameobjects[id].yspd=gameobjects[id].yspd*.6;
	};
	temp.keydown_A=function(id){
		gameobjects[id].xspd=-5
	};
	temp.keydown_D=function(id){
		gameobjects[id].xspd=5
	};

	temp.keydown_W=function(id){
		gameobjects[id].yspd=-5
	};
	temp.keydown_S=function(id){
		gameobjects[id].yspd=5
	};
	temp.click_lm=function(id){
		//console.log(JSON.stringify(oBullet))
		var n=instance_create(oBullet(),gameobjects[id].x,gameobjects[id].y-16)
		gameobjects[n].spd=20;
		gameobjects[n].dir=90-4+(Math.random()*8);

		gameobjects[id].yspd=Math.min(gameobjects[id].yspd+3,7)
	}

	//draw also happens once a step.
	temp.draw=function(id){
		draw_sprite(gameobjects[id].sprite,gameobjects[id].x,gameobjects[id].y,0)
	};

	//this must be present for the object definition to work.
	return temp;
}


instance_create(oShip(),400,700)
