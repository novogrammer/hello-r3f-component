import * as React from 'react';
import {type MeshBasicMaterialProps} from '@react-three/fiber';
import {type ForwardRefComponent} from '@react-three/drei/helpers/ts-utils';
import {MeshTransparentVideoMaterial as MeshTransparentVideoMaterialImpl} from './MeshTransparentVideoMaterial.ts';

type Props = MeshBasicMaterialProps;

export const MeshTransparentVideoMaterial: ForwardRefComponent<
Props,
MeshTransparentVideoMaterialImpl
> = /* @__PURE__ */ React.forwardRef(({...props}: Props, ref) => {
  const [material] = React.useState(
    () => new MeshTransparentVideoMaterialImpl(),
  );

  return <primitive ref={ref} object={material} attach='material' {...props}/>;
});
