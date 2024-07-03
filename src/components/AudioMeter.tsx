import React from "react";

const AudioMeter: React.FC<{ level: number }> = ({ level }) => {
    const height = `${level * 100}%`;
    const backgroundColor = level < 0.3 ? 'bg-green-500' : level < 0.7 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="h-8 w-32 bg-gray-200 rounded overflow-hidden">
            <div
                className={`w-full ${backgroundColor} transition-all duration-100 ease-out`}
                style={{ height, marginLeft: `${100 - level * 100}%` }}
            ></div>
        </div>
    );
};

export default AudioMeter;