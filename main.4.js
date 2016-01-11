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


    //###################################################################################
    // HELICO
    //###################################################################################

	// helico Translation
    //###################################################################################
	var helicoPosition = new THREE.Object3D();
	helicoPosition.name = 'helicoPosition';
	renderingEnvironment.addToScene(helicoPosition);
	// initial POS
	helicoPosition.position.x = 0;
	helicoPosition.position.y = 0;
	helicoPosition.position.z = 0;

    // helico Rotation floor slope follow
    //###################################################################################
    var helicoFloorSlope = new THREE.Object3D();
    helicoFloorSlope.name = 'helicoFloorSlop';
    helicoPosition.add(helicoFloorSlope);

	// helico vertical rotation
    //###################################################################################
	var helicoRotationZ = new THREE.Object3D();
	helicoRotationZ.name = 'helicoRotationZ';
	helicoFloorSlope.add(helicoRotationZ);

	// the helico itself
    //###################################################################################
	// simple method to load an object
	var helicoGeometry = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: helicoRotationZ, name: 'helicoGeometry'}) ;

    //###################################################################################
    // TURBINE
    //###################################################################################

    // Turbine Centrale
    //###################################################################################
    var helicoPositionTurbineCentrale = new THREE.Object3D();
    helicoPositionTurbineCentrale.name = 'helicoPositionTurbineCentrale';
    helicoPosition.add(helicoPositionTurbineCentrale);
    // initial POS
    helicoPositionTurbineCentrale.position.x = 0;
    helicoPositionTurbineCentrale.position.y = 0;
    helicoPositionTurbineCentrale.position.z = 4;
    helicoPositionTurbineCentrale.rotateZ(90)
    var helicoGeometryPale1 = Loader.load({filename: 'assets/helico/turbine.obj', node: helicoPositionTurbineCentrale, name: 'helicoGeometryPale1'}) ;

    // Turbine Gauche
    //############################################Z######################################
    var helicoPositionTurbineGauche = new THREE.Object3D();
    helicoPositionTurbineGauche.name = 'helicoPositionTurbineGauche';
    helicoPosition.add(helicoPositionTurbineGauche);
    // initial POS
    helicoPositionTurbineGauche.position.x = -8.5;
    helicoPositionTurbineGauche.position.y = -3;
    helicoPositionTurbineGauche.position.y = 4;
    var helicoGeometryPale1 = Loader.load({filename: 'assets/helico/turbine.obj', node: helicoPositionTurbineGauche, name: 'helicoGeometryPale1'}) ;

    // Turbine Droite
    //###################################################################################
    var helicoPositionTurbineDroite = new THREE.Object3D();
    helicoPositionTurbineDroite.name = 'helicoPositionTurbineDroite';
    helicoPosition.add(helicoPositionTurbineDroite);
    // initial POS
    helicoPositionTurbineDroite.position.x = 8.5;
    helicoPositionTurbineDroite.position.y = -3;
    helicoPositionTurbineDroite.position.z = 4;
    // helico Rotation slope follow
    var helicoTurbineDroiteFloorSlope = new THREE.Object3D();
    helicoTurbineDroiteFloorSlope.name = 'helicoTurbineDroiteRotationSlop';
    helicoPositionTurbineDroite.add(helicoTurbineDroiteFloorSlope);
    var helicoGeometryPale1 = Loader.load({filename: 'assets/helico/turbine.obj', node: helicoPositionTurbineDroite, name: 'helicoGeometryPale1'}) ;

    //###################################################################################
    // Axe
    //###################################################################################

    // Axe Gauche
    //###################################################################################
    var helicoPositionAxeGauche = new THREE.Object3D();
    helicoPositionAxeGauche.name = 'helicoPositionAxeGauche';
    helicoPosition.add(helicoPositionAxeGauche);
    // initial POS
    helicoPositionAxeGauche.position.x = 8,5;
    helicoPositionAxeGauche.position.y = -3.4;
    // helico Rotation slope follow
    var helicoAxeGaucheFloorSlope = new THREE.Object3D();
    helicoAxeGaucheFloorSlope.name = 'helicoAxeGaucheRotationSlop';
    helicoPositionAxeGauche.add(helicoAxeGaucheFloorSlope);
    var helicoGeometryAxeGauche = Loader.load({filename: 'assets/helico/axe.obj', node: helicoPositionAxeGauche, name: 'helicoGeometryAxeGauche'}) ;

    // Axe Droit
    //###################################################################################
    var helicoPositionAxeDroit = new THREE.Object3D();
    helicoPositionAxeDroit.name = 'helicoPositionAxeDroit';
    helicoPosition.add(helicoPositionAxeDroit);
    // initial POS
    helicoPositionAxeDroit.position.x = 8,5;
    helicoPositionAxeDroit.position.y = -3.4;
    // helico Rotation slope follow
    var helicoAxeDroitFloorSlope = new THREE.Object3D();
    helicoAxeDroitFloorSlope.name = 'helicoAxeDroitRotationSlop';
    helicoPositionAxeDroit.add(helicoAxeDroitFloorSlope);
    var helicoGeometryAxeDroit = Loader.load({filename: 'assets/helico/axe.obj', node: helicoPositionAxeDroit, name: 'helicoGeometryAxeDroit'}) ;

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
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}				
		var rotationIncrement = 0.05 ;
		if (currentlyPressedKeys[68]) // (D) Right
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{		
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), -rotationIncrement) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), -rotationIncrement) ;
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
		// Rendering
        helicoPosition.position.set(0.0, 0.0, 0.0);
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera);
	};

	render(); 
}
