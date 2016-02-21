function FallEngine() {


    var isActive = false

    /*
     Particle Engine options:

     positionBase   : new THREE.Vector3(),
     positionStyle : Type.CUBE or Type.SPHERE,

     // for Type.CUBE
     positionSpread  : new THREE.Vector3(),

     // for Type.SPHERE
     positionRadius  : 10,

     velocityStyle : Type.CUBE or Type.SPHERE,

     // for Type.CUBE
     velocityBase       : new THREE.Vector3(),
     velocitySpread     : new THREE.Vector3(),

     // for Type.SPHERE
     speedBase   : 20,
     speedSpread : 10,

     accelerationBase   : new THREE.Vector3(),
     accelerationSpread : new THREE.Vector3(),

     particleTexture : THREE.ImageUtils.loadTexture( 'images/star.png' ),

     // rotation of image used for particles
     angleBase               : 0,
     angleSpread             : 0,
     angleVelocityBase       : 0,
     angleVelocitySpread     : 0,
     angleAccelerationBase   : 0,
     angleAccelerationSpread : 0,

     // size, color, opacity
     //   for static  values, use base/spread
     //   for dynamic values, use Tween
     //   (non-empty Tween takes precedence)
     sizeBase   : 20.0,
     sizeSpread : 5.0,
     sizeTween  : new Tween( [0, 1], [1, 20] ),

     // colors stored in Vector3 in H,S,L format
     colorBase   : new THREE.Vector3(0.0, 1.0, 0.5),
     colorSpread : new THREE.Vector3(0,0,0),
     colorTween  : new Tween( [0.5, 2], [ new THREE.Vector3(0, 1, 0.5), new THREE.Vector3(1, 1, 0.5) ] ),

     opacityBase   : 1,
     opacitySpread : 0,
     opacityTween  : new Tween( [2, 3], [1, 0] ),

     blendStyle    : THREE.NormalBlending (default), THREE.AdditiveBlending

     particlesPerSecond : 200,
     particleDeathAge   : 2.0,
     emitterDeathAge    : 60
     */

    this.types = {
        clouds: {
            positionStyle: Type.CUBE,
            positionBase: new THREE.Vector3(-100, 100, 0),
            positionSpread: new THREE.Vector3(0, 50, 60),

            velocityStyle: Type.CUBE,
            velocityBase: new THREE.Vector3(40, 0, 0),
            velocitySpread: new THREE.Vector3(20, 0, 0),

            particleTexture: THREE.ImageUtils.loadTexture('images/smokeparticle.png'),

            sizeBase: 80.0,
            sizeSpread: 100.0,
            colorBase: new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
            opacityTween: new Tween([0, 1, 4, 5], [0, 1, 1, 0]),

            particlesPerSecond: 50,
            particleDeathAge: 10.0,
            emitterDeathAge: 60
        },
        snow: {
            positionStyle: Type.CUBE,
            positionBase: new THREE.Vector3(0, 200, 0),
            positionSpread: new THREE.Vector3(500, 0, 500),

            velocityStyle: Type.CUBE,
            velocityBase: new THREE.Vector3(0, -60, 0),
            velocitySpread: new THREE.Vector3(50, 20, 50),
            accelerationBase: new THREE.Vector3(0, -10, 0),

            angleBase: 0,
            angleSpread: 720,
            angleVelocityBase: 0,
            angleVelocitySpread: 60,

            particleTexture: THREE.ImageUtils.loadTexture('images/snowflake.png'),

            sizeTween: new Tween([0, 0.25], [1, 10]),
            colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
            opacityTween: new Tween([2, 3], [0.8, 0]),

            particlesPerSecond: 200,
            particleDeathAge: 4.0,
            emitterDeathAge: 60
        },
        rain: {
            positionStyle: Type.CUBE,
            positionBase: new THREE.Vector3(0, 200, 0),
            positionSpread: new THREE.Vector3(600, 0, 600),

            velocityStyle: Type.CUBE,
            velocityBase: new THREE.Vector3(0, -400, 0),
            velocitySpread: new THREE.Vector3(10, 50, 10),
            accelerationBase: new THREE.Vector3(0, -10, 0),

            particleTexture: THREE.ImageUtils.loadTexture('images/raindrop2flip.png'),

            sizeBase: 8.0,
            sizeSpread: 4.0,
            colorBase: new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
            colorSpread: new THREE.Vector3(0.00, 0.0, 0.2),
            opacityBase: 0.6,

            particlesPerSecond: 1000,
            particleDeathAge: 1.0,
            emitterDeathAge: 60
        }

    }

    this.isActive = function () {
        return isActive;
    }

    /**
     * Start the rain
     *
     */
    this.start = function () {
        if (engine == undefined) {
            engine = new ParticleEngine();
            engine.setValues(types.rain);
        }
        engine.initialize();
        isActive = true;
    }

    this.setParticle = function (type) {
        engine = new ParticleEngine();
        engine.setValues(type);
    }

    /**
     * Update rain position
     *
     * @param dt
     * @param position Vector3
     */
    this.update = function (dt, position) {
        if (isActive) {
            engine.positionBase = position;
            engine.update(dt);
        }
    }

    /**
     * Stop the rain
     *
     */
    this.stop = function () {
        if (isActive) {
            engine.destroy();
        }
        isActive = false;
    }

}