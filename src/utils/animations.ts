import { RefObject } from "react"
import * as THREE from 'three'

type AnimateWithGsapTimelineProps = {
    tl: GSAPTimeline,
    size: RefObject<THREE.Group<THREE.Object3DEventMap>>,
    firstView: string,
    secondView: string,
    rotation: number,
    animationProps: {
        duration: number,
        transform: string,
    }
    
}
export const animateWithGsapTimeline = ({tl, size, firstView, secondView, rotation, animationProps}: AnimateWithGsapTimelineProps) => {
    
    tl.to(size.current.rotation, {
        y: rotation,
        duration: 1,
        ease: 'power2.inOut',
    })
    
    tl.to(firstView, {
        ...animationProps,
        ease: 'power2.inOut',
    })

    tl.to(secondView, {
        ...animationProps,
        ease: 'power2.inOut',
    }, '<')
}
