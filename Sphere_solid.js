function init()
{
    var scene = new THREE.Scene();

    var gui = new dat.GUI();

    var camera = new THREE.PerspectiveCamera(
        45,window.innerWidth/window.innerHeight,
        1,
        1000
    );

    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0,0,0));

    var sphere = getSolidSphere(1);

    var plane = getPlane(20);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -2;

    var pointLight1 = getPointLight(1);
    pointLight1.position.y = 1.5;
    var sphere1 = getSphere(0.05);
    sphere.name = 'sphere';

    scene.add(sphere);
    scene.add(pointLight1);
    scene.add(plane);
    pointLight1.add(sphere1);

    const pointLightFolder1 = gui.addFolder("pointLight1");
    const shpereFolder = gui.addFolder("sphere");
    pointLightFolder1.add(pointLight1, 'intensity', 0, 10);
    pointLightFolder1.add(pointLight1.position, 'x', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'y', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'z', 0, 5);
    
    shpereFolder.add(sphere.scale, 'x', 0, 2);
    shpereFolder.add(sphere.scale, 'y', 0, 2);
    shpereFolder.add(sphere.scale, 'z', 0, 2);

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('rgb(120, 120, 120)');

    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    var controls1 = new THREE.DragControls([sphere], camera, renderer.domElement);
    update(renderer, scene, camera, controls);

    return scene;
}

function getPlane(size)
{
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side: THREE.DoubleSide
    })
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh
}

function getSphere(size)
{
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)'
    })
    var mesh = new THREE.Mesh(geometry,material);
    return mesh;
}

function getSolidSphere(size)
{
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var textureLoader = new THREE.TextureLoader();
    image = textureLoader.load('./image/earth.jpg');

    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        map: image
    })

    var mesh = new THREE.Mesh(geometry,material);
    mesh.castShadow = true;
    return mesh;
}


function getLineSphere(size)
{
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    line.material.color = 'rgb(120,120,120)';
    line.castShadow = true;

    return line;
}

function getPointSphere(size)
{
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.PointsMaterial( { color: 0x888888, size: 0.1} );
    var point = new THREE.Points( geometry, material );
    point.castShadow = true;
    return point;
}

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function update(renderer, scene, camera, controls)
{
    renderer.render(scene,camera);

    var sphere = scene.getObjectByName('sphere');
    sphere.rotation.z += 0.01;
    sphere.rotation.y += 0.01;

    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
}
var scene = init();