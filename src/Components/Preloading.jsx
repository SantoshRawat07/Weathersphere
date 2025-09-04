import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const Preloader = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const textRef = useRef(null);
    const barRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            textRef.current,
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        const progressTl = gsap.timeline();
        progressTl.to({}, {
            duration: 3,
            ease: "power2.out",
            onUpdate: function () {
                const prog = Math.round(this.progress() * 100);
                setProgress(prog);
            }
        });

        gsap.fromTo(
            barRef.current,
            { width: "0%" },
            {
                width: "100%",
                duration: 3,
                ease: "power2.out"
            }
        );

        const timer = setTimeout(() => {
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => setLoading(false),
            });
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
        >
            {/* Title */}
            <h1
                ref={textRef}
                className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-blue-400 to-pink-400 text-transparent bg-clip-text"
                style={{
                    backgroundImage: "linear-gradient(90deg, #3b82f6, #60a5fa, #f472b6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}
            >
                Weathersphere
            </h1>


            {/* Loading bar */}
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                    ref={barRef}
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                        background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                    }}
                />
            </div>

            {/* Progress text */}
            <div className="text-lg font-medium text-gray-600">
                Loading {progress}%
            </div>
        </div>
    );
};

export default Preloader;