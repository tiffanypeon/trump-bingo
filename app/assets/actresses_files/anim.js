// 728x090 Flashtalking

function initVars(){

	window.slingLogo		= exportRoot.slingLogo;
	window.trejo03			= exportRoot.trejo03;

	window.line_1_1			= exportRoot.line_1_1;
	window.line_1_2			= exportRoot.line_1_2;
	//window.line_1_3			= exportRoot.line_1_3;
	// window.line_1_4			= exportRoot.line_1_4;
	// window.line_1_5			= exportRoot.line_1_5;
	// window.line_1_6			= exportRoot.line_1_6;

	window.line_2_1			= exportRoot.line_2_1;
	//window.line_2_2			= exportRoot.line_2_2;
	window.line_2_3			= exportRoot.line_2_3;
	window.line_2_4			= exportRoot.line_2_4;
	window.line_2_5			= exportRoot.line_2_5;
	//window.line_2_6			= exportRoot.line_2_6;
	//window.line_2_7			= exportRoot.line_2_7;
	//window.line_2_8			= exportRoot.line_2_8;
	//window.line_2_9			= exportRoot.line_2_9;

	window.line_3_1			= exportRoot.line_3_1;
	window.line_3_2			= exportRoot.line_3_2;
	//window.line_3_3			= exportRoot.line_3_3;

	window.legal			= exportRoot.legal;

	// end editable vars

	window.loading = document.getElementById("loading");
	//window.ctaBuilt = false;
	//window.earlyOver = false;

	window.loopNum = 3;

	initPlayback();
}

function restart_tl(position){
	loopNum++;
	console.log("loop: "+loopNum);
	tl.play(position);
}

function runGSAP() {

	addListeners();

	tl = new TimelineLite();

	console.log("runGSAP");

	window.imgEase = Power3.easeOut;
	enterEase = Power2.easeOut;
	exitEase = Power3.easeIn;
	enter = 0.5;

	tl

	.to( loading		, 	0.5,		{	opacity:0	}) // fade out loader
	// .call(contCanvas)

	.from(	canvas,	0.5,		{	opacity:0	})

	.from(	slingLogo	,	0.5, 	{	alpha:0, x:xHide, ease:enterEase })
	.from(	trejo03		,	0.8, 	{	alpha:0  })

	.from(	line_1_1 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_1"				)
	.from(	line_1_2 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase	},"line_1+=.125"		)
	//.from(	line_1_3 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_1+=.250"		)

	// .from(	line_1_4 	,	enter,		{	x:xHide, ease:enterEase 	},"line_1+=.375"		)
	// .from(	line_1_5 	,	enter,		{	x:xHide, ease:enterEase 	},"line_1+=.500"		)
	// .from(	line_1_6 	,	enter,		{	x:xHide, ease:enterEase 	},"line_1+=.625"		)

	// .from(	tune_in		,  0.5,  {	y:yHide,  ease:Power2.easeOut	})

	.call(pauseGSAP)
	.to(	line_1_1 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_1out"			)
	.to(	line_1_2 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_1out+=.125"		)
	//.to(	line_1_3 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_1out+=.250"		)
	// .to(	line_1_4	,	exit,		{	x:xHide, ease:exitEase		},"line_1out+=.375"		)
	// .to(	line_1_5	,	exit,		{	x:xHide, ease:exitEase		},"line_1out+=.500"		)
	// .to(	line_1_6 	,	exit,		{	x:xHide, ease:exitEase		},"line_1out+=.625"		)

	.from(	line_2_1 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_2"				)
	//.from(	line_2_2 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase	},"line_2+=.125"		)
	//.from(	line_2_3 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase	},"line_2+=.250"		)

	.from(	line_2_3 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase	},"line_2+=.250"		)
	//.from(	line_2_4	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_2+=1"		)
	.call(pauseGSAP)
	.to(	line_2_3 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_2aout"			)
	//.to(	line_2_4	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_2aout+=.125"	)

	.from(	line_2_4	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_2b"				)
	//.from(	line_2_7	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_2b+=.125"		)
	.call(pauseGSAP)
	.to(	line_2_4	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_2bout"			)
	//.to(	line_2_7	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_2bout+=.125"	)

	.from(	line_2_5	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_2c"				)
	//.from(	line_2_7	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_2c+=.125"		)
	.call(pauseGSAP)
	.to(	line_2_1 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_2cout"			)
	//.to(	line_2_2 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_2cout+=.125"	)
	.to(	line_2_5 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase		},"line_2cout+=.250"	)
	//.to(	line_2_7	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase 	},"line_2cout+=.375"	)
	//.to(	line_2_9	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase 	},"line_2cout+=.500"	)

	.from(	line_3_1 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_3"				)
	.from(	line_3_2 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_3+=.125"		)
	//.from(	line_3_3 	,	enter,		{	scaleX:0, scaleY:0, alpha:0 , ease:enterEase 	},"line_3+=.250"		)
	.from(	legal 		,	0.7,			{	alpha:0					 						},"line_3+=.500"				)
	// .from(	line_3_5 	,	enter,		{	x:xHide, ease:enterEase 	},"line_3+=.500"		)

	.add( function(){ // lpause at end before looping
			if (loopNum >= 3){ tl.pause(); }
			else {
				tl.pause();
				setTimeout(	function(){	tl.resume(); }, (pause * 1000));
			}
		} )

	.to(	line_3_1 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase 	},"loopOut"		)
	.to(	line_3_2 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase 	},"loopOut"		)
	// .to(	line_3_3 	,	exit,		{	scaleX:0, scaleY:0, alpha:0 , ease:exitEase 	},"loopOut"		)
	.to(	legal 		,	exit,		{	alpha:0					 						},"loopOut"		)

	;

}

function initPlayback() {

	stage = new createjs.Stage(canvas);
	stage.addChild(exportRoot);
	stage.update();

	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED; //AdHelper.js

	createjs.Ticker.setFPS(lib.properties.fps);
	createjs.Ticker.addEventListener("tick", stage);
	// stage.snapToPixelEnabled = true;
	var ad = new createjs.AdHelper(stage)
		// .setSleep(15,0,15)
		.timeSync()
		.watchFPS(15, 1);

	exportRoot.gotoAndStop(0);

	runGSAP();
}

function addListeners() {
	loading.addEventListener("mouseover",	over);
	loading.addEventListener("mouseout",	out);
	loading.style.cursor="pointer";
}

function over() {
	if(ctaBuilt === false){
		earlyOver = true;
		exportRoot.cta.gotoAndPlay("ctaBuild");
	}
	else {
		exportRoot.cta.gotoAndPlay("ctaOver");
	}

	ctaBuilt = true;
}

function out() {
	exportRoot.cta.gotoAndPlay("ctaOut");
}

var tl;

var initDelay 	= 0.25; // hide initial flash of content until gsap positions everything
var pause 		= 1.25;
var enter 		= 1;
var exit 		= 0.5;

//var enterEase 	= Elastic.easeOut.config(0.75,0.5);
var enterEase 	= Elastic.easeOut.config(0.7,0.7);
var exitEase 	= Back.easeIn.config(1.3);

var xHide = -728;
var xHideRight = 728;
var yHide = 90;


function ctaBuild(){
	if(ctaBuilt === false){
		exportRoot.cta.gotoAndPlay("ctaBuild");
		ctaBuilt = true;
	}
}

function contCanvas() {
	exportRoot.play();
}

function contGSAP() {
	tl.resume();
}

function pauseGSAP() {
	tl.pause();
	setTimeout(contGSAP, (pause * 1000));
}
