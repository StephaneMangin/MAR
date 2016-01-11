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
                                          "lib/RenderManager.js",
			                              "myJS/navZ.js",
			                              "FlyingVehicle.js"]) ;
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start(){
	//	----------------------------------------------------------------------------
	//	MAR 2014 - nav test
	//	author(s) : Cozot, R. and Lamarche, F.
	//	date : 11/16/2014
	//	last : 11/25/2014
	//	---------------------------------------------------------------------------- 			
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};
	
	// car Position
	var CARx = -220; 
	var CARy = 0 ; 
	var CARz = 0 ;
	var CARtheta = 0 ; 
	// car speed
	var dt = 0.05; 
	var dx = 1.0;

	// Creates the vehicle (handled by physics)
	var vehicle = new FlyingVehicle(
			{
				position: new THREE.Vector3(CARx, CARy, CARz),
				zAngle : CARtheta+Math.PI/2.0,
			}
			) ;
	
	//	rendering env
	var RC =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',RC,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();

	//	Meshes
	Loader.loadMesh('assets','border_Zup_02','obj',	RC.scene,'border',	-340,-340,0,'front');
	Loader.loadMesh('assets','ground_Zup_03','obj',	RC.scene,'ground',	-340,-340,0,'front');
	Loader.loadMesh('assets','circuit_Zup_02','obj',RC.scene,'circuit',	-340,-340,0,'front');
	//Loader.loadMesh('assets','tree_Zup_02','obj',	RC.scene,'trees',	-340,-340,0,'double');
	Loader.loadMesh('assets','arrivee_Zup_01','obj',	RC.scene,'decors',	-340,-340,0,'front');
		
	//	Car
	// car Translation
	var car0 = new THREE.Object3D(); 
	car0.name = 'car0'; 
	RC.addToScene(car0); 
	// initial POS
	car0.position.x = CARx;
	car0.position.y = CARy;
	car0.position.z = CARz;
	// car Rotation floor slope follow
	var car1 = new THREE.Object3D(); 
	car1.name = 'car1';
	car0.add(car1);
	// car vertical rotation
	var car2 = new THREE.Object3D(); 
	car2.name = 'car2';
	car1.add(car2);
	car2.rotation.z = CARtheta ;
	// the car itself 
	// simple method to load an object
	var car3 = Loader.load({filename: 'assets/car_Zup_01.obj', node: car2, name: 'car3'}) ;
	car3.position.z= +0.25 ;
	// attach the scene camera to car
	car3.add(RC.camera) ;
	RC.camera.position.x = 0.0 ;
	RC.camera.position.z = 10.0 ;
	RC.camera.position.y = -25.0 ;
	RC.camera.rotation.x = 85.0*3.14159/180.0 ;
		
	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', RC.scene, 'sky',4000);

	//	Planes Set for Navigation 
	// 	z up
    var p01 = new navPlane('p01', -260, -180,	 -80, 120,	+0,+0,  'px');
    var p02 = new navPlane('p02', -260, -180,	 120, 200,	+0,+20, 'py');
    var p03 = new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px');
    var p04 = new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px');
    var p05 = new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px');
    var p06 = new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px');
    var p07 = new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px');
    var p08 = new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px');
    var p09 = new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px');
    var p10 = new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px');
    var p11 = new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx');
    var p12 = new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px');
    var p13 = new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py');
    var p14 = new navPlane('p14',  200,  260,  -80,   0,	+0,+20, 'py');
    var p15 = new navPlane('p15',  180,  240, -160, -80,	+0,+40, 'ny');
    var p16 = new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px');
    var p17 = new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px');
    var p18 = new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px');
    var p19 = new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py');
    var p20 = new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py');
    var p21 = new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px');
    var p22 = new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px');
    var p23 = new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px');
    var p24 = new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py');
    var p25 = new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py');
    var p26 = new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px');
    var p27 = new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px');
    var p28 = new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px');
    var p29 = new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny');
    var p30 = new navPlane('p30', -240, -180, -140, -80,	+0,+20, 'ny');
	var NAV = new navPlaneSet(p01);
	NAV.addPlane(p02);
	NAV.addPlane(p03);
	NAV.addPlane(p04);
	NAV.addPlane(p05);
	NAV.addPlane(p06);
	NAV.addPlane(p07);
	NAV.addPlane(p08);
	NAV.addPlane(p09);
	NAV.addPlane(p10);
	NAV.addPlane(p11);
	NAV.addPlane(p12);
	NAV.addPlane(p13);
	NAV.addPlane(p14);
	NAV.addPlane(p15);
	NAV.addPlane(p16);
	NAV.addPlane(p17);
	NAV.addPlane(p18);
	NAV.addPlane(p19);
	NAV.addPlane(p20);
	NAV.addPlane(p21);
	NAV.addPlane(p22);
	NAV.addPlane(p23);
	NAV.addPlane(p24);
	NAV.addPlane(p25);
	NAV.addPlane(p26);
	NAV.addPlane(p27);
	NAV.addPlane(p28);
	NAV.addPlane(p29);
    NAV.addPlane(p30);
	NAV.setPos(CARx,CARy,CARz);
	NAV.initActive();
	// DEBUG
	//NAV.debug();
	//var navMesh = NAV.toMesh();
	//RC.addToScene(navMesh);
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
			RC.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}				
		if (currentlyPressedKeys[68]) // (D) Right
		{
			vehicle.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{		
			vehicle.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			vehicle.goFront(1200, 1200) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			vehicle.brake(100) ;
		}
	}

	//	window resize
	function  onWindowResize() {RC.onWindowResize(window.innerWidth,window.innerHeight);}

    function createExtraManagers() {


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
		newPosition.sub(oldPosition) ;
		// NAV
		NAV.move(newPosition.x, newPosition.y, 150,10) ;
		// car0
		car0.position.set(NAV.x, NAV.y, NAV.z) ;
		// Updates the vehicle
		vehicle.position.x = NAV.x ;
		vehicle.position.y = NAV.Y ;
		// Updates car1
		car1.matrixAutoUpdate = false;		
		car1.matrix.copy(NAV.localMatrix(CARx,CARy));
		// Updates car2
		car2.rotation.z = vehicle.angles.z-Math.PI/2.0 ;
		// Rendering
		RC.renderer.render(RC.scene, RC.camera);
	};

	render(); 
}
