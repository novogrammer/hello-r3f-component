import * as React from "react";
import * as THREE from "three";
import {ShaderMaterial} from "three";
import { /*ReactThreeFiber,*/ useFrame } from "@react-three/fiber";
import { ForwardRefComponent } from "@react-three/drei/helpers/ts-utils";


interface Uniform<T>{
  value: T;
}

interface BlobMaterialImplParams{
  color?:THREE.ColorRepresentation;
}

const VERTEX_SHADER=`
varying vec2 vUv;

void main()	{

  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;

}
`;
const FRAGMENT_SHADER=`
varying vec2 vUv;
uniform float time;
uniform vec3 color;
void main(){
  if(0.5<length(vUv - vec2(0.5))){
    discard;
  }
  gl_FragColor=vec4(color,1.0);
}

`;

class BlobMaterialImpl extends ShaderMaterial{
  _time:Uniform<number>;
  _color:Uniform<THREE.Color>;

  constructor({color}:BlobMaterialImplParams){
    super({
      uniforms:{
      },
      vertexShader:VERTEX_SHADER,
      fragmentShader:FRAGMENT_SHADER,
    });
    // this.side=THREE.DoubleSide;
    this._time={value:0};
    this._color={value:new THREE.Color()};
    if(color!==undefined){
      this._color.value=new THREE.Color(color);
    }
    this.uniforms={
      time:this._time,
      color:this._color,
    }
  }
  get time(){
    return this._time.value;
  }
  set time(v){
    this._time.value=v;
  }
  get color(){
    return this._color.value;
  }
  set color(v){
    this._color.value=v;
  }
}

interface Props{
  color:THREE.ColorRepresentation;
}

export const BlobMaterial: ForwardRefComponent<Props,BlobMaterialImpl>=/* @__PURE__ */ React.forwardRef(({color,...props}:Props,ref)=>{
  const [material]=React.useState(()=>new BlobMaterialImpl({color}));

  useFrame((state)=>{
    if(!material){
      return;
    }
    material.time=state.clock.getElapsedTime();
  });

  return <primitive object={material} ref={ref} attach="material" {...props} />;
});