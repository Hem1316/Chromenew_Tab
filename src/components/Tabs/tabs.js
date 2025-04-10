import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaMicrophone, FaCamera } from "react-icons/fa";
import "./tabs.css";
import logoImage from "./L3SQUAD_Dark.png";
import googleLogo from "./googlelogo.png"; 
const Tabs = () => {
  const [isL3Page, setIsL3Page] = useState(false);
  const [showTimeZones, setShowTimeZones] = useState(false);
  const [timeData, setTimeData] = useState({});
  const [indiaTime, setIndiaTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const searchInputRef = useRef(null);

  const timeZones = [
    { timezone: "Asia/Kolkata", flag: "in", country: "India" },
    { timezone: "Asia/Singapore", flag: "sg", country: "Singapore" },
    { timezone: "Europe/Brussels", flag: "be", country: "Belgium" },
    { timezone: "Europe/London", flag: "gb", country: "UK" },
    { timezone: "America/New_York", flag: "us", country: "New York" },
  ];

  useEffect(() => {
    const updateTime = () => {
      const newTimeData = {};
      timeZones.forEach(({ timezone }) => {
        newTimeData[timezone] = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
      });
      setTimeData(newTimeData);

      const indiaTimeString = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
      setIndiaTime(indiaTimeString);

      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting("Good Morning");
      } else if (currentHour < 16) {
        setGreeting("Good Noon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (searchInputRef.current) {
        searchInputRef.current.value = transcript;
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const handleImageSearch = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
  };

  const handleSearchClick = () => {
    const query = searchInputRef.current?.value.trim();
    if (query) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    }
  };

  const renderSearchBarFirstPage = () => (
    <div className="search-container" style={{ width: "60%", marginBottom: "40px", position: "relative" }}>
      <div onClick={handleSearchClick} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#888", cursor: "pointer" }}>
        <FaSearch />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        className="search-box"
        placeholder="Search..."
        style={{ paddingLeft: "36px", paddingRight: "80px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const query = e.target.value.trim();
            if (query) {
              window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
            }
          }
        }}
      />
      <div style={{ position: "absolute", left: "100%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
        <FaMicrophone onClick={handleVoiceSearch} title="Voice Search" style={{ color: "#4285f4" }} />
      </div>
      <div style={{ position: "absolute", left: "105%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
        <FaCamera onClick={handleImageSearch} title="Search by Image" style={{ color: "#34a853" }} />
      </div>
    </div>
  );

  const renderSearchBarL3Page = () => (
    <div className="search-container" style={{ width: "70%", marginBottom: "40px", position: "relative" }}>
      <div onClick={handleSearchClick} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#555", cursor: "pointer" }}>
        <FaSearch />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        className="search-box"
        placeholder="Search the L3 Squad page..."
        style={{ paddingLeft: "36px", paddingRight: "80px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const query = e.target.value.trim();
            if (query) {
              window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
            }
          }
        }}
      />
      <div style={{ position: "absolute", left: "100%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
        <FaMicrophone onClick={handleVoiceSearch} title="VoiceSearch" style={{ color: "#4285f4" }} />
      </div>
      <div style={{ position: "absolute", left: "105%", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
        <FaCamera onClick={handleImageSearch} title="Search Image" style={{ color: "#34a853" }} />
      </div>
    </div>
  );

  return (
    <div className="container">
      {isL3Page && (
        <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#fff", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 1000 }}>
          <img src="https://flagcdn.com/w40/in.png" alt="India" style={{ width: "24px", marginRight: "8px", borderRadius: "4px" }} />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>India: {indiaTime}</span>
        </div>
      )}

      {isL3Page && (
        <div className="logo-container" style={{ textAlign: "center", marginTop: "20px" }}>
          <img src={logoImage} alt="L3Squad Logo" className="logo" style={{ width: "150px", marginBottom: "10px" }} />
          <h1 className="user-name">Hi Hemachandiran, {greeting}!</h1>
        </div>
      )}

      <div className="toggle-container">
        <span className="toggle-label">Switch to L3 Page</span>
        <label className="switch">
          <input type="checkbox" onChange={() => setIsL3Page(prev => !prev)} />
          <span className="slider"></span>
        </label>
      </div>

      {!isL3Page && (
        <div className="first-page" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "25vh", textAlign: "center" }}>
          <div style={{ paddingBottom: "50px" }}>
       <img src={googleLogo} alt="Google" style={{ width: "250px" }} />
     </div>

          {renderSearchBarFirstPage()}
          <div className="favicon-grid" style={{ width: "60%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", justifyItems: "center" }}>
            {[{ title: "Chat GPT", url: "https://chat.openai.com/", icon: "C" },
              { title: "Claude", url: "https://claude.ai/", icon: "C" },
              { title: "Grok", url: "https://x.com/i/grok", icon: "G" },
              { title: "V0", url: "https://v0.dev/", icon: "V" },
              { title: "LinkedIn", url: "https://www.linkedin.com", icon: "L" },
              { title: "Jira", url: "https://www.atlassian.com/software/jira", icon: "J" },
              { title: "Github", url: "https://www.github.com", icon: "G" },
              { title: "Medium", url: "https://medium.com/", icon: "M" }
            ].map((item, index) => (
              <a key={index} href={item.url} className="favicon-item medium-size" target="_blank" rel="noopener noreferrer">
                <div className="favicon-icon">{item.icon}</div>
                <div className="favicon-title">{item.title}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {isL3Page && (
        <div className="center-content">
          <div style={{ marginLeft: "18%" }}>{renderSearchBarL3Page()}</div>
          <div className="favicon-grid" style={{ paddingLeft: "17%", paddingRight: "17%", textAlign: "center", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", justifyItems: "center", marginTop: "40px" }}>
            {[{ title: "Trello", url: "https://trello.com/", icon: "T" },
              { title: "Slack", url: "https://slack.com/", icon: "S" },
              { title: "Google Drive", url: "https://drive.google.com/", icon: "G" },
              { title: "Zoom", url: "https://www.zoom.com/", icon: "Z" },
              { title: "Asana", url: "https://asana.com/", icon: "A" },
              { title: "Notion", url: "https://www.notion.com/", icon: "N" },
              { title: "Dropbox", url: "https://www.dropbox.com", icon: "D" },
              { title: "Figma", url: "https://www.figma.com/", icon: "F" }
            ].map((item, index) => (
              <a key={index} href={item.url} className="favicon-item medium-size" target="_blank" rel="noopener noreferrer">
                <div className="favicon-icon">{item.icon}</div>
                <div className="favicon-title">{item.title}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {isL3Page && (
        <div style={{ position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)", zIndex: 1000, textAlign: "center" }}>
          <button onClick={() => setShowTimeZones(prev => !prev)} style={{ padding: "10px 16px", backgroundColor: "#2d2dff", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginBottom: "24px" }}>
            {showTimeZones ? "Hide Time Zones" : "Show Time Zones"}
          </button>
          {showTimeZones && (
            <div style={{ marginTop: "5%" }}>
              {timeZones.map((item, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", backgroundColor: "#fff", padding: "8px 12px", borderRadius: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <img src={`https://flagcdn.com/w40/${item.flag}.png`} alt={item.country} style={{ width: "24px", borderRadius: "4px" }} />
                  <span>{item.country}:</span>
                  <strong>{timeData[item.timezone] || "Loading..."}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tabs;
