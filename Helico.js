if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoaderV2.js is required to load script Helico.js" ;
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules([
    'threejs/three.min.js',
    'Physics.js',
    'DebugHelper.js',
    "myJS/ThreeLoadingEnv.js"]) ;

/** A vehicule  
 * 
 * @param configuration
 * @returns {Helico}
 */
function Helico(name)
{
	//	Loading env
	var Loader = new ThreeLoadingEnv();
	//###################################################################################
	// HELICO
	//###################################################################################

	// helico Translation
	//###################################################################################
    this.helico = new THREE.Object3D();
	this.helico.name = name;
	Loader.load({filename: 'assets/helico/helicoCorp.obj', node: this.helico, name: 'helicoGeometry'}) ;
	//###################################################################################
	// Propulsion Centrale
	//###################################################################################

	// turbine
	// ###################################################################################
    this.turbineCentrale = new THREE.Object3D();
    this.turbineCentrale.name = 'turbineCentrale';
    this.helico.add(this.turbineCentrale);
    this.turbineCentrale.position.x = 0;
    this.turbineCentrale.position.y = 0;
    this.turbineCentrale.position.z = 5;
    this.turbineCentrale.rotation.x = 1.5;
	Loader.load({filename: 'assets/helico/turbine.obj', node: this.turbineCentrale, name: 'helicoGeometrypale1'}) ;

	// axe
	// ###################################################################################
    this.axeCentral = new THREE.Object3D();
    this.axeCentral.name = 'axeCentral';
    this.turbineCentrale.add(this.axeCentral);
    this.axeCentral.position.x = 0;
    this.axeCentral.position.y = 1;
    this.axeCentral.scale.x = 2;
    this.axeCentral.scale.z = 2;
	Loader.load({filename: 'assets/helico/axe.obj', node: this.axeCentral, name: 'helicoGeometryaxeCentral'}) ;

	// pale 1
	//###################################################################################
    this.pale1Centrale = new THREE.Object3D();
    this.pale1Centrale.name = 'pale1Centrale';
    this.axeCentral.add(this.pale1Centrale);
    this.pale1Centrale.position.x = 0;
    this.pale1Centrale.position.y = 2;
    this.pale1Centrale.rotation.z = 0.5;
    this.pale1Centrale.scale.x = 2;
    this.pale1Centrale.scale.z = 2;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale1Centrale, name: 'helicoGeometrypale1Centrale'}) ;
	// pale 2
	//###################################################################################
    this.pale2Centrale = new THREE.Object3D();
    this.pale2Centrale.name = 'pale2Centrale';
    this.axeCentral.add(this.pale2Centrale);
    this.pale2Centrale.position.x = 0;
    this.pale2Centrale.position.y = 2;
    this.pale2Centrale.rotation.y = 2;
    this.pale2Centrale.rotation.z = 0.5;
    this.pale2Centrale.scaleFactor = 2;
    this.pale2Centrale.scale.x = 2;
    this.pale2Centrale.scale.z = 2;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale2Centrale, name: 'helicoGeometrypale2Centrale'}) ;
	// pale 3
	//###################################################################################
    this.pale3Centrale = new THREE.Object3D();
    this.pale3Centrale.name = 'pale3Centrale';
    this.axeCentral.add(this.pale3Centrale);
    this.pale3Centrale.position.x = 0;
    this.pale3Centrale.position.y = 2;
    this.pale3Centrale.rotation.y = 4;
    this.pale3Centrale.rotation.z = 0.5;
    this.pale3Centrale.scale.x = 2;
    this.pale3Centrale.scale.z = 2;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale3Centrale, name: 'helicoGeometrypale3Centrale'}) ;

	//###################################################################################
	// Propulsion Gauche
	//###################################################################################

	// turbine
	//############################################Z######################################
    this.turbineGauche = new THREE.Object3D();
    this.turbineGauche.name = 'turbineGauche';
    this.helico.add(this.turbineGauche);
    this.turbineGauche.position.x = -8.5;
    this.turbineGauche.position.y = -3;
    this.turbineGauche.position.z = 4;
    this.turbineGauche.rotation.x = -4.5;
	Loader.load({filename: 'assets/helico/turbine.obj', node: this.turbineGauche, name: 'helicoGeometrypale1'}) ;

	// axe
	//###################################################################################
    this.axeGauche = new THREE.Object3D();
    this.axeGauche.name = 'axeGauche';
    this.turbineGauche.add(this.axeGauche);
    this.axeGauche.position.x = 0;
    this.axeGauche.position.y = 1;
	Loader.load({filename: 'assets/helico/axe.obj', node: this.axeGauche, name: 'helicoGeometryaxeGauche'}) ;
	// pale 1
	//###################################################################################
    this.pale1Gauche = new THREE.Object3D();
    this.pale1Gauche.name = 'pale1Gauche';
    this.axeGauche.add(this.pale1Gauche);
    this.pale1Gauche.position.x = 0;
    this.pale1Gauche.position.y = 2;
    this.pale1Gauche.rotation.y = 2;
    this.pale1Gauche.rotation.z = 0.5;
    this.pale1Gauche.scale.x = 0.8;
    this.pale1Gauche.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale1Gauche, name: 'helicoGeometrypale1Gauche'}) ;
	// pale 2
	//###################################################################################
    this.pale2Gauche = new THREE.Object3D();
    this.pale2Gauche.name = 'pale2Gauche';
    this.axeGauche.add(this.pale2Gauche);
    this.pale2Gauche.position.x = 0;
    this.pale2Gauche.position.y = 2;
    this.pale2Gauche.rotation.y = 4;
    this.pale2Gauche.rotation.z = 0.5;
    this.pale2Gauche.scale.x = 0.8;
    this.pale2Gauche.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale2Gauche, name: 'helicoGeometrypale2Gauche'}) ;
	// pale 3
	//###################################################################################
    this.pale3Gauche = new THREE.Object3D();
    this.pale3Gauche.name = 'pale3Gauche';
    this.axeGauche.add(this.pale3Gauche);
    this.pale3Gauche.position.x = 0;
    this.pale3Gauche.position.y = 2;
    this.pale3Gauche.rotation.z = 0.5;
    this.pale3Gauche.scale.x = 0.8;
    this.pale3Gauche.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale3Gauche, name: 'helicoGeometrypale3Gauche'}) ;

	//###################################################################################
	// Propulsion Droite
	//###################################################################################

	// turbine
	//###################################################################################
    this.turbineDroite = new THREE.Object3D();
    this.turbineDroite.name = 'turbineDroite';
    this.helico.add(this.turbineDroite);
    this.turbineDroite.position.x = 8.5;
    this.turbineDroite.position.y = -3;
    this.turbineDroite.position.z = 4;
    this.turbineDroite.rotation.x = -4.5;
	Loader.load({filename: 'assets/helico/turbine.obj', node: this.turbineDroite, name: 'helicoGeometrypale1'}) ;

	// axe
	//###################################################################################
    this.axeDroit = new THREE.Object3D();
    this.axeDroit.name = 'axeDroit';
    this.turbineDroite.add(this.axeDroit);
    this.axeDroit.position.x = 0;
    this.axeDroit.position.y = 1;
	// helico Rotation slope follow
	Loader.load({filename: 'assets/helico/axe.obj', node: this.axeDroit, name: 'helicoGeometryaxeDroit'}) ;

	// pale 1
	//###################################################################################
    this.pale1Droite = new THREE.Object3D();
    this.pale1Droite.name = 'pale1Droite';
    this.axeDroit.add(this.pale1Droite);
    this.pale1Droite.position.x = 0;
    this.pale1Droite.position.y = 2;
    this.pale1Droite.rotation.z = 0.5;
    this.pale1Droite.scale.x = 0.8;
    this.pale1Droite.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale1Droite, name: 'helicoGeometrypale1Droite'}) ;
	// pale 2
	//###################################################################################
    this.pale2Droite = new THREE.Object3D();
    this.pale2Droite.name = 'pale2Droite';
    this.axeDroit.add(this.pale2Droite);
    this.pale2Droite.position.x = 0;
    this.pale2Droite.position.y = 2;
    this.pale2Droite.rotation.y = 2;
    this.pale2Droite.rotation.z = 0.5;
    this.pale2Droite.scale.x = 0.8;
    this.pale2Droite.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale2Droite, name: 'helicoGeometrypale2Droite'}) ;
	// pale 3	//###################################################################################
    this.pale3Droite = new THREE.Object3D();
    this.pale3Droite.name = 'pale3Droite';
    this.axeDroit.add(this.pale3Droite);
    this.pale3Droite.position.x = 0;
    this.pale3Droite.position.y = 2;
    this.pale3Droite.rotation.y = 4;
    this.pale3Droite.rotation.z = 0.5;
    this.pale3Droite.scale.x = 0.8;
    this.pale3Droite.scale.z = 0.8;
	Loader.load({filename: 'assets/helico/pale.obj', node: this.pale3Droite, name: 'helicoGeometrypale3Droite'}) ;

    // Default values

    /**
     * Give an environment to this object
     *
     * @param env
     */
    this.setEnv = function(env) {
        env.addToScene(this.helico);
    }

    /**
     * Give a camera to this object
     *
     * @param camera
     */
    this.setCamera = function(camera) {
        this.helico.add(camera);
    }

    /**
     * Give a vector to set the main turbine rotation speed
     *
     * @param speed
     */
    this.setMainTurbineRotationSpeed = function(speed) {
        this.axeCentral.rotation.y += - speed.x * 1.0E-3;
    }

    /**
     * Give a value to set the secondary turbines rotation speed
     *
     * @param value
     */
    this.setDirectionalTurbineRotationSpeed = function(speed) {

        if (speed.y >= 0) {
            var turbineAngularValue = -4.5 - speed.y / 50;
            var secondaryTurbineRotationValue = speed.y / 10;
        } else {
            var turbineAngularValue = -4.5 + speed.y / 50;
            var secondaryTurbineRotationValue = - speed.y / 10;
        }
        // update angular position of each turbine
        if (turbineAngularValue >= -6.5 && turbineAngularValue <= -4.5) {
            this.turbineGauche.rotation.x = turbineAngularValue;
            this.turbineDroite.rotation.x = turbineAngularValue;
        }
        this.axeGauche.rotation.y = secondaryTurbineRotationValue;
        this.axeDroit.rotation.y = secondaryTurbineRotationValue;
    }

    /**
     * Helico Rotation setter helper
     *
     * @param value in degree
     */
    this.setInclinaison = function(speed) {
        this.helico.rotation.x -= speed.y / 5000;
        this.helico.rotation.y -= speed.x / 5000;
	}

    /**
     * Helico Position helper setter
     *
     * @param x
     * @param y
     * @param z
     */
    this.setPosition = function(x, y, z) {
        this.helico.position.x = x
        this.helico.position.y = y;
        this.helico.position.z = z;
    }

    /**
     * Helico matrix helper setter
     *
     * @param x
     * @param y
     * @param z
     */
    this.setMatrix = function(matrix) {
        this.helico.matrixAutoUpdate = false;
        this.helico.matrix.copy(matrix);
    }

    this.update = function(vehicle, dt) {
        var speed = vehicle.speed;
        var momentum = vehicle.momentum;
        var position = vehicle.position;
        console.log("speed => ", speed.x, speed.y, speed.z);
        console.log("position => " + position.x, position.y, position.z);
        console.log("momentum => " + momentum.x, momentum.y, momentum.z);
        //console.log("turbineAngularValue => " + turbineAngularValue);
        //console.log("mainTurbineRotationValue => " + mainTurbineRotationValue);
        //console.log("secondaryTurbineRotationValue => " + secondaryTurbineRotationValue);

        this.helico.rotation.z = vehicle.angles.z-Math.PI/2.0 ;
        this.setMainTurbineRotationSpeed(speed);
        this.setDirectionalTurbineRotationSpeed(speed);
        this.setInclinaison(speed);
    }
}