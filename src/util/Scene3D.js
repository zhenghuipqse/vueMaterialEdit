import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {materialpi,materialbu} from "@/util/TextureEnum";
import effectController from "@/util/effectController"
import {GUI} from "three/examples/jsm/libs/dat.gui.module";

const api = { state: '皮质' };
const matsss = ["布艺","皮质"];

export default class Scene3D {
    constructor() {

        this.width = window.innerWidth;
        this.height =  window.innerHeight-132;
        this.init(this.width, this.height);

        this.initControls();

        this.initLights(effectController);

        this.setUpGui();
    }

    init(w, h) {

        this.camera = new THREE.PerspectiveCamera(45, w / h, 0.25, 200000);
        this.camera.position.set(-1.8, 0.6, 2.7);

        this.scene = new THREE.Scene();
        this.scene2 = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);


        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(w, h);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        // this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.canvas = this.renderer.domElement;


        this.raycaster = new THREE.Raycaster();
        this.canvas.addEventListener("click", this.onClick.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));

    }

    onClick(e){

        e.preventDefault();
        if (!this.currentmodel)
            return;
        let mouse = new THREE.Vector2();
        mouse.x = ( e.offsetX / this.canvas.offsetWidth ) * 2 - 1;
        mouse.y = -( e.offsetY / this.canvas.offsetHeight ) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        let intersects = this.raycaster.intersectObject(this.currentmodel, true);

        if(this.selcttedmesh){
            let mesh = this.getMeshByName();
            if(mesh){
                mesh.visible = false;
            }
            this.selcttedmesh = null;
            this.selcttedmeshName = null;
            this.phongMaterial = null;
        }
        if (intersects.length > 0) {
            let selectedObject = intersects[0].object;
            // outlinePass.selectedObjects = [selectedObject];
            this.selcttedmesh = selectedObject;
            this.selcttedmeshName = selectedObject.name;
            this.phongMaterial = this.selcttedmesh.material;


            let mesh = this.getMeshByName();
            if(mesh){

                mesh.visible = true;
            }
        }

        this.render();
    }

    changeTexture(val){
        if(this.selcttedmesh && this.selcttedmesh.material){
            //texture
            let texture = new THREE.Texture();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            let loader = new THREE.ImageLoader();
            loader.load(val, image => {
                texture.image = image;

                let phongMaterial = this.selcttedmesh.material;
                if ( Array.isArray( phongMaterial ) ) {
                    for(let i=0;i<phongMaterial.length;i++){
                        let temp = phongMaterial[i];
                        temp.map = texture;
                        temp.needsUpdate = true;
                    }
                }else{
                    phongMaterial.map = texture;
                }

                texture.needsUpdate = true;
                this.selcttedmesh.material.needsUpdate = true;
                this.render();
            });

        }
    }

    getMeshByName(){
        let aaa= null;
        if(this.selcttedmeshName && this.currentmodelGezi){
            this.currentmodelGezi.traverse(mesh => {
                if(mesh instanceof THREE.Mesh && mesh.name == this.selcttedmeshName){
                    aaa = mesh;
                }
            })
        }
        return aaa;
    }

    initLights(effectController){
        // LIGHTS
        // let ambient = new THREE.AmbientLight(0xffffff, 0.8);
        this.ambient = new THREE.AmbientLight(0xcccccc, 0.8);	// 0.2

        this.scene.add(this.ambient);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
        // dirLight.castShadow = true;
        // dirLight.shadow.camera.top = 2000;
        // dirLight.shadow.camera.bottom = - 2000;
        // dirLight.shadow.camera.left = - 2000;
        // dirLight.shadow.camera.right = 2000;
        // dirLight.shadow.camera.near = 0.1;
        // dirLight.shadow.camera.far = 40000;
        this.scene.add(this.dirLight);

        this.dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        // dirLight2.castShadow = true;
        // dirLight2.shadow.camera.top = 2000;
        // dirLight2.shadow.camera.bottom = - 2000;
        // dirLight2.shadow.camera.left = - 2000;
        // dirLight2.shadow.camera.right = 2000;
        // dirLight2.shadow.camera.near = 0.1;
        // dirLight2.shadow.camera.far = 40000;
        this.scene.add(this.dirLight2);

        this.dirLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
        // dirLight3.castShadow = true;
        // dirLight3.shadow.camera.top = 2000;
        // dirLight3.shadow.camera.bottom = - 2000;
        // dirLight3.shadow.camera.left = - 2000;
        // dirLight3.shadow.camera.right = 2000;
        // dirLight3.shadow.camera.near = 0.1;
        // dirLight3.shadow.camera.far = 40000;
        this.scene.add(this.dirLight3);

        this.ambient.intensity = effectController.intensity;
        this.ambient.color.setHSL(effectController.hue, effectController.saturation, effectController.lightness * effectController.ka);


        this.dirLight.position.set(effectController.lx, effectController.ly, effectController.lz);
        this.dirLight.color.setHSL(effectController.lhue, effectController.lsaturation, effectController.llightness);
        this.dirLight.intensity = effectController.lintensity;


        this.dirLight2.color.setHSL(effectController.lhue2, effectController.lsaturation2, effectController.llightness2);
        this.dirLight2.position.set(effectController.lx2, effectController.ly2, effectController.lz2);
        this.dirLight2.intensity = effectController.lintensity2;

        this.dirLight3.color.setHSL(effectController.lhue3, effectController.lsaturation3, effectController.llightness3);
        this.dirLight3.position.set(effectController.lx3, effectController.ly3, effectController.lz3);
        this.dirLight3.intensity = effectController.lintensity3;
    }

    initPmremGenerator(renderer) {

        this.pmremGenerator = new THREE.PMREMGenerator(renderer);
        this.pmremGenerator.compileEquirectangularShader();
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.addEventListener('change', this.render.bind(this)); // use if there is no animation loop
        this.controls.minDistance = 2;
        this.controls.target.set(0, 0, -0.2);
        this.controls.update();
    }

    onWindowResize() {

        this.width = window.innerWidth;
        this.height =  window.innerHeight-132;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.width, this.height );

        this.render();

    }

    addModel(object){
        if (this.currentmodel) {
            this.scene.remove(this.currentmodel);

        }
        if (this.currentmodelGezi) {
            this.scene2.remove(this.currentmodelGezi);
        }


        let modelObj = object;
        let maxx = -Number.MAX_VALUE;
        let maxy = -Number.MAX_VALUE;
        let maxz = -Number.MAX_VALUE;
        let minx = Number.MAX_VALUE;
        let miny = Number.MAX_VALUE;
        let minz = Number.MAX_VALUE;
        let meshindex = 1;
        modelObj.traverse(mesh => {
            if(mesh instanceof THREE.Mesh){
                // mesh.castShadow = true;
                mesh.geometry.computeBoundingBox();
                maxx = maxx < mesh.geometry.boundingBox.max.x ? mesh.geometry.boundingBox.max.x : maxx;
                minx = minx > mesh.geometry.boundingBox.min.x ? mesh.geometry.boundingBox.min.x : minx;

                maxy = maxy < mesh.geometry.boundingBox.max.y ? mesh.geometry.boundingBox.max.y : maxy;
                miny = miny > mesh.geometry.boundingBox.min.y ? mesh.geometry.boundingBox.min.y : miny;

                maxz = maxz < mesh.geometry.boundingBox.max.z ? mesh.geometry.boundingBox.max.z : maxz;
                minz = minz > mesh.geometry.boundingBox.min.z ? mesh.geometry.boundingBox.min.z : minz;




                /*let material1 = new THREE.MeshStandardMaterial({
                    "color": "#ffffff",
                    "flatShading": false,
                    "opacity": 1,
                    "refractionRatio": 0.98,
                    "side": 0,
                    "roughness": 0.99,
                    "metalness": 0,
                    "aoMapIntensity": 1,
                    "bumpScale": 1,
                    "normalScale": {
                        "x": 1.82,
                        "y": -1.82
                    },
                    "emissive": "#000000",
                    "emissiveIntensity": 1,
                    "skinning": true,
                    "isRoushness": true,
                    "reflectivity": 0,
                    "uvdata": [
                        "",
                        1,
                        0,
                        0,
                        0
                    ],

                });*/

                //若改为环境光源需要打开这
                // material1.envMap = ldrCubeRenderTarget.texture;
                // material1.envMapIntensity = 1;



                let phongMaterial = mesh.material;
                if ( Array.isArray( phongMaterial ) ) {
                    for(let i=0;i<phongMaterial.length;i++){
                        let temp = phongMaterial[i];
                        phongMaterial[i] = materialbu.clone();
                        let mat = phongMaterial[i];
                        mat.aoMap = temp.aoMap;
                        mat.normalMap = temp.normalMap;
                        mat.map = temp.map;
                    }
                }else{
                    let temp = phongMaterial;
                    mesh.material = materialbu.clone();
                    mesh.material.aoMap = temp.aoMap;
                    mesh.material.normalMap = temp.normalMap;
                    mesh.material.map = temp.map;
                }
                /*mesh.material = materialbu.clone();
                mesh.material.needsUpdate = true;
                mesh.name = mesh.name + '_'+meshindex;*/
                mesh.material.needsUpdate = true;
                meshindex++;


            }
        })

//            object.position.y = -(maxy - miny) / 2;
        object.position.x = -(maxx + minx) / 2;
        object.position.y = -(maxy + miny) / 2;
        object.position.z = -(maxz + minz) / 2;
//            object.rotateY(-Math.PI / 4);
        let maxb = ((maxx - minx) / (maxy - miny) > (this.width / this.height)) ? (maxx - minx) : (maxy - miny);


        this.camera.position.z = maxb / 2 / Math.tan(Math.PI / 8) * 2;
        this.camera.position.y = 0;
        this.camera.position.x = 0;
        this.controls.target.x = 0;
        this.controls.target.y = 0;
        this.controls.target.z = 0;
        this.controls.update();


        this.currentmodelGezi = modelObj.clone();
        this.currentmodelGezi.traverse(mesh => {
            if(mesh instanceof THREE.Mesh){

                let material = new THREE.MeshBasicMaterial();
                material.wireframe = true;
                material.needsUpdate = true;
                mesh.material = material;
                mesh.geometry.needsUpdate = true;
                mesh.visible = false;
            }
        })
        this.scene2.add(this.currentmodelGezi);
        this.scene.add(modelObj);
        this.currentmodel = modelObj;
        this.render();
    }

    setUpGui(){
        let h;
        const gui = new GUI();

        // material (attributes)

        h = gui.addFolder( '面料' );
        h.add( api, 'state' ).options( matsss ).onChange( () => {
            this.changeMaterial( api.state );
        } );

        h = gui.addFolder( "Material control" );


        h.add( effectController, "roughness", 0.0, 1.0, 0.01 ).name( "roughness" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "metalness", 0.0, 1.0, 0.01 ).name( "metalness" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "aoMapIntensity", 0.0, 1.0, 0.01 ).name( "ao参数" ).onChange( this.effectChange.bind(this) );


        h.add( effectController, "shininess", -100.0, 100.0, 1.0 ).name( "shininess" ).onChange( this.effectChange.bind(this) );


        // h.add( effectController, 'refractionRatio', 0.0, 1.0, 0.01 ).name( "refractionRatio" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, 'envMapIntensity', 0.0, 1.0, 0.01 ).name( "envMapIntensity" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, 'bumpScale', 0.0, 3.0, 0.01 ).name( "bumpScale" ).onChange( this.effectChange.bind(this) );
        // h.add( effectController, 'reflectivity', 0.0, 1.0, 0.01 ).name( "reflectivity" ).onChange( this.effectChange.bind(this) );
        // h.add( effectController, 'exposure', 0.0, 2.0, 0.01 ).name( "exposure" ).onChange( this.effectChange.bind(this) );

        // material (color)

        h = gui.addFolder( "Material color" );

        h.add( effectController, "hue", 0.0, 1.0, 0.025 ).name( "色调" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "saturation", 0.0, 1.0, 0.025 ).name( "饱和度" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lightness", 0.0, 1.0, 0.025 ).name( "值" ).onChange( this.effectChange.bind(this) );
        // h.add( effectController, "kd", 0.0, 1.0, 0.025 ).name( "diffuse strength" ).onChange( this.effectChange.bind(this) );
        // h.add( effectController, "ks", 0.0, 1.0, 0.025 ).name( "specular strength" ).onChange( this.effectChange.bind(this) );
        // h.add( effectController, "metallic" ).onChange( this.effectChange.bind(this) );

        // light (point)

        h = gui.addFolder( "环境光" );
        h.add( effectController, "intensity", 0.0, 10.0, 0.025 ).name( "强度" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "ka", 0, 1.0, 0.025 ).name( "ka" ).onChange( this.effectChange.bind(this) );
        // light (directional)

        h = gui.addFolder( "方向光" );

        h.add( effectController, "lx", - 1.0, 1.0, 0.025 ).name( "x" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "ly", - 1.0, 1.0, 0.025 ).name( "y" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lz", - 1.0, 1.0, 0.025 ).name( "z" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lhue", - 1.0, 1.0, 0.025 ).name( "色调" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lsaturation", - 1.0, 1.0, 0.025 ).name( "饱和度" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "llightness", - 1.0, 1.0, 0.025 ).name( "值" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lintensity", 0.0, 2.0, 0.025 ).name( "强度" ).onChange( this.effectChange.bind(this) );

        h = gui.addFolder( "方向光2" );

        h.add( effectController, "lx2", - 1.0, 1.0, 0.025 ).name( "x" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "ly2" , - 1.0, 1.0, 0.025 ).name( "y" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lz2", - 1.0, 1.0, 0.025 ).name( "z" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lhue2", - 1.0, 1.0, 0.025 ).name( "色调" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lsaturation2", - 1.0, 1.0, 0.025 ).name( "饱和度" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "llightness2", - 1.0, 1.0, 0.025 ).name( "值" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lintensity2", 0.0, 2.0, 0.025 ).name( "强度" ).onChange( this.effectChange.bind(this) );

        h = gui.addFolder( "方向光3" );

        h.add( effectController, "lx3", - 1.0, 1.0, 0.025 ).name( "x" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "ly3", - 1.0, 1.0, 0.025 ).name( "y" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lz3", - 1.0, 1.0, 0.025 ).name( "z" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lhue3", - 1.0, 1.0, 0.025 ).name( "色调" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lsaturation3", - 1.0, 1.0, 0.025 ).name( "饱和度" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "llightness3", - 1.0, 1.0, 0.025 ).name( "值" ).onChange( this.effectChange.bind(this) );
        h.add( effectController, "lintensity3", 0.0, 2.0, 0.025 ).name( "强度" ).onChange( this.effectChange.bind(this) );




        gui.open();

    }

    changeMaterial(s){
        if(this.phongMaterial){

            let mesh = this.getMeshByName();
            if(mesh){
                mesh.visible = false;
            }
        }
        if(this.selcttedmesh){
            let constmat;
            if(s == "皮质"){
                // selcttedmesh.material && selcttedmesh.material.dispose();
                constmat = materialpi;
            }else{
                // selcttedmesh.material && selcttedmesh.material.dispose();
                constmat = materialbu;

            }

            let selcttedmeshmaterial = this.selcttedmesh.material;
            if ( Array.isArray( selcttedmeshmaterial ) ) {
                for(let i=0;i<this.phongMaterial.length;i++){
                    let temp = this.phongMaterial[i];
                    this.phongMaterial[i] = constmat.clone();
                    let mat = this.phongMaterial[i];
                    mat.aoMap = temp.aoMap;
                    mat.normalMap = temp.normalMap;
                    mat.map = temp.map;
                    mat.needsUpdate = true;
                }
            }else{
                let temp = this.phongMaterial;
                this.selcttedmesh.material = constmat.clone();
                this.selcttedmesh.material.aoMap = temp.aoMap;
                this.selcttedmesh.material.normalMap = temp.normalMap;
                this.selcttedmesh.material.map = temp.map;
            }


            this.selcttedmesh.material.needsUpdate = true;
            this.render();
        }
    }

    effectChange(){
        if(this.phongMaterial){

            let mesh = this.getMeshByName();
            if(mesh){
                mesh.visible = false;
            }


            if ( Array.isArray( this.phongMaterial ) ) {
                for(let i=0;i<this.phongMaterial.length;i++){
                    let mat = this.phongMaterial[i];
                    mat.roughness = effectController.roughness;
                    mat.aoMapIntensity = effectController.aoMapIntensity;
                    mat.metalness = effectController.metalness;
                    mat.refractionRatio = effectController.refractionRatio;
                    mat.envMapIntensity = effectController.envMapIntensity;
                    mat.reflectivity = effectController.reflectivity;
                    mat.bumpScale = effectController.bumpScale;
                    mat.shininess = effectController.shininess;
                }
            }else{
                this.phongMaterial.roughness = effectController.roughness;
                this.phongMaterial.aoMapIntensity = effectController.aoMapIntensity;
                this.phongMaterial.metalness = effectController.metalness;
                this.phongMaterial.refractionRatio = effectController.refractionRatio;
                this.phongMaterial.envMapIntensity = effectController.envMapIntensity;
                this.phongMaterial.reflectivity = effectController.reflectivity;
                this.phongMaterial.bumpScale = effectController.bumpScale;
                this.phongMaterial.shininess = effectController.shininess;

            }


            this.selcttedmesh.material.needsUpdate = true;
        }

        if(this.currentmodel){
            this.currentmodel.traverse(function(mesh){
                if(mesh instanceof THREE.Mesh){
                    if(mesh.material){
                        if(mesh.material.specular){
                            /*diffuseColor.setHSL( effectController.hue, effectController.saturation, effectController.lightness );
                        diffuseColor.multiplyScalar( effectController.kd );
                        mesh.material.color.copy( diffuseColor );*/


                            /*if ( effectController.metallic ) {
                                // make colors match to give a more metallic look
                                specularColor.copy( diffuseColor );
                            } else {
                                // more of a plastic look
                                specularColor.setRGB( 1, 1, 1 );
                            }
                            specularColor.multiplyScalar( effectController.ks );
                            console.log("specular",mesh.material.specular);
                            mesh.material.specular && mesh.material.specular.copy( specularColor );*/
                        }

                        // mesh.material.needsUpdate = true;
                    }
                }
            })
        }



        // renderer.toneMappingExposure = effectController.exposure;

        this.ambient.intensity = effectController.intensity;
        this.ambient.color.setHSL( effectController.hue, effectController.saturation, effectController.lightness * effectController.ka );


        this.dirLight.position.set( effectController.lx, effectController.ly, effectController.lz );
        this.dirLight.color.setHSL( effectController.lhue, effectController.lsaturation, effectController.llightness );
        // console.log("huihui1",dirLight.color.r,dirLight.color.g,dirLight.color.b);
        this.dirLight.intensity = effectController.lintensity;


        this.dirLight2.color.setHSL( effectController.lhue2, effectController.lsaturation2, effectController.llightness2 );
        // console.log("huihui2",dirLight2.color.r,dirLight2.color.g,dirLight2.color.b);
        this.dirLight2.position.set( effectController.lx2, effectController.ly2, effectController.lz2 );
        this.dirLight2.intensity = effectController.lintensity2;

        this.dirLight3.color.setHSL( effectController.lhue3, effectController.lsaturation3, effectController.llightness3 );
        // console.log("huihui3",dirLight3.color.r,dirLight3.color.g,dirLight3.color.b);
        this.dirLight3.position.set( effectController.lx3, effectController.ly3, effectController.lz3 );
        this.dirLight3.intensity = effectController.lintensity3;
        this.render();
    }

    render(){
        this.renderer.clear();
        this.renderer.render( this.scene, this.camera );
        this.renderer.clearDepth();
        this.renderer.render(this.scene2, this.camera);
    }


}
