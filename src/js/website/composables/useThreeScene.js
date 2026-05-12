import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const GLB_URL = '/assets/models/factory.glb';

export function useThreeScene() {
    let renderer, scene, camera, controls, animId;
    let canvasEl = null;
    let io = null;
    let isVisible = true;
    let isTabVisible = true;
    // Populated after load — used by AppHero to pass to intro animation
    let buildingInfo = null;

    function shouldRender() { return isVisible && isTabVisible; }

    function onVisibilityChange() {
        isTabVisible = document.visibilityState === 'visible';
        scheduleTick();
    }

    function scheduleTick() {
        if (animId == null && shouldRender()) {
            animId = requestAnimationFrame(tick);
        }
    }

    function tick() {
        animId = null;
        if (!shouldRender()) return;
        controls.update();
        renderer.render(scene, camera);
        animId = requestAnimationFrame(tick);
    }

    function init(canvas) {
        canvasEl = canvas;
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x031739);

        // Temporary camera — updated after model loads with real positions
        camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
        camera.position.set(0, 5, -20);
        camera.lookAt(0, 0, 0);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.zoomSpeed = 0.6;
        controls.enablePan = true;
        controls.panSpeed = 0.6;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.4;
        controls.enableZoom = false;
        controls.minDistance = 5;
        controls.maxDistance = 200;
        controls.update();

        // Re-dispatch wheel events so the page can scroll
        canvas.addEventListener('wheel', e => {
            window.dispatchEvent(new WheelEvent('wheel', e));
        }, { passive: true });

        // Minimal lights — building meshes will be nearly invisible anyway
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xd8eaf6, 0.8);
        sun.position.set(5, 15, 5);
        scene.add(sun);

        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibilityChange);
        io = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            scheduleTick();
        }, { threshold: 0 });
        io.observe(canvas);
        scheduleTick();

        return loadBuilding();
    }

    function loadBuilding() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            const draco = new DRACOLoader();
            draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
            loader.setDRACOLoader(draco);
            loader.load(
                GLB_URL,
                (gltf) => {
                    const grp = gltf.scene;

                    // Make original meshes nearly invisible — pure wireframe aesthetic
                    grp.traverse((child) => {
                        if (child.isMesh) {
                            if (child.name === 'Object_2') {
                                child.visible = false;
                                return;
                            }
                            // Replace material entirely to avoid issues with exotic material types.
                            // depthWrite:false so MEP lines inside remain visible through the faces.
                            const mats = Array.isArray(child.material) ? child.material : [child.material];
                            const replaced = mats.map(() => new THREE.MeshBasicMaterial({
                                color: 0x060e1a,
                                transparent: true,
                                opacity: 0.06,
                                depthWrite: false,
                            }));
                            child.material = Array.isArray(child.material) ? replaced : replaced[0];
                        }
                    });

                    scene.add(grp);

                    // Compute bounding info — used to position camera and start animations
                    const box = new THREE.Box3().setFromObject(grp);
                    const center = box.getCenter(new THREE.Vector3());
                    const size   = box.getSize(new THREE.Vector3());
                    const sphere = new THREE.Sphere();
                    box.getBoundingSphere(sphere);

                    // Identical to prototype: fit longest axis to 18 units
                    const scale = 18 / Math.max(size.x, size.y, size.z);
                    grp.scale.setScalar(scale);
                    grp.position.copy(center.clone().multiplyScalar(-scale));

                    buildingInfo = { grp, center, size, radius: sphere.radius * scale, box };

                    // Use the exact camera positions from the prototype (calibrated for ZONE_DEFAULTS space)
                    const startPos   = new THREE.Vector3(0.043, 0.235, -15.910);
                    const lookTarget = new THREE.Vector3(0, 0, 0);

                    camera.position.copy(startPos);
                    camera.lookAt(lookTarget);
                    camera.updateProjectionMatrix();
                    controls.target.copy(lookTarget);
                    controls.update();

                    resolve({ grp, buildingInfo, startPos, lookTarget });
                },
                undefined,
                reject,
            );
        });
    }

    function onResize() {
        requestAnimationFrame(() => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        });
    }

    function getCamera()   { return camera; }
    function getScene()    { return scene; }
    function getControls() { return controls; }
    function getBuildingInfo() { return buildingInfo; }

    function destroy() {
        if (animId != null) cancelAnimationFrame(animId);
        animId = null;
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        if (io) { io.disconnect(); io = null; }
        controls.dispose();
        renderer.dispose();
    }

    return { init, getCamera, getScene, getControls, getBuildingInfo, destroy };
}
