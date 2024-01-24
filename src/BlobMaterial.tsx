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
varying vec3 vOrigin;
varying vec3 vDirection;


void main()	{

  vUv = uv;
  vOrigin = ( inverse(modelMatrix) * vec4(cameraPosition,1.0)).xyz;
  vDirection = position - vOrigin;

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;

}
`;
const FRAGMENT_SHADER=`
varying vec2 vUv;
varying vec3 vOrigin;
varying vec3 vDirection;
uniform float time;
uniform vec3 color;

uint wang_hash(uint seed)
{
  seed = (seed ^ 61u) ^ (seed >> 16u);
  seed *= 9u;
  seed = seed ^ (seed >> 4u);
  seed *= 0x27d4eb2du;
  seed = seed ^ (seed >> 15u);
  return seed;
}

float randomFloat(inout uint seed)
{
  return float(wang_hash(seed)) / 4294967296.;
}
vec2 hitBox( vec3 orig, vec3 dir ) {
  const vec3 box_min = vec3( - 0.5 );
  const vec3 box_max = vec3( 0.5 );
  vec3 inv_dir = 1.0 / dir;
  vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
  vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
  vec3 tmin = min( tmin_tmp, tmax_tmp );
  vec3 tmax = max( tmin_tmp, tmax_tmp );
  float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
  float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
  return vec2( t0, t1 );
}
float smoothMin(float d1, float d2, float k){
  float h = exp(-k * d1) + exp(-k * d2);
  return -log(h) / k;
}

float sphereSDF(vec3 samplePoint, float size){
  return length(samplePoint) - size;
}

float sceneSDF(vec3 samplePoint){
  float d=sphereSDF(samplePoint , 0.05);
  d = smoothMin(
    d,
    sphereSDF(samplePoint - vec3(0.3 * sin(time*0.33) ,0.0,0.0), 0.05),
    16.0
  );
  d = smoothMin(
    d,
    sphereSDF(samplePoint - vec3(0.0, 0.3 * sin(time), 0.0), 0.05),
    16.0
  );
  return d;
}
vec3 getNormal(vec3 p){
  vec2 d = vec2(0, 0.001);
  return normalize(vec3(
    sceneSDF(p + d.yxx) - sceneSDF(p - d.yxx),
    sceneSDF(p + d.xyx) - sceneSDF(p - d.xyx),
    sceneSDF(p + d.xxy) - sceneSDF(p - d.xxy)
  ));
}


void main(){
  vec3 rayDir = normalize( vDirection );
  vec2 bounds = hitBox( vOrigin, rayDir );

  if ( bounds.x > bounds.y ) discard;

  bounds.x = max( bounds.x, 0.0 );

  vec3 p = vOrigin + bounds.x * rayDir;
  vec3 inc = 1.0 / abs( rayDir );
  float distance = 9999.0;
  float delta = 1.0;
  vec4 c=vec4(0.0);
  for ( int i = 0; i< 64 ; i++ ) {
    distance = sceneSDF( p );
    if(distance < 0.001){
      vec3 ld = normalize(vec3(1.0,1.0,1.0));
      vec3 n = getNormal(p);
      float ambient = 0.6;
      float diffuse = clamp(dot(n, ld), 0., 1.) * .2;
      c = vec4(color * (diffuse + ambient),1.0);
      // c = vec4(color,1.0);
      break;
    }
    delta = distance;
    p += rayDir * delta;
  }
  if(c.a < 0.001){
    discard;
  }
  gl_FragColor=c;
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