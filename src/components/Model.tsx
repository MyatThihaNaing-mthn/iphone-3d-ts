import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { yellowImg } from "../utils";
import * as THREE from "three";
import ModelView from "./ModelView";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models, sizes } from "../constants";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { animateWithGsapTimeline } from "../utils/animations";

type Model = {
  title: string;
  color: string[];
  img: string;
};

const Model = () => {
  const [size, setSize] = useState<string>("small");
  const [model, setModel] = useState<Model>({
    title: "iphone 15 pro natural titanium",
    color: ["#8f8a2c", "#ffe7b9", "#6f6c64"],
    img: yellowImg,
  });

  const cameraControlSmall = useRef<OrbitControlsImpl | null>(null);
  const cameraControlLarge = useRef<OrbitControlsImpl | null>(null);

  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  const [smallRotation, setSmallRotation] = useState<number>(0);
  const [largeRotation, setLargeRotation] = useState<number>(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    console.log("not first render");
    const tl = gsap.timeline();
    if (size === "large") {
      animateWithGsapTimeline({
        tl,
        size: small,
        firstView: "#view1",
        secondView: "#view2",
        rotation: smallRotation,
        animationProps: { duration: 1, transform: "translateX(-100%)" },
      });
    }
    if (size === "small") {
      animateWithGsapTimeline({
        tl,
        size: large,
        firstView: "#view2",
        secondView: "#view1",
        rotation: largeRotation,
        animationProps: { duration: 1, transform: "translateX(0)" },
      });
    }
  }, [size]);

  useGSAP(() => {
    gsap.to("#heading", {
      y: 0,
      opacity: 1,
    });
  }, []);
  return (
    <section className="common-padding ">
      <div className=" screen-max-width ">
        <h1 id="heading" className=" section-heading ">
          Take a closer look{" "}
        </h1>
        <div className=" flex flex-col items-center mt-5">
          <div className=" w-full  h-[75vh] md:h-[90vh] overflow-hidden relative">
            <ModelView
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />
            <ModelView
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              size={size}
              item={model}
            />

            <Canvas
              className=" w-full h-full"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                overflow: "hidden",
                zIndex: 1000,
              }}
              eventSource={document.getElementById("root") || undefined}
            >
              <View.Port />
            </Canvas>
          </div>
          <div className=" w-full mx-auto ">
            <p className="text-sm font-light text-center mb-5 ">
              {model.title}
            </p>
            <div className=" flex-center">
              <ul className=" color-container">
                {models.map((item, index) => (
                  <li
                    key={index}
                    className=" w-6 h-6 rounded-full mx-2"
                    style={{
                      backgroundColor: item.color[0],
                    }}
                    onClick={() => setModel(item)}
                  />
                ))}
              </ul>
              <button className=" size-btn-container">
                {sizes.map(({ label, value }) => (
                  <span
                    key={label}
                    className=" size-btn"
                    style={{
                      backgroundColor: size === value ? "white" : "transparent",
                      color: size === value ? "black" : "white",
                    }}
                    onClick={() => {
                      setSize(value);
                    }}
                  >
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;
