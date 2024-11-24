import AudioPlayer from "@/components/AudioPlayer";
import React from "react";

const Home = () => {
  const AudioFile = "/assets/chapter-1.mp3";
  // const AudioFile =
  //   "https://npmbljosrhshnnoebcrr.supabase.co/storage/v1/object/public/app-sample-audios/sample-853ed919-73df-454d-b86c-6c00be0d3af7";
  return (
    <div className="flex justify-center items-center h-full mt-44">
      <AudioPlayer audioFile={AudioFile} />
    </div>
  );
};

export default Home;
