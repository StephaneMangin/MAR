/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
		{ 
			// Level 0 includes
			ModulesLoader.requireModules(["threejs/three.min.js"]) ;
			ModulesLoader.requireModules([
                "myJS/ThreeRenderingEnv.js",
                "myJS/ThreeLightingEnv.js",
                "myJS/ThreeLoadingEnv.js",
                "myJS/navZ.js",
                "FlyingVehicle.js",
                "Helico.js"]) ;
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start()
{

    // car Position
    var CARx = -220;
    var CARy = 0 ;
    var CARz = 0 ;
    var CARtheta = 0 ;
    // car speed
    var dt = 0.05;
    var dx = 1.0;
	//	----------------------------------------------------------------------------
	//	MAR 2014 - TP Animation hélicoptère
	//	author(s) : Cozot, R. and Lamarche, F.
	//	---------------------------------------------------------------------------- 			
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};
	
	//	rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();

    //	Meshes
    Loader.loadMesh('assets','border_Zup_02','obj',	renderingEnvironment.scene,'border',	-340,-340,0,'front');
    Loader.loadMesh('assets','ground_Zup_03','obj',	renderingEnvironment.scene,'ground',	-340,-340,0,'front');
    Loader.loadMesh('assets','circuit_Zup_02','obj',renderingEnvironment.scene,'circuit',	-340,-340,0,'front');
    //Loader.loadMesh('assets','tree_Zup_02','obj',	renderingEnvironment.scene,'trees',	-340,-340,0,'double');
    Loader.loadMesh('assets','arrivee_Zup_01','obj',	renderingEnvironment.scene,'decors',	-340,-340,0,'front');

    // Creates the vehicle (handled by physics)
    var vehicle = new FlyingVehicle(
        {
            position: new THREE.Vector3(CARx, CARy, CARz),
            zAngle : CARtheta+Math.PI/2.0,
        }
    );

    var helico = new Helico("helico");

    helico.setPosition(CARx, CARy, CARz);
    helico.setEnv(renderingEnvironment);
    helico.setCamera(renderingEnvironment.camera) ;

	// Camera setup
    renderingEnvironment.camera.position.x = 0.0;
    renderingEnvironment.camera.position.z = 15.0;
    renderingEnvironment.camera.position.y = -30.0;
    renderingEnvironment.camera.rotation.x = 85.0*3.14159/180.0 ;

    //	Planes Set for Navigation

    //	Skybox
    Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', renderingEnvironment.scene, 'sky',4000);
    // 	z up
    var NAV = new navPlaneSet(
        new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01
    NAV.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02
    NAV.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03
    NAV.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04
    NAV.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05
    NAV.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06
    NAV.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07
    NAV.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08
    NAV.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09
    NAV.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10
    NAV.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11
    NAV.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12
    NAV.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13
    NAV.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14
    NAV.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15
    NAV.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16
    NAV.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17
    NAV.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18
    NAV.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19
    NAV.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20
    NAV.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21
    NAV.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22
    NAV.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23
    NAV.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24
    NAV.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25
    NAV.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26
    NAV.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27
    NAV.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28
    NAV.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29
    NAV.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30
    NAV.setPos(CARx,CARy,CARz);
    NAV.initActive();

	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks 
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;					

	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) {
        console.log(event.keyCode);
        currentlyPressedKeys[event.keyCode] = true;
    }
	function handleKeyUp(event) {
        console.log(event.keyCode);
        currentlyPressedKeys[event.keyCode] = false;
    }

	function handleKeys() {
		if (currentlyPressedKeys[67]) { // (C) debug
			// debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}
		if (currentlyPressedKeys[68]) { // (D) Right
			vehicle.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) { // (Q) Left
			vehicle.turnLeft(1000) ;
		}
        if (currentlyPressedKeys[90]) { // (Z) Up
            vehicle.goFront(1200, 1200) ;
        }
        if (currentlyPressedKeys[83]) { // (S) Down {
            vehicle.goFront(-1200, -1200) ;
        }
        if (currentlyPressedKeys[65]) { // (A) Up {
            vehicle.goUp(1200, 1200, 1200, 1200) ;
        }
	}

	//	window resize
	function  onWindowResize() 
	{
		renderingEnvironment.onWindowResize(window.innerWidth,window.innerHeight);
	}

	function render() {
		requestAnimationFrame( render );
		handleKeys();
		// Vehicle stabilization
		vehicle.stabilizeSkid(50) ;
		vehicle.stabilizeTurn(1000) ;
		var oldPosition = vehicle.position.clone() ;
		vehicle.update(1.0/60) ;
		var newPosition = vehicle.position.clone() ;
		newPosition.sub(oldPosition);
        // NAV
        NAV.move(newPosition.x, newPosition.y, newPosition.z) ;
		// Updates the helico
		helico.setPosition(NAV.x, NAV.y, NAV.z);
		//helico.setInclinaison(vehicle.angles.y-Math.PI*2);
        //helico.setDirectionalTurbineRotation(vehicle.speed.y % Math.PI);
        //helico.setMainTurbineRotationSpeed(vehicle.speed);
		// Rendering
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera);
	};

	render(); 
}
