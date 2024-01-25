import * as THREE from "three";

export class MeshTransparentVideoMaterial extends THREE.MeshBasicMaterial{
  constructor(parameters?:THREE.MeshBasicMaterialParameters){
    super(parameters);
    this.transparent=true;
    this.onBeforeCompile=(shader)=>{
      // console.log("onBeforeCompile");
      shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>',
`
#include <uv_vertex>
#ifdef USE_MAP
vMapUv.y = vMapUv.y * 0.5 + 0.5;
#endif
`
      );
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',
`
#include <map_fragment>
#ifdef USE_MAP
diffuseColor.a = texture2D( map, vec2(vMapUv.x, vMapUv.y - 0.5)).r;
#endif
`
      );
      // console.log(shader.fragmentShader);
    };
  }
}