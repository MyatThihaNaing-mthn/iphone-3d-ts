import { hightlightsSlides } from "../constants";
import { useEffect, useRef, useState } from "react";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Video = {
    isEnd: boolean,
    startPlay: boolean,
    videoId: number,
    isLastVideo: boolean,
    isPlaying: boolean
}

const VideoCarousel = () => {
    const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
    const videoSpanRef = useRef<(HTMLSpanElement | undefined)[]>([]); 
    const videoDivRef = useRef<(HTMLElement | undefined)[]>([]);  

    const [video, setVideo] = useState<Video>({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false
    }); 
    const [loadedData, setLoadedData] = useState<HTMLVideoElement[]>([]);

    const {isEnd, startPlay, videoId, isLastVideo, isPlaying} = video;  

    const handleLoadedData = (i: number, e: HTMLVideoElement) => {
        setLoadedData(prev => [...prev, e]);
    }

    console.log(loadedData);

    const handleProcess = (action: string, i: number) => {
        switch(action) {
            case 'video-end': 
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isEnd: true,
                    videoId: i+1,
                }))
                break;
            case 'video-last':
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isLastVideo: true,
                }))
                break;
            case 'video-reset':
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isLastVideo: false, 
                    videoId: 0, 
                }))
                break;
            case 'video-play':
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isPlaying: !prevVideo.isPlaying,
                }))
                break;  
            case 'video-pause':
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isPlaying: !prevVideo.isPlaying,
                }))
                break;
            default:
                return video;
        }
    }

    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${videoId * -100}%)`, 
            duration: 2, 
            ease: 'power2.inOut',
        })
        gsap.to('#video', {
            scrollTrigger: { 
                trigger: '#video',
                toggleActions: 'restart none none none', 
            },
            onComplete: () => {
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    startPlay: true,
                    isPlaying: true,
                }))
            }
        })
     }, [videoId, isEnd])

    useEffect(()=> {
        if(loadedData.length >3 ) {
            if(!isPlaying) {
                videoRef.current[videoId]?.pause();
            } else if (startPlay) {
                videoRef.current[videoId]?.play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData])

    useEffect(()=> {
        let currentProgress = 0;
        const span = videoSpanRef.current;
        if(span[videoId]) {
            const animate = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(animate.progress() * 100);
                    if(progress != currentProgress) {
                        currentProgress = progress;
                        const element = videoDivRef.current[videoId];
                        if (element) {
                            gsap.to(element, {  
                                width: window.innerWidth > 768 ? '10vw' 
                                : window.innerWidth < 1200 ? '10vw'
                                : '4vw',
                            });
                        }
                        const spanElement = span[videoId];
                        if (spanElement) {
                            gsap.to(spanElement, {
                                width: `${currentProgress}%`,
                                backgroundColor: '#fff',
                            })
                        }
                    }

                },
                onComplete: () => {
                    if(isPlaying) {
                        const element = videoDivRef.current[videoId];
                        if (element) {
                            gsap.to(element, {
                                width: '12px',
                            });
                        }
                    }
                    const spanElement = span[videoId];
                    if (spanElement) {
                        gsap.to(spanElement, {
                            backgroundColor: '#afafaf',
                        });
                    }
                }
            })

            if (videoId == 0) {
                animate.restart();
            }

            const animationUpdate = () => { 
                const videoElement = videoRef.current[videoId];
                if (videoElement) {
                    animate.progress(videoElement.currentTime / hightlightsSlides[videoId].videoDuration);
                }
             }

             if(isPlaying) { 
                gsap.ticker.add(animationUpdate);
             } else {
                gsap.ticker.remove(animationUpdate);
             }
        }
    }, [videoId, startPlay, isPlaying])
    return (
        <>
            <div className=" flex items-center">
                {hightlightsSlides.map((list, i)=> (
                    <div key={list.id} id="slider"  
                        className=" sm:pr-20 pr-10">
                         <div className="video-carousel_container ">
                            <div className=" w-full h-full flex-center rounded-3xl overflow-hidden bg-black ">
                                <video id="video" playsInline autoPlay muted preload="auto"
                                        ref={(el) => {
                                            if (el) videoRef.current[i] = el;
                                        }}
                                        onPlay={() => {
                                            setVideo((prevVideo) => (
                                                {...prevVideo, isPlaying: true}
                                            ))
                                        }}
                                        onEnded={() => 
                                            i !== 3 
                                            ? handleProcess('video-end', i)
                                            : handleProcess('video-last', i)
                                         }
                                        onLoadedMetadata={(e) => handleLoadedData(i, e.currentTarget)}>
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div> 
                            <div className=" absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text) => (
                                    <p key={text}
                                    className=" md:text-2xl text-xl font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>    
                         </div>   
                    </div>
                ))}
            </div>
            <div className=" relative flex-center mt-10 ">
                <div className=" flex-center py-5 px-7
                    bg-gray-300 backdrop-blur rounded-full ">
                        {videoRef.current.map((_, index) => (
                            <span key={index} ref={(el) => {
                                if (el) videoDivRef.current[index] = el;
                            }}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer">
                                <span className=" absolute h-full w-full rounded-full "
                                    ref={(el) => {
                                        if (el) videoSpanRef.current[index] = el;
                                    }}>

                                </span>
                            </span>
                        ))}
                </div>
                <button className="control-btn" 
                     onClick={() => {
                        if (isLastVideo) {
                            handleProcess('video-reset', videoId);
                        } else if (isPlaying) {
                            handleProcess('video-pause', videoId);
                        } else {
                            handleProcess('video-play', videoId);
                        }
                    }}>
                    <img src={isLastVideo? replayImg : isPlaying? pauseImg : playImg } alt={isLastVideo? "replay" : isPlaying? "pause" : "play"} />
                </button>
            </div>
        </>
    )
}

export default VideoCarousel;