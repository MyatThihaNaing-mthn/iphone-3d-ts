import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { heroVideo, smallHeroVideo } from "../utils";
import { useEffect, useState } from "react";
const Hero = () => {
    const [video, setVideo] = useState<string | undefined>(
        window.innerWidth < 768 ? smallHeroVideo : heroVideo
    );

    useGSAP(() => {
        gsap.to(
            "#hero",
            {
                opacity: 1,
                duration: 1,
                ease: "power2.inOut",
            }
        )
        gsap.to(
            "#cta",
            {
                opacity: 1,
                y: -50,
                duration: 1,
                ease: "power2.inOut",
                delay: 2,
            }
        )
    })

    useEffect(() => {
        window.addEventListener("resize", () => {
            setVideo(window.innerWidth < 768 ? smallHeroVideo : heroVideo);
        });
        return () => {
            window.removeEventListener("resize", () => {});
        }
    }, []);

  return (
    <section className=" w-full nav-height bg-black relative">
        <div className= " w-full h-5/6 flex-col flex-center">
        <p id="hero" className="hero-title">iPhone 15 Pro</p>
        <div className=" md:w-10/12 w-9/12 flex-center">
            <video autoPlay muted playsInline={true} key={video}
                className=" pointer-events-none">
                <source src={video} type="video/mp4" />
            </video>
        </div>
        </div>
        <div id="cta" className=" flex-col flex-center opacity-0 translate-y-20">
            <a href={"#highlights"} className="btn">Buy</a>
            <p className="font-normal text-xl">From $41.62/mo. for 24 mo. or $999</p>
        </div>
    </section>
  )
}

export default Hero;