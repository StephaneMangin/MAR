/**
 *  Particles Engine Wrapper
 */

function ParticlesEngineWrapper() {

    this.active = false;
    this.engine = undefined;
    this.type = undefined;
    this.node = undefined;
    this.particleMesh = undefined;
    this.originalPositionSpread = undefined;

    this.ParticuleTypes = {
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
        CLOUDS: {
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
        SNOW: {
            positionStyle: Type.CUBE,
                positionBase: new THREE.Vector3(0, 0, 0),
                positionSpread: new THREE.Vector3(500, 500, 500),

                velocityStyle: Type.CUBE,
                velocityBase: new THREE.Vector3(0, -60, 0),
                velocitySpread: new THREE.Vector3(50, 20, 50),
                accelerationBase: new THREE.Vector3(0, -10, 0),

                angleBase: 0,
                angleSpread: 720,
                angleVelocityBase: 0,
                angleVelocitySpread: 60,

                particleTexture: THREE.ImageUtils.loadTexture('images/snowflake.png'),

                sizeTween: new Tween([0, 0.25], [0.5, 2]),
                colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
                opacityTween: new Tween([2, 3], [0.8, 0]),

                particlesPerSecond: 4000,
                particleDeathAge: 4.0,
                emitterDeathAge: 3600
        },
        RAIN: {
            positionStyle: Type.CUBE,
                positionBase: new THREE.Vector3(0, 0, 0),
                positionSpread: new THREE.Vector3(500, 500, 500),

                velocityStyle: Type.CUBE,
                velocityBase: new THREE.Vector3(0, -400, 0),
                velocitySpread: new THREE.Vector3(20, 5, 10),
                accelerationBase: new THREE.Vector3(0, -10, 0),

                particleTexture: THREE.ImageUtils.loadTexture('images/raindrop2flip.png'),

                sizeBase: 0.5,
                sizeSpread: 10.0,
                colorBase: new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
                colorSpread: new THREE.Vector3(0.00, 0.0, 0.2),
                opacityBase: 0.6,

                particlesPerSecond: 4000,
                particleDeathAge: 4.0,
                emitterDeathAge: 3600
        },
        SMOKE: {
            positionStyle: Type.CUBE,
                positionBase: new THREE.Vector3(0, 0, 0),
                positionSpread: new THREE.Vector3(10, 0, 10),

                velocityStyle: Type.CUBE,
                velocityBase: new THREE.Vector3(0, 10, 0),
                velocitySpread: new THREE.Vector3(80, 50, 80),
                accelerationBase: new THREE.Vector3(0, -10, 0),

                particleTexture: THREE.ImageUtils.loadTexture('images/smokeparticle.png'),

                angleBase: 0,
                angleSpread: 720,
                angleVelocityBase: 0,
                angleVelocitySpread: 720,

                sizeTween: new Tween([0, 1], [32, 128]),
                opacityTween: new Tween([0.8, 2], [0.5, 0]),
                colorTween: new Tween([0.4, 1], [new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(0, 0, 0.5)]),

                particlesPerSecond: 5,
                particleDeathAge: 60,
                emitterDeathAge: 60
        },
        FIRE: {
            positionStyle: Type.SPHERE,
                positionBase: new THREE.Vector3(0, 0, 0),
                positionRadius: 2,

                velocityStyle: Type.CUBE,
                velocityBase: new THREE.Vector3(0, 10, 0),
                velocitySpread: new THREE.Vector3(10, 0, 10),

                particleTexture: THREE.ImageUtils.loadTexture('images/smokeparticle.png'),

                sizeTween: new Tween([0, 0.3, 1.2], [20, 150, 1]),
                opacityTween: new Tween([0.9, 1.5], [1, 0]),
                colorTween: new Tween([0.5, 1.0], [new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0)]),
                blendStyle: THREE.AdditiveBlending,

                particlesPerSecond: 60,
                particleDeathAge: 0.2,
                emitterDeathAge: 60
        },
        EXPLOSION: {
            positionStyle: Type.SPHERE,
                positionBase: new THREE.Vector3(0, 0, 0),
                positionRadius: 2,

                velocityStyle: Type.SPHERE,
                speedBase: 40,
                speedSpread: 8,

                particleTexture: THREE.ImageUtils.loadTexture('images/smokeparticle.png'),

                sizeTween: new Tween([0, 0.1], [1, 150]),
                opacityTween: new Tween([0.7, 1], [1, 0]),
                colorBase: new THREE.Vector3(0.02, 1, 0.4),
                blendStyle: THREE.AdditiveBlending,

                particlesPerSecond: 60,
                particleDeathAge: 1.5,
                emitterDeathAge: 60
        }
    }
}

ParticlesEngineWrapper.prototype = {

    constructor: ParticlesEngineWrapper,

    /**
     * Returns if this engine is active or not
     *
     */
    isActive: function () {
        return this.active;
    },

    /**
     * Start the engine
     *
     * @returns {boolean} true if started, false if not
     */
    start: function (node) {
        console.log("start");
        if (this.type != undefined) {
            this.particleMesh = this.engine.initialize();
            this.particleMesh.rotateX(Math.PI / 2);
            node.add(this.particleMesh);
            this.node = node;
            this.active = true;
            return true;
        }
        console.error("Select a type for your particle engine before start !")
        return false;
    },

    /**
     * Set the type of this engine
     *
     * @param type
     */
    setType: function (type) {
        console.log("setType");
        this.type = type;
        this.engine = new ParticleEngine();
        this.originalPositionSpread = this.engine.positionSpread;
        this.engine.setValues(type);
    },

    /**
     * Update particles position
     *
     * @param dt
     * @param speed Vector3
     */
    update: function (dt, speed) {
        console.log("update");
        if (this.active) {
            if (speed != null) {
                this.engine.positionSpread = this.originalPositionSpread.sub(speed);
            }
            this.engine.update(dt);
        }
    },

    /**
     * Stop the engine
     *
     * @returns {boolean} true if stopped, false if not
     */
    stop: function () {
        if (this.active) {
            this.engine.particleArray.forEach(function (particle) {
                delete particle;
            });
            this.node.remove(this.particleMesh);
            this.particleMesh = undefined;
            this.engine.destroy();
            this.active = false;
            return true;
        }
        return false;
    }
};