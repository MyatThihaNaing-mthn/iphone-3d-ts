import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import * as THREE from 'three'
import Lights from './Lights';
import { Loader } from './Loader';
import { Iphone } from './Iphone';
import { Suspense, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Model } from '../types';

type ModelViewProps = {
    index: number;
    groupRef: React.RefObject<THREE.Group>;
    gsapType: string;
    controlRef: React.RefObject<OrbitControlsImpl | null>;
    setRotationState: (state: number) => void;
    size: string;
    item: Model;
};

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }: ModelViewProps) => {

  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls 
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current?.getAzimuthalAngle() || 0)}
      /> 

      <group ref={groupRef} name={index === 1 ? 'small' : 'large'} position={[0, 0, 0]}>
        <Suspense fallback={<Loader />}>
          <Iphone 
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default ModelView