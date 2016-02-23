/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function () {
        // Level 0 includes
        ModulesLoader.requireModules([
            "threejs/three.min.js",
            "js/libs/dat.gui.min.js",
            "js/Detector.js",
            "js/libs/stats.min.js",
            "lib/ParticleEngine.js",
            //"js/controls/OrbitControls.js",
            "myJS/ThreeRenderingEnv.js",
            "myJS/ThreeLightingEnv.js",
            "myJS/ThreeLoadingEnv.js",
            //"lib/RenderManager.js",
            "myJS/FallEngine.js",
            "myJS/navZ.js",
            "FlyingVehicle.js"]);
        // Loads modules contained in includes and starts main function
        ModulesLoader.loadModules(start);
    }
);


//	----------------------------------------------------------------------------
//	MAR 2015 - nav test
//	author(s) : Cozot, R. and Lamarche, F.
//  sutdient author(s) : Mangin, S.
//	date : 11/16/2014
//	last : 21/02/2016
//	----------------------------------------------------------------------------
//	global vars
//	----------------------------------------------------------------------------
//	keyPressed
var currentlyPressedKeys = {};
var playerMode = 1;
var timerStarted = false;
var welcomeScreen = true;


var canvasWidth = 1366;
var canvasHeight = 768;

var hasGP = false;
var repGP;
var realisateur;
var mod_realisation = 0;

var time = 0;

// List of collidable objects NO SOLUTION FOR NOW
var collidableMeshList = [];

// car Position
var CARx = -220;
var CARy = 0;
var CARz = 0;
var CARtheta = 0;
// car speed and physcis
var dt = 1.0 / 60;
var dx = 1.0;
var carMass = 50;
// Initial camera type
var cameratype = 'follow';
// All global function's needed vars
var Loader, scene, RC = undefined;
var vehicle, carPosition, carRotationZ, car, MovingCar, wireMaterial, carFloorSlope = undefined;
var weitherEngine, explosionEngine, smokeEngine = undefined;
var gui= undefined;

var burned = false;
var lifePoint = 100.0;

/**
 * Helper to remove nodes ionside the scene
 *
 * @param scene
 * @param name
 */
function removeEntity(scene, name) {
    var selectedObject = scene.getObjectByName(name);
    scene.remove(selectedObject);
}

// Gamepad manadgment
function canGame() {
    return "getGamepads" in navigator;
}

/**
 * Initializes all user's controlled objects
 *
 */
function initObjects() {

    // Creates the vehicle (handled by physics)
    vehicle = new FlyingVehicle(
        {
            position: new THREE.Vector3(CARx, CARy, CARz),
            zAngle: CARtheta + Math.PI / 2.0,
            mass: carMass,
        }
    );
    //	Car
    // car Translation
    carPosition = new THREE.Object3D();
    carPosition.name = 'car0';
    RC.addToScene(carPosition);
    // initial POS
    carPosition.position.x = CARx;
    carPosition.position.y = CARy;
    carPosition.position.z = CARz;
    // car Rotation floor slope follow
    carFloorSlope = new THREE.Object3D();
    carFloorSlope.name = 'car1';
    carPosition.add(carFloorSlope);
    // car vertical rotation
    carRotationZ = new THREE.Object3D();
    carRotationZ.name = 'car2';
    carFloorSlope.add(carRotationZ);
    carRotationZ.rotation.z = CARtheta;
    // the car itself
    // simple method to load an object
    car = Loader.load({filename: 'assets/car_Zup_02.obj', node: carRotationZ, name: 'car3'});
    car.position.z = +0.25;
    var carGeometry = new THREE.SphereGeometry(5);
    wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        visible: false,
    });
    MovingCar = new THREE.Mesh(carGeometry, wireMaterial);
    scene.add(MovingCar);
    MovingCar.position.x = CARx;
    MovingCar.position.y = CARy;
    MovingCar.position.z = CARz;


}

/**
 * Set the camera perspective and angles
 *
 * @param type ['up', 'follow']
 */
function setCamera(type) {
    cameratype = type;
    if (type == 'up') {
        RC.camera.position.x = 0.0;
        RC.camera.position.y = 0.0;
        RC.camera.position.z = 50;
        RC.camera.rotation.x = 3.14159 / 180.0;
        carPosition.add(RC.camera);
    } else if (type == 'follow') {
        RC.camera.position.x = 0.0;
        RC.camera.position.z = 10.0;
        RC.camera.position.y = -25.0;
        RC.camera.rotation.x = 85.0 * 3.14159 / 180.0;
        // attach the scene camera to car
        car.add(RC.camera);
    }
}

/**
 * Resize the view port in case of window resizing
 *
 */
function onWindowResize() {
    RC.onWindowResize(window.innerWidth, window.innerHeight);
}

/**
 * Reset all the scene to the initial state to restart a game
 *
 */
function restart() {
    toggleWelcomeScreen();
    // Delete the canva added by the renderer
    var canvas = document.getElementsByTagName('canvas')
    for (var i = canvas.length - 1; 0 <= i; i--)
        if (canvas[i] && canvas[i].parentElement)
            canvas[i].parentElement.removeChild(canvas[i]);
    // And then reinit the scene
    initLand();
    initObjects();
    //collidableMeshList = initCollidableBorders(NAV);
    setCamera('follow');
    // Initializes particules engines wrapper

    weitherEngine = new FallEngine();
    fireEngine = new FallEngine();
    fireEngine.setParticle(fireEngine.types.fire);
    explosionEngine = new FallEngine();
    explosionEngine.setParticle(explosionEngine.types.explosion);
    smokeEngine = new FallEngine();
    smokeEngine.setParticle(smokeEngine.types.smoke);

    // Finaly render the scene
    render();
}

/**
 * Main rendering function
 *
 */
function render() {
    RC.renderer.autoClear = false;
    requestAnimationFrame(render);
    handleKeys();
    // Vehicle stabilization
    if (!burned) {
        if (cameratype == 'up') {
            vehicle.goUp(vehicle.weight() / 4.0, vehicle.weight() / 4.0, vehicle.weight() / 4.0, vehicle.weight() / 4.0);
            vehicle.stopAngularSpeedsXY();
        }
        vehicle.stabilizeSkid(50);
        vehicle.stabilizeTurn(1000);
        var oldPosition = vehicle.position.clone();
        vehicle.update(dt);
        var newPosition = vehicle.position.clone();
        newPosition.sub(oldPosition);
        // Collision detection
        var originPoint = MovingCar.position.clone();
        // TODO: collisionneur difficile à metre en place :-(
        // TODO: il faut entourer chaque zone de collision d'une box de detection respectant ainsi le schema du circuit
        //for (var vertexIndex = 0; vertexIndex < MovingCar.geometry.vertices.length; vertexIndex++)
        //{
        //    var localVertex = MovingCar.geometry.vertices[vertexIndex].clone();
        //    var globalVertex = localVertex.applyMatrix4( MovingCar.matrix );
        //    var directionVector = globalVertex.sub( MovingCar.position );
        //
        //    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        //    var collisionResults = ray.intersectObjects( collidableMeshList );
        //    if ( collisionResults.length < 0 || collisionResults[0].distance > directionVector.length() ) {
        //        console.log("HIT");
        //        lifePoint -= vehicle.speed.length;
        //    }
        //}
        //if (lifePoint < 5) {
        //    if (!smokeEngine.isActive) {
        //        smokeEngine.start()
        //    }
        //    smokeEngine.update(dt, vehicle.position);
        //}
        //if (lifePoint <= 0) {
        //    explosionEngine.update(dt, vehicle.position);
        //    explosionEngine.start();
        //} else {

        // NAV
        NAV.move(newPosition.x, newPosition.y, 150, 10);
        //if (NAV.getCollision) {
        //    console.log("HIT !!!!!!!!!!!!!!!!!! with ", vehicle.speed.y / 100, " force")
        //    lifePoint =  lifePoint - vehicle.speed.y / 100;
        //    console.log(lifePoint + " lifepoint LEFT")
        //}
        //if (lifePoint <= 40) {
        //    if (!smokeEngine.isActive()) {
        //        smokeEngine.start(scene)
        //        console.log("SMOKE !!!!!!!!!!!!")
        //    }
        //    smokeEngine.update(dt, vehicle.position);
        //}
        //if (lifePoint <= 20) {
        //    if (!fireEngine.isActive()) {
        //        fireEngine.start(scene);
        //        console.log("BURN !!!!!!!!!!!!");
        //    }
        //    fireEngine.update(dt, vehicle.position);
        //}
        if (lifePoint <= 0) {
                explosionEngine.start(vehicle);
                explosionEngine.update(dt, vehicle.position);
                console.log("BURNED !!!!!!!!!!!!")
                burned = true;
        } else {
            // Updates the vehicles
            vehicle.position.x = NAV.x;
            vehicle.position.y = NAV.y;
            if (newPosition.z < NAV.z) {
                //console.log("OUT ",newPosition.z, " FROM ", NAV.z )
                vehicle.position.z = NAV.z;
                newPosition.z = NAV.z;
            }
            carPosition.position.set(NAV.x, NAV.y, newPosition.z);
            MovingCar.position.set(NAV.x, NAV.y, newPosition.z);
            // Updates car1
            carFloorSlope.matrixAutoUpdate = false;
            carFloorSlope.matrix.copy(NAV.localMatrix(CARx, CARy));
            // Updates car2
            carRotationZ.rotation.z = vehicle.angles.z - Math.PI / 2.0;
            if (cameratype == 'up') {
                RC.camera.position.z = 50 + vehicle.speed.length();
            }
        }

    }
    updateTiming();
    // Rendering
    RC.renderer.render(RC.scene, RC.camera);
    weitherEngine.update(dt, vehicle.position.multiplyScalar(10));

};

/**
 * Initializes the menu
 *
 */
function initGUI() {
    var options = function () {
        this.Title = 'Super Car';
        this.Inertia = dt * 100;
        this.Mass = carMass;
        this.Trees = false;
        this.CameraUp = false;
        this.Debug = false;
        this.Particules = [];
        this.Reset = function () {
            restart();
        };
    };

    var text = new options();
    gui = new dat.GUI();

    gui.add(text, 'Title');
    var gameControls = gui.addFolder('Game controls');

    gameControls.add(text, 'Reset');
    gameControls.add(text, 'Debug').onChange(
        function (value) {
            console.log("Camera up: ", value);
            wireMaterial.visible = value;
            for (border in collidableMeshList) {
                border.color = 0x8888ff;
                border.wireframe = true;
                border.visible = value;
            }
        }
    );
    gameControls.add(text, 'CameraUp').onChange(
        function (value) {
            console.log("Camera up: ", value);
            if (value) {
                setCamera('up');
            } else {
                setCamera('follow');
            }
        }
    );
    var vehicleControls = gui.addFolder('Vehicle controls');
    vehicleControls.add(text, 'Mass', 0, 500).onChange(function (value) {
        console.log("Mass changed: ", value);
        vehicle.mass = value
    })
    vehicleControls.add(text, 'Inertia', 0, 5).onChange(function (value) {
        console.log("Speed changed: ", value);
        dt = value / 100;
    })

    var mapControls = gui.addFolder('Map controls');
    mapControls.add(text, 'Trees').onChange(
        function (value) {
            console.log("Trees changed: ", value);
            if (value) {
                Loader.loadMesh('assets', 'tree_Zup_02', 'obj', RC.scene, 'trees', -340, -340, 0, 'double');
            } else {
                removeEntity(RC.scene, 'trees');
            }
        }
    )
    mapControls.add(text, 'Particules', ['none', 'rain', 'snow']).onChange(
        function (value) {
            console.log("Particules changed: ", value);
            if (value != 'none') {
                weitherEngine.stop();
                weitherEngine.setParticle(weitherEngine.types[value]);
                weitherEngine.start(scene);
            } else {
                weitherEngine.stop();
            }
        }
    )
}
//	callback functions
//	---------------------------------------------------------------------------
function handleKeyDown(event) {
    console.log(event.keyCode);
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}
function handleKeys() {
    if (currentlyPressedKeys[67]) // (C) debug
    {
        // debug scene
        RC.scene.traverse(function (o) {
            console.log('object:' + o.name + '>' + o.id + '::' + o.type);
        });
    }
    if (currentlyPressedKeys[68]) // (D) Right
    {
        vehicle.turnRight(1000);
    }
    if (currentlyPressedKeys[81]) // (Q) Left
    {
        vehicle.turnLeft(1000);
    }
    if (currentlyPressedKeys[90]) // (Z) Up
    {
        vehicle.goFront(1200, 1200);
    }
    if (currentlyPressedKeys[83]) // (S) Down
    {
        vehicle.brake(100);
    }
    if (currentlyPressedKeys[27]) // (Esc) Welcome screen
    {
        toggleWelcomeScreen();
    }
}

/**
 * Initializes all unmovable objects
 *
 */
function initLand() {

    //	rendering env
    RC = new ThreeRenderingEnv();
    // Keep scene inside the global namespace (to allow particles engine to use it ?! but WTF)
    scene = RC.scene;
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 5, 500000 );
    camera.up = new THREE.Vector3(0,0,1);
    camera.position.x = -260;
    camera.position.y = 250;
    camera.position.z = 50;

    //	lighting env
    Lights = new ThreeLightingEnv('rembrandt', 'neutral', 'spot', RC, 5000);

    //	Loading env
    Loader = new ThreeLoadingEnv();


    //	Meshes
    Loader.loadMesh('assets', 'border_Zup_02', 'obj', RC.scene, 'border', -340, -340, 0, 'front');
    Loader.loadMesh('assets', 'ground_Zup_03', 'obj', RC.scene, 'ground', -340, -340, 0, 'front');
    Loader.loadMesh('assets', 'circuit_Zup_02', 'obj', RC.scene, 'circuit', -340, -340, 0, 'front');
    Loader.loadMesh('assets', 'arrivee_Zup_01', 'obj', RC.scene, 'decors', -340, -340, 0, 'front');

    //	Skybox
    Loader.loadSkyBox('assets/maps', ['px', 'nx', 'py', 'ny', 'pz', 'nz'], 'jpg', RC.scene, 'sky', 4000);

    //	Planes Set for Navigation
    // 	z up
    var initNav = new navPlane('p01', -260, -180, -80, 120, +0, +0, 'px');
    NAV = new navPlaneSet(initNav);
    NAV.addPlane(new navPlane('p02', -260, -180, 120, 200, +0, +20, 'py'));
    NAV.addPlane(new navPlane('p03', -260, -240, 200, 240, +20, +20, 'px'));
    NAV.addPlane(new navPlane('p04', -240, -160, 200, 260, +20, +20, 'px'));
    NAV.addPlane(new navPlane('p05', -160, -80, 200, 260, +20, +40, 'px'));
    NAV.addPlane(new navPlane('p06', -80, -20, 200, 260, +40, +60, 'px'));
    NAV.addPlane(new navPlane('p07', -20, +40, 140, 260, +60, +60, 'px'));
    NAV.addPlane(new navPlane('p08', 0, +80, 100, 140, +60, +60, 'px'));
    NAV.addPlane(new navPlane('p09', 20, +100, 60, 100, +60, +60, 'px'));
    NAV.addPlane(new navPlane('p10', 40, +100, 40, 60, +60, +60, 'px'));
    NAV.addPlane(new navPlane('p11', 100, 180, 40, 100, +40, +60, 'nx'));
    NAV.addPlane(new navPlane('p12', 180, 240, 40, 80, +40, +40, 'px'));
    NAV.addPlane(new navPlane('p13', 180, 240, 0, 40, +20, +40, 'py'));
    NAV.addPlane(new navPlane('p14', 200, 260, -80, 0, +0, +20, 'py'));
    NAV.addPlane(new navPlane('p15', 180, 240, -160, -80, +0, +40, 'ny'));
    NAV.addPlane(new navPlane('p16', 160, 220, -220, -160, +40, +40, 'px'));
    NAV.addPlane(new navPlane('p17', 80, 160, -240, -180, +40, +40, 'px'));
    NAV.addPlane(new navPlane('p18', 20, 80, -220, -180, +40, +40, 'px'));
    NAV.addPlane(new navPlane('p19', 20, 80, -180, -140, +40, +60, 'py'));
    NAV.addPlane(new navPlane('p20', 20, 80, -140, -100, +60, +80, 'py'));
    NAV.addPlane(new navPlane('p21', 20, 60, -100, -40, +80, +80, 'px'));
    NAV.addPlane(new navPlane('p22', -80, 20, -100, -40, +80, +80, 'px'));
    NAV.addPlane(new navPlane('p23', -140, -80, -100, -40, +80, +80, 'px'));
    NAV.addPlane(new navPlane('p24', -140, -80, -140, -100, +60, +80, 'py'));
    NAV.addPlane(new navPlane('p25', -140, -80, -200, -140, +40, +60, 'py'));
    NAV.addPlane(new navPlane('p26', -100, -80, -240, -200, +40, +40, 'px'));
    NAV.addPlane(new navPlane('p27', -220, -100, -260, -200, +40, +40, 'px'));
    NAV.addPlane(new navPlane('p28', -240, -220, -240, -200, +40, +40, 'px'));
    NAV.addPlane(new navPlane('p29', -240, -180, -200, -140, +20, +40, 'ny'));
    NAV.addPlane(new navPlane('p30', -240, -180, -140, -80, +0, +20, 'ny'));
    NAV.setPos(CARx, CARy, CARz);

    NAV.initActive();

}
/**
 * Constructs walls to make collision detection
 *
 * Take a NAVset and draw walls around plane's right and left borders.
 *
 * @param NAV
 * @returns {Array}
 */
/*function initCollidableBorders(NAVset) {
 var collidableMeshList = [];
 NAVset.planeSet.forEach(function(plane) {
 var mesh = plane.toMesh();
 console.log(mesh);


 var width = mesh.geometry.parameters.width;
 var height = mesh.geometry.parameters.height;
 var xlength = width;
 var ylength = height;
 var xPos = mesh.position.x + width/2;
 var yPos = mesh.position.y + height/2;
 // Construct the left part of the plane collidable wall
 var LEFTwallGeometry = new THREE.BoxGeometry( 15, width, 15, 1, 1, 1 );
 var LEFTwallMaterial = new THREE.MeshBasicMaterial( {
 color: 0x8888ff,
 wireframe:false,
 visible: true,
 } );
 var LEFTwall = new THREE.Mesh(LEFTwallGeometry, LEFTwallMaterial);
 LEFTwall.name = mesh.name + "LeftCollider";
 LEFTwall.position.set(
 mesh.position.x + width/2,
 mesh.position.y + height/2,
 mesh.position.z
 );
 LEFTwall.rotation.x = mesh.rotation.x;
 LEFTwall.rotation.y = mesh.rotation.y;
 scene.add(LEFTwall);
 collidableMeshList.push(LEFTwall);

 });
 return collidableMeshList;
 }*/

function checkRealisation(){
    if (currentlyPressedKeys[80]) // (Q)
    {
        mod_realisation = (mod_realisation+1)%4;
    }
}

function view() {
    if(NAV.findActive(NAV.x, NAV.y) == 0) {
        camera.position.x = -260;
        camera.position.y = 250;
        camera.position.z = 50;
    }
    if(NAV.findActive(NAV.x, NAV.y) == 5) {
        camera.position.x = 100;
        camera.position.y = -100;
        camera.position.z = 200;
    }
    if(NAV.findActive(NAV.x, NAV.y) == 11) {
        camera.position.x = 260;
        camera.position.y = -200;
        camera.position.z = 120;
    }
    if(NAV.findActive(NAV.x, NAV.y) == 15) {
        camera.position.x = 50;
        camera.position.y = -20;
        camera.position.z = 150;
    }
    if(NAV.findActive(NAV.x, NAV.y) == 20) {
        camera.position.x = -30;
        camera.position.y = -180;
        camera.position.z = 120;
    }
    if(NAV.findActive(NAV.x, NAV.y) == 24) {
        camera.position.x = -200;
        camera.position.y = -300;
        camera.position.z = 80;
    }
}

function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    if(gp.buttons[7].pressed){
        vehicle.goFront(1200, 1200) ;
    }
    if(gp.buttons[6].pressed){
        vehicle.brake(1000) ;
    }
    var axeLF = gp.axes[0];
    if(axeLF < -0.5) {
        vehicle.turnLeft(10000) ;
    } else if(axeLF > 0.5) {
        vehicle.turnRight(10000) ;
    }

}

/**
 * Main start method called by the module loader
 *
 */
function start() {
    // Gamepad
    if(canGame()) {

        realisateur = window.setInterval(checkRealisation, 100);

        $(window).on("gamepadconnected", function() {
            hasGP = true;
            noty({text: 'Gamepad connected !'});
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad,100);
        });

        $(window).on("gamepaddisconnected", function() {
            console.log("disconnection event");
            noty({text: prompt});
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            console.log('checkGP');
            if(navigator.getGamepads()[0]) {
                if(!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }

    // DEBUG
    //NAV.debug();
    //var navMesh = NAV.toMesh();
    //RC.addToScene(navMesh);
    //	event listener
    //	---------------------------------------------------------------------------
    //	resize window
    window.addEventListener('resize', onWindowResize, false);
    //	keyboard callbacks
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // Initializes the menu
    if (gui == undefined) {
        initGUI();
    }
    restart();
}

function renderRealisation() {
    view();
    camera.lookAt(carPosition.position);
    switch(mod_realisation){
        case 0:
            RC.renderer.setViewport( 0, 0, 1*canvasWidth, 1*canvasHeight );
            RC.renderer.render(RC.scene, RC.camera);
            break;
        case 1:
            RC.renderer.setViewport( 0, 0, 1*canvasWidth, 1*canvasHeight );
            RC.renderer.render(RC.scene, camera);
            break;
        case 2:
            RC.renderer.setViewport( 0, 0, 0.5*canvasWidth, 1*canvasHeight );
            // Rendering
            RC.renderer.render(RC.scene, RC.camera);

            RC.renderer.setViewport( 0.5*canvasWidth, 0, 0.5*canvasWidth, 1*canvasHeight );
            RC.renderer.render(RC.scene, camera);
            break;
        case 3:
            RC.renderer.setViewport( 0, 0, 0.5*canvasWidth, 0.5*canvasHeight );
            // Rendering
            RC.renderer.render(RC.scene, RC.camera);

            RC.renderer.setViewport( 0.5*canvasWidth, 0.5*canvasHeight, 0.5*canvasWidth, 0.5*canvasHeight );
            RC.renderer.render(RC.scene, camera);
            break;
        default:
            console.log(mod_realisation);
            console.log("Mode non traité");
    }
}

function updateTiming(dt) {
    if (timerStarted) {
        delta = new Date().getTime() - time;
        var date = new Date(null);
        date.setMilliseconds(delta); // specify value for SECONDS here
        $("#timing").text(date.toISOString().substr(11, 11))
    } else {
        time = new Date().getTime();
    }
}

function toggleWelcomeScreen() {
    if (welcomeScreen) {
        $("#welcomeScreen").hide();
    } else {
        $("#welcomeScreen").show();
    }
    welcomeScreen = !welcomeScreen;
}

function setPlayerMode(num) {
    playerMode = num;
    timerStarted = true;
    noty({text: 'To begin using your gamepad, connect it and press any button!'});
}
