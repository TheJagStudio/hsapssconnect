import React,{useEffect, useState} from "react";

const Splash = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);
    return (
        <div className={"absolute top-0 left-0 w-screen h-screen bg-gradient-to-b from-secondary-200 to-secondary-300 flex flex-col items-center justify-center transition-all delay-300 duration-500 z-50 " + (loading ? "translate-y-0" : "-translate-y-[100%]")}>
            <img src="/static/images/logo.png" alt="logo" className="w-1/2 h-auto max-w-64 z-10" />
            <p className="text-6xl font-haspss font-bold text-background drop-shadow-[0_0_3px_#44678555]">CONNECT</p>
        </div>
    );
};

export default Splash;
