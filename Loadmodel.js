import * as THREE from "./three.module.js";
import {GUI} from "./lil-gui.module.min.js";
import {OrbitControls} from "./OrbitControls1.js"
import {GLTFLoader} from "./GLTFLoader.js"

function init() 
{
    var scene = new THREE.Scene();
    var gui = new GUI();

    var camera = new THREE.PerspectiveCamera(
        100,window.innerWidth/window.innerHeight,
        1,
        1000
    );

    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0,0,0));
    var loader = new GLTFLoader();
    loader.load('assets/toyfreddy.glb', function(glb){
        console.log(glb)
        var root;
        root = glb.scene;
        root.scale.set(0.5, 0.5, 0.5);
        scene.add(root);
    }, function(xhr){
        console.log((xhr.loaded/xhr.total * 180) + "% loaded")
    }, function(error){
        console.log('An error occured')
    })
    

    var plane = getPlane(20);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -2;


    var pointLight1 = getPointLight(1);
    pointLight1.position.y = 1.5;
    var sphere1 = getSphere(0.05);

    scene.add(pointLight1);
    scene.add(plane);
    pointLight1.add(sphere1);

    const pointLightFolder1 = gui.addFolder("pointLight1");
    pointLightFolder1.add(pointLight1, 'intensity', 0, 10);
    pointLightFolder1.add(pointLight1.position, 'x', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'y', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'z', 0, 5);


    var renderer = new THREE.WebGLRenderer();

    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('rgb(120, 120, 120)');

    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);

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

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function update(renderer, scene, camera, controls)
{
    renderer.render(scene,camera);

    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
}


var scene = init();