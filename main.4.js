/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
		{ 
			// Level 0 includes
			ModulesLoader.requireModules(["threejs/three.min.js"]) ;
			ModulesLoader.requireModules([ "myJS/ThreeRenderingEnv.js", 
			                              "myJS/ThreeLightingEnv.js", 
			                              "myJS/ThreeLoadingEnv.js", 
			                              "myJS/navZ.js",
			                              "FlyingVehicle.js"]) ;
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start()
{
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

	// Camera setup
	renderingEnvironment.camera.position.x = 0 ;
	renderingEnvironment.camera.position.y = 0 ;
	renderingEnvironment.camera.position.z = 30 ;

	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', renderingEnvironment.scene, 'sky',4000);

	// car Position
	var CARx = -220;
	var CARy = 0 ;
	var CARz = 0 ;
	var CARtheta = 0 ;
	// car speed
	var dt = 0.05;
	var dx = 1.0;

	// Creates the vehicle (handled by physics)
	var helico = new FlyingVehicle(
		{
			position: new THREE.Vector3(CARx, CARy, CARz),
			zAngle : CARtheta+Math.PI/2.0,
		}
	);

    //###################################################################################
    // HELICO
    //###################################################################################

	// helico Translation
    //###################################################################################
	var helicoPosition = new THREE.Object3D();
	helicoPosition.name = 'helicoPosition';
	renderingEnvironment.addToScene(helicoPosition);
	Loader.load({filename: 'assets/helico/helicoCorp.obj', node: helicoPosition, name: 'helicoGeometry'}) ;
	helicoPosition.add(renderingEnvironment.camera) ;
	renderingEnvironment.camera.position.x = 0.0;
	renderingEnvironment.camera.position.z = 15.0;
	renderingEnvironment.camera.position.y = -30.0;
	renderingEnvironment.camera.rotation.x = 85.0*3.14159/180.0 ;

    //###################################################################################
    // Propulsion Centrale
    //###################################################################################

	// turbine
	// ###################################################################################
    var turbineCentrale = new THREE.Object3D();
    turbineCentrale.name = 'turbineCentrale';
    helicoPosition.add(turbineCentrale);
    turbineCentrale.position.x = 0;
    turbineCentrale.position.y = 0;
    turbineCentrale.position.z = 5;
    turbineCentrale.rotation.x = 1.5;
    Loader.load({filename: 'assets/helico/turbine.obj', node: turbineCentrale, name: 'helicoGeometrypale1'}) ;

	// axe
	// ###################################################################################
	var axeCentral = new THREE.Object3D();
	axeCentral.name = 'axeCentral';
	turbineCentrale.add(axeCentral);
	axeCentral.position.x = 0;
	axeCentral.position.y = 1;
	axeCentral.scale.x = 2;
	axeCentral.scale.z = 2;
	Loader.load({filename: 'assets/helico/axe.obj', node: axeCentral, name: 'helicoGeometryaxeCentral'}) ;

	// pale 1
	//###################################################################################
	var pale1Centrale = new THREE.Object3D();
	pale1Centrale.name = 'pale1Centrale';
	axeCentral.add(pale1Centrale);
	pale1Centrale.position.x = 0;
	pale1Centrale.position.y = 2;
	pale1Centrale.rotation.z = 0.5;
	pale1Centrale.scale.x = 2;
	pale1Centrale.scale.z = 2;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale1Centrale, name: 'helicoGeometrypale1Centrale'}) ;
	// pale 2
	//###################################################################################
	var pale2Centrale = new THREE.Object3D();
	pale2Centrale.name = 'pale2Centrale';
	axeCentral.add(pale2Centrale);
	pale2Centrale.position.x = 0;
	pale2Centrale.position.y = 2;
	pale2Centrale.rotation.y = 2;
	pale2Centrale.rotation.z = 0.5;
	pale2Centrale.scaleFactor = 2;
	pale2Centrale.scale.x = 2;
	pale2Centrale.scale.z = 2;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale2Centrale, name: 'helicoGeometrypale2Centrale'}) ;
	// pale 3
	//###################################################################################
	var pale3Centrale = new THREE.Object3D();
	pale3Centrale.name = 'pale3Centrale';
	axeCentral.add(pale3Centrale);
	pale3Centrale.position.x = 0;
	pale3Centrale.position.y = 2;
	pale3Centrale.rotation.y = 4;
	pale3Centrale.rotation.z = 0.5;
	pale3Centrale.scale.x = 2;
	pale3Centrale.scale.z = 2;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale3Centrale, name: 'helicoGeometrypale3Centrale'}) ;

	//###################################################################################
	// Propulsion Gauche
	//###################################################################################

	// turbine
	//############################################Z######################################
	var turbineGauche = new THREE.Object3D();
	turbineGauche.name = 'turbineGauche';
	helicoPosition.add(turbineGauche);
	turbineGauche.position.x = -8.5;
	turbineGauche.position.y = -3;
	turbineGauche.position.z = 4;
	Loader.load({filename: 'assets/helico/turbine.obj', node: turbineGauche, name: 'helicoGeometrypale1'}) ;

	// axe
	//###################################################################################
	var axeGauche = new THREE.Object3D();
	axeGauche.name = 'axeGauche';
	turbineGauche.add(axeGauche);
	axeGauche.position.x = 0;
	axeGauche.position.y = 1;
	Loader.load({filename: 'assets/helico/axe.obj', node: axeGauche, name: 'helicoGeometryaxeGauche'}) ;
	// pale 1
	//###################################################################################
	var pale1Gauche = new THREE.Object3D();
	pale1Gauche.name = 'pale1Gauche';
	axeGauche.add(pale1Gauche);
	pale1Gauche.position.x = 0;
	pale1Gauche.position.y = 2;
	pale1Gauche.rotation.y = 2;
	pale1Gauche.rotation.z = 0.5;
	pale1Gauche.scale.x = 0.8;
	pale1Gauche.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale1Gauche, name: 'helicoGeometrypale1Gauche'}) ;
	// pale 2
	//###################################################################################
	var pale2Gauche = new THREE.Object3D();
	pale2Gauche.name = 'pale2Gauche';
	axeGauche.add(pale2Gauche);
	pale2Gauche.position.x = 0;
	pale2Gauche.position.y = 2;
	pale2Gauche.rotation.y = 4;
	pale2Gauche.rotation.z = 0.5;
	pale2Gauche.scale.x = 0.8;
	pale2Gauche.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale2Gauche, name: 'helicoGeometrypale2Gauche'}) ;
	// pale 3
	//###################################################################################
	var pale3Gauche = new THREE.Object3D();
	pale3Gauche.name = 'pale3Gauche';
	axeGauche.add(pale3Gauche);
	pale3Gauche.position.x = 0;
	pale3Gauche.position.y = 2;
	pale3Gauche.rotation.z = 0.5;
	pale3Gauche.scale.x = 0.8;
	pale3Gauche.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale3Gauche, name: 'helicoGeometrypale3Gauche'}) ;

	//###################################################################################
	// Propulsion Droite
	//###################################################################################

	// turbine
	//###################################################################################
	var turbineDroite = new THREE.Object3D();
	turbineDroite.name = 'turbineDroite';
	helicoPosition.add(turbineDroite);
	turbineDroite.position.x = 8.5;
	turbineDroite.position.y = -3;
	turbineDroite.position.z = 4;
	Loader.load({filename: 'assets/helico/turbine.obj', node: turbineDroite, name: 'helicoGeometrypale1'}) ;

    // axe
    //###################################################################################
    var axeDroit = new THREE.Object3D();
    axeDroit.name = 'axeDroit';
    turbineDroite.add(axeDroit);
    axeDroit.position.x = 0;
    axeDroit.position.y = 1;
    // helico Rotation slope follow
    Loader.load({filename: 'assets/helico/axe.obj', node: axeDroit, name: 'helicoGeometryaxeDroit'}) ;

	// pale 1
	//###################################################################################
	var pale1Droite = new THREE.Object3D();
	pale1Droite.name = 'pale1Droite';
	axeDroit.add(pale1Droite);
	pale1Droite.position.x = 0;
	pale1Droite.position.y = 2;
	pale1Droite.rotation.z = 0.5;
	pale1Droite.scale.x = 0.8;
	pale1Droite.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale1Droite, name: 'helicoGeometrypale1Droite'}) ;
	// pale 2
	//###################################################################################
	var pale2Droite = new THREE.Object3D();
	pale2Droite.name = 'pale2Droite';
	axeDroit.add(pale2Droite);
	pale2Droite.position.x = 0;
	pale2Droite.position.y = 2;
	pale2Droite.rotation.y = 2;
	pale2Droite.rotation.z = 0.5;
	pale2Droite.scale.x = 0.8;
	pale2Droite.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale2Droite, name: 'helicoGeometrypale2Droite'}) ;
	// pale 3	//###################################################################################
	var pale3Droite = new THREE.Object3D();
	pale3Droite.name = 'pale3Droite';
	axeDroit.add(pale3Droite);
	pale3Droite.position.x = 0;
	pale3Droite.position.y = 2;
	pale3Droite.rotation.y = 4;
	pale3Droite.rotation.z = 0.5;
	pale3Droite.scale.x = 0.8;
	pale3Droite.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: pale3Droite, name: 'helicoGeometrypale3Droite'}) ;

	//############################################################
	// Rotation system
	//############################################################
	var SPEED = 0;

	function rotate() {
		if (SPEED > 0.1) {
			axeCentral.rotation.y += SPEED;
			axeGauche.rotation.y += SPEED;
			axeDroit.rotation.y += SPEED;
		}
	}

	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks 
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;					

	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true;}
	function handleKeyUp(event) {currentlyPressedKeys[event.keyCode] = false;}

	function handleKeys() {
		if (currentlyPressedKeys[67]) { // (C) debug
			// debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}
		if (currentlyPressedKeys[68]) { // (D) Right
			helico.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) { // (Q) Left
			helico.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[90]) { // (Z) Up
			helico.goFront(1200, 1200) ;
		}
		if (currentlyPressedKeys[83]) { // (S) Down {
			helico.brake(100) ;
		}
		if (currentlyPressedKeys[65]) { // (A) Throttle up
			SPEED += 0.001;
		}
		if (currentlyPressedKeys[87]) { // (W) Throttle down
			SPEED -= 0.001;
		}
		if (currentlyPressedKeys[69]) { // (E) Stop
			SPEED = 0;
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
		helico.stabilizeSkid(50) ;
		helico.stabilizeTurn(1000) ;
		var oldPosition = helico.position.clone() ;
		helico.update(1.0/60) ;
		var newPosition = helico.position.clone() ;
		newPosition.sub(oldPosition);
		// Updates the vehicle
		helicoPosition.position.set(newPosition.x, newPosition.y, newPosition.z);
		helicoPosition.rotation.z = helico.angles.z-Math.PI/2.0 ;
		// Rendering
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera);
		rotate();
	};

	render(); 
}
