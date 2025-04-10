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

  const [shortcuts, setShortcuts] = useState([
    { title: "Chat GPT", url: "https://chat.openai.com/", icon: "C" },
    { title: "Claude", url: "https://claude.ai/", icon: "C" },
    { title: "Grok", url: "https://x.com/i/grok", icon: "G" },
    { title: "V0", url: "https://v0.dev/", icon: "V" },
    { title: "LinkedIn", url: "https://www.linkedin.com", icon: "L" },
    { title: "Jira", url: "https://www.atlassian.com/software/jira", icon: "J" },
    { title: "Github", url: "https://www.github.com", icon: "G" },
    { title: "Medium", url: "https://medium.com/", icon: "M" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ title: "", url: "", icon: "" });

  const openModal = (index = null) => {
    setEditIndex(index);
    if (index !== null) {
      setForm(shortcuts[index]);
    } else {
      setForm({ title: "", url: "", icon: "" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.url) return;
    const updated = [...shortcuts];
    if (editIndex !== null) {
      updated[editIndex] = form;
    } else {
      updated.push(form);
    }
    setShortcuts(updated.slice(0, 16)); // limit to 4x4
    setShowModal(false);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const updated = [...shortcuts];
    updated.splice(index, 1);
    setShortcuts(updated);
  };

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
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (searchInputRef.current) searchInputRef.current.value = transcript;
    };
    recognition.onerror = (event) => console.error("Speech error:", event.error);
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
    if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  };

  const renderSearchBar = (placeholder) => (
    <div className="search-container" style={{ width: "60%", marginBottom: "40px", position: "relative" }}>
      <div onClick={handleSearchClick} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#888", cursor: "pointer" }}>
        <FaSearch />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        className="search-box"
        placeholder={placeholder}
        style={{ paddingLeft: "36px", paddingRight: "80px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearchClick();
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

  const ShortcutGrid = () => (
    <div className="favicon-grid" style={{ width: "60%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", justifyItems: "center" }}>
      {shortcuts.map((item, index) => (
        <div
          key={index}
          className="favicon-item medium-size"
          style={{ position: "relative" }}
          onMouseEnter={() => setEditIndex(index)}
          onMouseLeave={() => setEditIndex(null)}
        >
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <div className="favicon-icon">{item.icon}</div>
            <div className="favicon-title">{item.title}</div>
          </a>
          {editIndex === index && (
            <div className="hover-options" style={{ position: "absolute", top: "4px", right: "4px", background: "white", borderRadius: "6px", padding: "2px 4px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
              <button onClick={() => openModal(index)} style={{ fontSize: "12px", marginRight: "6px" }}>Edit</button>
              <button onClick={() => handleDelete(index)} style={{ fontSize: "12px" }}>Remove</button>
            </div>
          )}
        </div>
      ))}
      {shortcuts.length < 16 && (
        <div className="favicon-item medium-size add-new" onClick={() => openModal(null)} style={{ cursor: "pointer", textAlign: "center", backgroundColor: "#eee", borderRadius: "12px" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>+</div>
          <div>Add Shortcut</div>
        </div>
      )}
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
        <div className="first-page" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15vh", textAlign: "center" }}>
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
         <img src={googleLogo} alt="Google" style={{ width: "272px", height: "auto" }} />
        </div>

          {renderSearchBar("Search...")}
          {ShortcutGrid()}
        </div>
      )}
      {isL3Page && (
        <div className="center-content">
          <div style={{ marginLeft: "18%" }}>{renderSearchBar("Search the L3 Squad page...")}</div>
          <div style={{ paddingLeft: "17%", paddingRight: "17%", marginTop: "40px" }}>
            {ShortcutGrid()}
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
      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
          <div className="modal" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "300px" }}>
            <h3>{editIndex !== null ? "Edit Shortcut" : "Add Shortcut"}</h3>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              placeholder="URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              placeholder="Icon (e.g. G, C)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <button onClick={handleSave} style={{ marginRight: "10px" }}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tabs;
