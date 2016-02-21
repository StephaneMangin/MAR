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

var rendererId = undefined;

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
var CARy = 0;
var CARz = 0;
var CARtheta = 0;
// car speed
var dt = 1.0 / 60;
var dx = 1.0;
var carMass = 50;

var vehicle, scene, RC, Lights, Loader, car0, car1, car2, car3, fallEngine, gui = undefined;


function removeEntity(scene, name) {
    var selectedObject = scene.getObjectByName(name);
    scene.remove(selectedObject);
}

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
    car0 = new THREE.Object3D();
    car0.name = 'car0';
    car0.position = new THREE.Vector3(CARx, CARy, CARz);
    RC.addToScene(car0);
    // initial POS
    // car Rotation floor slope follow
    car1 = new THREE.Object3D();
    car1.name = 'car1';
    car0.add(car1);
    // car vertical rotation
    car2 = new THREE.Object3D();
    car2.name = 'car2';
    car1.add(car2);
    car2.rotation.z = CARtheta;
    // the car itself
    // simple method to load an object
    car3 = Loader.load({filename: 'assets/car_Zup_01.obj', node: car2, name: 'car3'});
    car3.position.z = +0.25;
    // attach the scene camera to car
    car3.add(RC.camera);
    RC.camera.position.x = 0.0;
    RC.camera.position.z = 10.0;
    RC.camera.position.y = -25.0;
    RC.camera.rotation.x = 85.0 * 3.14159 / 180.0;

}

//	window resize
function onWindowResize() {
    RC.onWindowResize(window.innerWidth, window.innerHeight);
}

function reset() {
    delete vehicle, scene, RC, Lights, Loader, car0, car1, car2, car3, fallEngine, gui;
    var canvas = document.getElementsByTagName('canvas')
    for(var i = canvas.length - 1; 0 <= i; i--)
        if(canvas[i] && canvas[i].parentElement)
            canvas[i].parentElement.removeChild(canvas[i]);
    var Node1 = document.getElementById("game");
    var len = Node1.childNodes.length;

    for(var i = 0; i < len; i++)
    {
        if(Node1.childNodes[i].id == 'child')
        {
            Node1.removeChild(Node1.childNodes[i]);
        }
    }
    initLand();
    initObjects();
    render();
}

function render() {
    renderedId = requestAnimationFrame(render);
    handleKeys();
    // Vehicle stabilization
    vehicle.stabilizeSkid(50);
    vehicle.stabilizeTurn(1000);
    vehicle.update(dt);
    var oldPosition = vehicle.position.clone();
    vehicle.update(dt);
    var newPosition = vehicle.position.clone();
    newPosition.sub(oldPosition);
    // NAV
    NAV.move(newPosition.x, newPosition.y, 150, 10);
    // car0
    car0.position.set(NAV.x, NAV.y, NAV.z);
    // Updates the vehicle
    vehicle.position.set(NAV.x, NAV.y, NAV.z);
    // Updates car1
    car1.matrixAutoUpdate = false;
    car1.matrix.copy(NAV.localMatrix(CARx, CARy));
    // Updates car2
    car2.rotation.z = vehicle.angles.z - Math.PI / 2.0;
    // Rendering
    RC.renderer.render(RC.scene, RC.camera);
    fallEngine.update(0.01 * 0.5, vehicle.position);

};

function initGUI() {
    var options = function () {
        this.Title = 'TP MANGIN';
        this.Inertia = dt * 100;
        this.Mass = carMass;
        this.Trees = false;
        this.Particules = [];
        this.Reset = function () {
            reset();
        };
    };

    var text = new options();
    gui = new dat.GUI();

    gui.add(text, 'Title');
    var gameControls = gui.addFolder('Game controls');

    gameControls.add(text, 'Reset');
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
                fallEngine.stop();
                fallEngine.setParticle(fallEngine.types[value]);
                fallEngine.start();
            } else {
                fallEngine.stop();
            }
        }
    )
}
//	callback functions
//	---------------------------------------------------------------------------
function handleKeyDown(event) {
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
}

function initLand()
{

    //	rendering env
    RC = new ThreeRenderingEnv();
    scene = RC.scene;

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
    NAV = new navPlaneSet(new navPlane('p01', -260, -180, -80, 120, +0, +0, 'px'));
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

    fallEngine = new FallEngine();
}

function start() {

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

    initLand();
    initObjects();
    initGUI();
    render();
}
