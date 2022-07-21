const segments = 10000;
const particles = 500000;
var x=1;
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

    if(x==1){
        var box = getPointBox(1);
    }
    else if(x==2){
        var box=getEdgeBox(1, 1, 1);
    }
    else if(x==3){
        var box= getSolidBox();
    }
    var plane = getPlane(20);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -2;

    var pointLight1 = getPointLight(1);
    pointLight1.position.y = 1.5;
    var sphere1 = getSphere(0.05);
    box.name = 'box';

    scene.add(box);
    scene.add(pointLight1);
    scene.add(plane);
    pointLight1.add(sphere1);

    const pointLightFolder1 = gui.addFolder("pointLight1");
    const boxFolder = gui.addFolder("box");
    pointLightFolder1.add(pointLight1, 'intensity', 0, 10);
    pointLightFolder1.add(pointLight1.position, 'x', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'y', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'z', 0, 5);
    
    boxFolder.add(box.scale, 'x', 0, 2);
    boxFolder.add(box.scale, 'y', 0, 2);
    boxFolder.add(box.scale, 'z', 0, 2);

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('rgb(120, 120, 120)');

    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    var controls1 = new THREE.DragControls([box], camera, renderer.domElement);
    update(renderer, scene, camera, controls);

    return scene;
}

function getSolidBox(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w,h,d,16,16,16);

    var textureLoader = new THREE.TextureLoader();
    image = textureLoader.load('diffuse.jpg');

    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        map: image
    })

    var mesh = new THREE.Mesh(geometry,material);
    mesh.castShadow = true;
    return mesh;
}

function getLineBox(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w, h, d, 16, 16, 16);
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    line.material.color = 'rgb(120,120,120)';
    line.castShadow = true;

    return line;
}

function getPointBox(w, h, d)
{
    var geometry = new THREE.BoxGeometry(w, h, d, 16, 16, 16);
    var material = new THREE.PointsMaterial( { color: 0x888888, size: 0.1} );
    var point = new THREE.Points( geometry, material );
    point.castShadow = true;
    return point;
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

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function update(renderer, scene, camera, controls)
{
    renderer.render(scene,camera);

    var box = scene.getObjectByName('box');
    box.rotation.z += 0.01;
    box.rotation.y += 0.01;

    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
    
}
var scene = init();
