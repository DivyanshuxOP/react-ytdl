import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function DownloadPage() {
  const location = useLocation();
  const [videoInfo, setVideoInfo] = useState(null);
  const [itag, setItag] = useState(""); // Selected itag
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const link = location.state?.link || "";

  useEffect(() => {
    if (link) {
      fetchVideoInfo(link);
    }
  }, [link]);

  const fetchVideoInfo = async (videoUrl) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/video-info", {
        params: { url: videoUrl },
      });

      if (response.data.error) {
        setError(response.data.error);
        setVideoInfo(null);
        return;
      }

      setVideoInfo(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch video information.");
      console.error("Error fetching video info:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!itag) {
      setError("Please select a video quality.");
      return;
    }

    console.log("Selected itag:", itag); // Debugging statement

    setError(null);
    setDownloading(true);
    setProgress(0);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/download`,
        {
          params: {
            url: link,
            format: itag, // Send the selected itag as format
          },
          responseType: "blob",
          timeout: 120000,
          onDownloadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentage);
          },
        }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const linkElement = document.createElement("a");
      linkElement.href = downloadUrl;
      linkElement.setAttribute("download", `${videoInfo.title}.webm`); // Change extension to webm
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Error during download:", err.response || err.message);
      setError("Failed to download video.");
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  if (!link) {
    return <p className="text-white font-semibold text-center pt-[400px] text-2xl">No video URL provided. Please go back and enter a valid URL.</p>;
  }

  if (loading) {
    return <p className="text-white font-semibold text-center pt-[400px] text-2xl font-">Loading...</p>;
  }

  if (error) {
    return <p className="text-white font-semibold text-center pt-[400px] text-2xl">{error}</p>;
  }

  if (!videoInfo) {
    return <p className="text-white font-semibold text-center pt-[400px] text-2xl">Loading video information...</p>;
  }


  function formatDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  return (
    <div className="flex items-center justify-center md:h-screen md:translate-y-[-37px]">
      <div className="md:flex bg-1S md:bg-p3 md:rounded-lg shadow-lg md:overflow-hidden w-full h-3/4 md:w-3/4 pb-10 ">
        <div className="flex-1 p-8 bg-gray-700 pt-[120px] pb-[150px]">
          <img
            src={videoInfo.thumbnail}
            alt="Thumbnail"
            className=" rounded md:w-[600px] md:mb-4  shadow-sm"
            
          />
          <h1 className="text-white md:text-xl font-bold pt-5">{videoInfo.title}</h1>
          <p className="text-white md:mt-2">Duration: {formatDuration(videoInfo.duration)}</p>
        
        </div>

        <div className="flex-1 md:p-8 px-5 py-5 bg-gray-800 md:pt-[130px] mb-4  translate-y-[-100px] md:translate-y-0">
          <h2 className="text-white md:text-lg font-semibold mb-6 text-center">
            Select Quality
          </h2>

          <div className="mb-4 md:pt-10"> 
            <select
              onChange={(e) => {
                console.log("Selected quality:", e.target.value); // Debugging statement
                setItag(e.target.value);
              }}
              value={itag}
              className="w-full p-4 rounded bg-p1 text-white font-bold md-10 md:mb-4"
            >
              <option value="" disabled>
                Select a quality
              </option>
              {videoInfo.formats.map((f) => (
                <option key={f.itag} value={f.itag}>
                  {`${f.resolution} (${f.ext})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleDownload}
              className="bg-p1 p-4 rounded text-white hover:bg-teal-600 mb-[10  0px] md:mb-0"
              disabled={downloading}
            >
              {downloading ? `Downloading... ${progress}%` : "Download"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadPage;