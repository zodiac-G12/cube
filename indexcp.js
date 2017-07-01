var width = 1000;//window.innerWidth;
var height = 1000;//window.innerHeight;
var rad = 3;
var scene;
var camera;
var renderer;
var controls;
var cube = [];
var N = 8;
var twoExist;
var cubelist = [];
var save = [];
var firstcolor = 0;
var color;
var turn;
var command=document.getElementById("command");
var command_mess = 0;
var now=document.getElementById("now");
var flag = 0;

function init() {
  scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);
	controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;
  renderer = createRenderer(width, height);
	var k = 0;
  for(var i = 0; i < N; i++){
    cube[i] = [];
    for(var j = 0; j < N; j++){
      if((i == N/2-1 && j == N/2-1) || (i == N/2 && j == N/2)){
        cube[i][j] = createCube(rad, -1, i, j);
      }else if((i == N/2-1 && j == N/2) || (i == N/2 && j == N/2-1)){
        cube[i][j] = createCube(rad, 1, i, j);
      }
      else cube[i][j] = createCube(rad, 0, i, j);
      cubelist[k++] = cube[i][j];
    //  cube[i][j] = [];
      //  for(var k = 0; k < N; k++){
      //    if(i == 0 && j == 0 && k == 0) cube[i][j][k] = createCube(side, side, side, 0xFA0040, (-N/2)*10+k*10+5, (-N/2)*10+j*10+5, (-N/2)*10+i*10+5);
      //    else cube[i][j][k] = createCube(side, side, side, 0xFACC2E, (-N/2)*10+k*10+5, (-N/2)*10+j*10+5, (-N/2)*10+i*10+5);
     //   };
    };
  };
	var light1 = createLight(0xFFFFFF, -1000, 2000, -1000);
	var light2 = createLight(0xFFFFFF, 1000, 2000, 1000);
	camera.position.x = 100;
  camera.position.y = 100;
	camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(light1);
  scene.add(light2);
	update();
}



function createRenderer(width, height) {
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	renderer.setClearColor(0x2EFE2E, 1);
  document.body.appendChild(renderer.domElement);
	return renderer;
}



function createCube(rad, color, x, z) {

  //候補位置FF0040 (2)
  //何もないFACC2E (0)
  //白FFFFFF (-1)
  //黒000000 (1)

  var colorcord;
  if(color == 2){
    colorcord = 0xFF0040;
  }else if(color == -1){
    colorcord = 0xFFFFFF;
  }else if(color == 1){
    colorcord = 0x000000;
  }else{
    colorcord = 0xFACC2E;
  }

  var geometry = new THREE.SphereGeometry(rad, 25, 25);
	var material = new THREE.MeshPhongMaterial({color: colorcord});
	var cube = new THREE.Mesh(geometry, material);

  cube.color = color;

  //座標設定
  cube.mapx = x;
  cube.mapy = z;

  cube.position.set((-N/2)*10+x*10+5, 0, (-N/2)*10+z*10+5);


  scene.add(cube);
	return cube;
}



function createLight(color, x, y, z) {
	var light = new THREE.DirectionalLight(color);
	light.position.set(x, y, z);
	return light;
}



function showtext(mess){
  var str;
  if(mess != "fin"){
    if(mess == 0){
      turn = (color == -1) ? "White turn.\n" : "Black turn.\n";
    }else turn = (color == -1) ? "SKIP! White turn.\n" : "SKIP! Black turn.\n";
    str = turn + "おける箇所: " + canput() + " 箇所";
  }else{
    var whitepoint = 0;
    var blackpoint = 0;
    for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
      if(cube[i][j].color == 1){
        blackpoint++;
      }else if(cube[i][j].color == -1) whitepoint++;
      if(blackpoint > whitepoint){
        str = "Black WIN!\n" + "Black: " + blackpoint + " White: " + whitepoint;
      }else if(blackpoint < whitepoint){
        str = "White WIN!\n" + "Black: " + blackpoint + " White: " + whitepoint;
      }else str = "DRAW!\n" + "Black: " + blackpoint + " White: " + whitepoint;
    }}
  }
  now.textContent = str; 
}



function update() {
  controls.update();
  requestAnimationFrame(update);
	renderer.render(scene, camera);

  var projector = new THREE.Projector();

  //マウスのグローバル変数
  var mouse = { x: 0, y: 0};
 
  if(command_mess == 0 && flag == 0) command.textContent = "Please first decide a color."; 
  if(window.location.href.split("#")[1] != undefined && window.location.href.split("#")[1] != "white" && window.location.href.split("#")[1] != "black" && flag == 0){
    command.textContent = "No! Please first decide the color!";
  }else if(window.location.href.split("#")[1] != undefined && flag == 0) command.textContent = "Ok."
  //マウスが動かされた時
  if(window.location.href.split("#")[1] == "white" || window.location.href.split("#")[1] == "black" || flag == 1) window.onmousemove = function (ev){
    if (ev.target == renderer.domElement) {

        if(flag == 0) flag = 1;
        if(firstcolor == 0){
          if(window.location.href.split("#")[1] == "white"){
            firstcolor = -1;
            command.textContent = "You are White. after."
          }else if(window.location.href.split("#")[1] == "black"){
            firstcolor = 1;
            command.textContent = "You are Black. first." 
          }
          color = 1;
          if(firstcolor != 0 && window.location.href.split("#")[1] == ""){
            
          }
          obj_link = document.getElementById("randkun");
          obj_link.parentNode.removeChild(obj_link);  
          showtext(0);
          if(firstcolor == -1) ai();
        }

        //マウス座標2D変換
        var rect = ev.target.getBoundingClientRect();
        mouse.x =  ev.clientX - rect.left;
        mouse.y =  ev.clientY - rect.top;

        //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
        mouse.x =  (mouse.x / width) * 2 - 1;
        mouse.y = -(mouse.y / height) * 2 + 1;

        // マウスベクトル
        var vector = new THREE.Vector3( mouse.x, mouse.y ,1);

        // vector はスクリーン座標系なので, オブジェクトの座標系に変換
        projector.unprojectVector( vector, camera );

        // 始点, 向きベクトルを渡してレイを作成
        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        // クリック判定
        var obj = ray.intersectObjects(cubelist);
         // クリックしていたら、alertを表示
          if(obj.length > 0){
            obj[0].object.material.color.setHex(0x0067C0);
            save.push(obj[0]);
          }else if(save.length > 0){
            for(var i = 0; i < save.length; i++){
              //候補位置FF0040 (2)
              //何もないFACC2E (0)
              //白FFFFFF (-1)
              //黒000000 (1)
              var objcolor;
              if(save[i].object.color == 0){
                objcolor = 0xFACC2E;
              }else if(save[i].object.color == 2){
                objcolor = 0xFF0040;
              }else if(save[i].object.color == 1){
                objcolor = 0x000000;
              }else objcolor = 0xFFFFFF;
              save[i].object.material.color.setHex(objcolor);
            }
            save = [];
          }
    }

    //マウスが押された時
    window.onmousedown = function (e){
      if (e.target == renderer.domElement) {
        //クリックされたら停止
        if(controls.autoRotate){
           controls.autoRotate = false;
        }else controls.autoRotate = true;

        if(obj.length > 0){
          if(cube[obj[0].object.mapx][obj[0].object.mapy].color == 2){
            river(obj[0].object.mapx, obj[0].object.mapy);
            ai();
          }
          if(controls.autoRotate){
            controls.autoRotate = false;
          }else controls.autoRotate = true;
        }
      }
    };
  };

}



function river(x, y){
  var colorcord = (color == -1) ? 0xFFFFFF : 0x000000 ;
  for(var i = -1; i < 2; i++){for(var j = -1; j < 2; j++){
    if((i != 0 || j != 0) && 0 <= x+i && 0 <= y+j && x+i < N && y+j < N){
      var count = 0;
      var m = x+i;
      var n = y+j;
      while(cube[m][n].color == color * -1 && 0 <= m+i && 0 <= n+j && m+i < N && n+j < N){
        count++;
        m+=i;
        n+=j;
      }
      if(cube[m][n].color == color && count > 0){
        for(var k = 0; k < count; k++){
          cube[m+(k+1)*i*-1][n+(k+1)*j*-1].color = color;
          cube[m+(k+1)*i*-1][n+(k+1)*j*-1].material.color.setHex(colorcord);
        }
      }
    }
  }}
  cube[x][y].color = color;
  cube[x][y].material.color.setHex(colorcord);
  color *= -1;
  if(canput() == 0){
    color *= -1;
    if(canput() == 0) showtext("fin");
  }else showtext(0);
}




function canput(){
  //候補位置をリセット
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if(cube[i][j].color == 2){
      cube[i][j].color = 0;
      cube[i][j].material.color.setHex(0xFACC2E);
    }
  }}
  var twoExist = 0;
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if(cube[i][j].color == 0){
      for(var k = -1; k < 2; k++){for(var l = -1; l < 2; l++){
        if((k != 0 || l != 0) && 0 <= i+k && 0 <= j+l && i+k < N && j+l < N){
          var count = 0;
          var m = i+k;
          var n = j+l;
          while(cube[m][n].color == color * -1 && 0 <= m+k && 0 <= n+l && m+k < N && n+l < N){
            count++;
            m+=k;
            n+=l;
          }
          if(cube[m][n].color == color && count > 0) cube[i][j].color = 2;
        }
      }}
    }
  }}
  //候補位置カウント
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if(cube[i][j].color == 2){
      cube[i][j].material.color.setHex(0xFF0040);
      twoExist++;
    }
  }}
  return twoExist;
}



function randkun(){
  var xy = [];
  var k = 0;
  for(var i = 0; i < N; i++){for(var j = 0; j < N; j++){
    if(cube[i][j].color == 2){
      xy[k++] = [i, j];
    }
  }}
  return xy[getRandomInt(0, xy.length - 1)];
}



function ai(){
  var xy = [];
  xy = randkun();  
  river(xy[0], xy[1]);
}



function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



window.addEventListener('DOMContentLoaded', init);
