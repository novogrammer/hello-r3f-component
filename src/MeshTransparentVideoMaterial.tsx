import * as React from 'react'
import { MeshBasicMaterialProps } from '@react-three/fiber'

import { ForwardRefComponent } from '@react-three/drei/helpers/ts-utils'

import { MeshTransparentVideoMaterial as MeshTransparentVideoMaterialImpl } from './MeshTransparentVideoMaterial'

type Props = MeshBasicMaterialProps

export const MeshTransparentVideoMaterial: ForwardRefComponent<Props, MeshTransparentVideoMaterialImpl> =/* @__PURE__ */ React.forwardRef(({ ...props }: Props, ref) => {
  const [material] = React.useState(() => new MeshTransparentVideoMaterialImpl())

  return <primitive object={material} ref={ref} attach='material' {...props} />
})
