import React, { useState } from "react";

const adLinks = [
  "https://www.youtube.com/embed/gQ1b0uaFRjM?autoplay=1&mute=1&loop=1&playlist=gQ1b0uaFRjM",
  "https://www.youtube.com/embed/YGuDwH1dWDE?autoplay=1&mute=1&loop=1&playlist=YGuDwH1dWDE",
  // Add more ad links here if needed
];

const VideoAd = () => {
  const [adIndex, setAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(true);

  const handleClose = () => {
    if (adIndex < adLinks.length - 1) {
      setAdIndex(adIndex + 1);
    } else {
      setShowAd(false);
    }
  };

  if (!showAd) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "20px auto",
        textAlign: "center",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: "0", fontSize: "18px" }}>Sponsored Ad</h3>
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          ✕
        </button>
      </div>

      <iframe
        width="100%"
        height="400"
        src={adLinks[adIndex]}
        title={`Ad Video ${adIndex + 1}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ borderRadius: "8px", marginTop: "10px" }}
      ></iframe>
    </div>
  );
};

export default VideoAd;
