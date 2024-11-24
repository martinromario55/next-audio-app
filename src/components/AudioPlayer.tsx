/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  faPause,
  faPlay,
  faVolumeDown,
  faVolumeMute,
  faVolumeOff,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = (ref: never) => ({
  container: ref,
  waveColor: "#ccc",
  progressColor: "#0178ff",
  cursorColor: "transparent",
  responsive: true,
  height: 80,
  normalize: true,
  backend: "WebAudio",
  barWidth: 2,
  barGap: 3,
});

const formatTime = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const AudioPlayer = ({ audioFile }: { audioFile: any }) => {
  const waveFormRef = useRef(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState("");

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      setPlaying(!playing);
      wavesurfer.current.playPause();
    }
  };
  const handleMute = () => {
    if (wavesurfer.current) {
      setMuted(!muted);
      wavesurfer.current.setVolume(muted ? volume : 0);
    }
  };
  const handleVolumeChange = (newVolume: number) => {
    if (wavesurfer.current) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume);
      setMuted(newVolume === 0);
    }
  };
  const handleVolumeDown = () => {
    handleVolumeChange(Math.max(volume - 0.1, 0));
  };
  const handleVolumeUp = () => {
    handleVolumeChange(Math.min(volume + 0.1, 1));
  };

  useEffect(() => {
    if (typeof window === "undefined") return; //Ensure this runs only on the client side

    const options = formWaveSurferOptions(waveFormRef.current!);

    // @ts-expect-error options
    wavesurfer.current = WaveSurfer.create(options);

    // Load the audio file
    wavesurfer.current.load(audioFile);

    // When WaveSurfer is ready
    wavesurfer.current.on("ready", () => {
      if (wavesurfer.current) {
        setVolume(wavesurfer.current.getVolume());
        setDuration(wavesurfer.current.getDuration());
        setAudioFileName(audioFile.split("/").pop());
      }
    });

    // Update the current time and duration when the audio is playing
    wavesurfer.current.on("audioprocess", () => {
      if (wavesurfer.current) {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      }
    });

    // When the audio finishes playing
    wavesurfer.current.on("finish", () => {
      setPlaying(false);
      setCurrentTime(0);
    });

    // Clean up when the component is unmounted
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.un("audioprocess", () => {});
        wavesurfer.current.un("ready", () => {});
        wavesurfer.current.destroy();
      }
    };
  }, [audioFile]);

  return (
    <div className="w-96">
      <div ref={waveFormRef} className="w-full mb-2"></div>
      {/* Play/Pause button */}
      <div className="w-full">
        <button
          onClick={handlePlayPause}
          className="border p-2 dark:bg-slate-300 rounded-md dark:text-black hover:bg-slate-500 m-2 w-9"
        >
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </button>

        {/* Mute/Unmute button */}
        <button
          onClick={handleMute}
          className="border p-2 dark:bg-slate-300 rounded-md dark:text-black hover:bg-slate-500 m-2 w-9"
        >
          <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeMute} />
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          id="volume"
          name="volume"
          min={"0"}
          max={"1"}
          step={"0.05"}
          value={muted ? 0 : volume}
          onChange={e => handleVolumeChange(parseFloat(e.target.value))}
        />

        {/* Volume Down button */}
        <button
          onClick={handleVolumeDown}
          className="border p-2 dark:bg-slate-300 rounded-md dark:text-black hover:bg-slate-500 m-2"
        >
          <FontAwesomeIcon icon={faVolumeDown} />
        </button>

        {/* Volume Up button */}
        <button
          onClick={handleVolumeUp}
          className="border p-2 dark:bg-slate-300 rounded-md dark:text-black hover:bg-slate-500 m-2"
        >
          <FontAwesomeIcon icon={faVolumeUp} />
        </button>
      </div>

      <div
        style={{
          marginTop: "15px",
          color: "#fff",
          borderRadius: "4px",
          padding: "8px 15px",
          display: "inline-block",
          fontSize: "12px",
        }}
      >
        {/* Audio file name and current play time */}
        <span>
          Playing: {audioFileName} <br />
        </span>
        <span>
          Duration: {formatTime(duration)} | Current Time:{" "}
          {formatTime(currentTime)} <br />
        </span>
        <span>Volume: {Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
