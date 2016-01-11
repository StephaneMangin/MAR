if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoaderV2.js is required to load script VideoPanel.js" ;
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules(['threejs/three.min.js', 'DebugHelper.js']) ;

/** A video panel
 * 
 * @param configuration
 * @returns {VideoPanel}
 */
function VideoPanel(configuration)
{
	if(!configuration.hasOwnProperty('position')) { configuration.position = new THREE.Vector3(0.0,0.0,0.0) ; }
	if(!configuration.hasOwnProperty('xLength')) { configuration.xLength = 5 ; }
	if(!configuration.hasOwnProperty('yLength')) { configuration.yLength = 2 ; }
	if(!configuration.hasOwnProperty('zLength')) { configuration.zLength = 2 ; }
	if(!configuration.hasOwnProperty('xAngle')) { configuration.xAngle = 0.0 ; }
	if(!configuration.hasOwnProperty('yAngle')) { configuration.yAngle = 0.0 ; }
	if(!configuration.hasOwnProperty('zAngle')) { configuration.zAngle = 0.0 ; }
    if(!configuration.hasOwnProperty('camera')) { configuration.camera = new THREE.PerspectiveCamera() ; }

	this.position = configuration.position ; //new THREE.Vector3(0.0,0.0,0.0) ;
    this.add

	this.angles = new THREE.Vector3(configuration.xAngle, configuration.yAngle, configuration.zAngle) ;

	this.xLength = configuration.xLength ;
	this.yLength = configuration.yLength  ;
	this.zLength = configuration.zLength  ;

	verticalMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color:0x889999 } );
    var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 60, 60 ), verticalMirror.material );
    verticalMirrorMesh.add( verticalMirror );
    verticalMirrorMesh.position.y = 35;
    verticalMirrorMesh.position.z = -45;

	/** Updates the video based on provided forces.
	 *
	 */
	this.update = function(camera)
	{

	} ;
	
}