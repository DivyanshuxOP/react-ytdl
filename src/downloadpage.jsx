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
    return <p>No video URL provided. Please go back and enter a valid URL.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!videoInfo) {
    return <p>Loading video information...</p>;
  }


  function formatDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex bg-p3 rounded-lg shadow-lg overflow-hidden w-3/4 h-3/4 mb-10">
        <div className="flex-1 p-8 bg-gray-700 pt-[170px]">
          <img
            src={videoInfo.thumbnail}
            alt="Thumbnail"
            className="w-full rounded mb-4"
          />
          <h1 className="text-white text-xl font-bold">{videoInfo.title}</h1>
          <p className="text-white mt-2">Duration: {formatDuration(videoInfo.duration)}</p>
        </div>

        <div className="flex-1 p-8 bg-gray-800 pt-[130px]">
          <h2 className="text-white text-lg font-semibold mb-6 text-center">
            Select Quality
          </h2>

          <div className="mb-4 pt-10">
            <select
              onChange={(e) => {
                console.log("Selected quality:", e.target.value); // Debugging statement
                setItag(e.target.value);
              }}
              value={itag}
              className="w-full p-4 rounded bg-p1 text-white font-bold mb-4"
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
              className="bg-teal-500 p-4 rounded text-white hover:bg-teal-600"
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