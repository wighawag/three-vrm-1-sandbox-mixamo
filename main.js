/* global THREE, THREE_VRM, loadVRM, loadMixamoAnimation */

const width = window.innerWidth;
const height = window.innerHeight;

// -- renderer -------------------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

// -- camera ---------------------------------------------------------------------------------------
const camera = new THREE.PerspectiveCamera( 30.0, width / height, 0.01, 20.0 );
camera.position.set( 0.0, 0.0, 5.0 );

// -- scene ----------------------------------------------------------------------------------------
const scene = new THREE.Scene();

// -- light ----------------------------------------------------------------------------------------
const light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1.0, 1.0, 1.0 ).normalize();
scene.add( light );

// ambient
const ambient = new THREE.AmbientLight( 0x222222 );
scene.add( ambient );

// -- vrm ------------------------------------------------------------------------------------------
let currentVRM = undefined; // 現在使用中のvrm、update内で使えるようにするため
let currentMixer = undefined; // 現在使用中のAnimationMixer、update内で使えるようにするため

// const modelUrl = 'https://cdn.glitch.me/c4e5cfb3-513e-4d82-a37f-62836378466b%2Fthree-vrm-girl-1.0-beta.vrm?v=1636610288920'; // モデルのURL
const modelUrl = './meebit_05965.vrm'; //'./three-vrm-girl-1.0-beta.vrm';

// const animationUrl = 'https://cdn.glitch.global/b233b4ea-cf6c-403a-bb68-82babee52d57/Capoeira%20(1).fbx?v=1642556259178'; // MixamoのアニメーションのURL
// const animationUrl = './Mma Kick.fbx'; // './Capoeira (1).fbx'//'./Gangnam Style.fbx'; 
// const animationUrl = 'mixamo/animations/'+ location.hash.slice(1);
const animationUrl = './mixamo/animations/Running_c9c6cb0d-b96c-11e4-a802-0aaa78deedf9.fbx';

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// See: https://threejs.org/docs/#manual/en/introduction/Animation-system
loadVRM( modelUrl ).then( ( vrm ) => { // vrmを読み込む
  currentVRM = vrm; // currentGLTFにvrmを代入
  scene.add( vrm.scene ); // モデルをsceneに追加し、表示できるようにする

  const head = vrm.humanoid.getBoneNode( 'head' ); // vrmの頭を参照する
  // camera.position.set( 0.0, head.getWorldPosition( new THREE.Vector3() ).y, 6.0 ); // カメラを頭が中心に来るように動かす

  const pos =  head.getWorldPosition( new THREE.Vector3() );
  controls.target.fromArray([pos.x,pos.y, pos.z])
  controls.update()


  currentMixer = new THREE.AnimationMixer( vrm.scene ); // vrmのAnimationMixerを作る
  currentMixer.timeScale = 1;
  
  loadMixamoAnimation( animationUrl, vrm ).then( ( clip ) => { // アニメーションを読み込む
    currentMixer.clipAction( clip ).play(); // アニメーションをMixerに適用してplay
  } );
} );

// -- update ---------------------------------------------------------------------------------------
const clock = new THREE.Clock();
clock.start();

function update() {
  requestAnimationFrame( update );

  const delta = clock.getDelta(); // 前フレームとの差分時間を取得
  
  if ( currentMixer ) { // アニメーションが読み込まれていれば
    currentMixer.update( delta ); // アニメーションをアップデート
  }

  if ( currentVRM ) { // VRMが読み込まれていれば
    currentVRM.update( delta ); // VRMの各コンポーネントを更新
  }

  renderer.render( scene, camera ); // 描画
};
update();
