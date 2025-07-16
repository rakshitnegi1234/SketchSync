# ✏️ SketchSync

A real-time collaborative whiteboard and chat application built with **React**, **Node.js**, **Express**, **Socket.IO**, and **HTML Canvas**.

> 🎯 Perfect for remote teams, classrooms, and collaborative brainstorming!

---

## 🚀 Features

1. **🧠 Real-time Drawing:**  
   Create or join rooms and draw collaboratively with pencil, line, or rectangle tools. Every stroke is instantly synced using Socket.IO.

2. **🔐 Role-Based Drawing Access:**  
   Only the **presenter (host)** can draw. Other users can view synchronized whiteboard updates in real time.

3. **📋 Tools & Utilities:**  
   - Pencil, Line, Rectangle drawing  
   - **Undo** last action  
   - **Clear** entire canvas  
   - Color Picker for drawing  
   - Image-based syncing for smooth rendering  

4. **👥 User Management:**  
   - View total users in the room  
   - Get alerts when users **join** or **leave**  
   - Host label: `(You)` shows on active user list  

5. **💬 Live Chat:**  
   - Real-time messaging using Socket.IO  
   - Clean, Bootstrap-styled chat UI  
   - Auto-scroll and instant updates  

6. **🌐 Scalable Architecture:**  
   - Handles 10–20 concurrent users per room comfortably  
   - Backend architecture supports scaling with **Socket clustering**, **Redis**, and **message compression** (future-proof)

---

## 📸 Demo

> [🖼 Live Demo](https://sketchsync-3000.onrender.com/)  
> 🔗 Backend hosted at: `https://sketchsync-1.onrender.com`

---

## 🛠 Tech Stack

| Frontend      | Backend         | Realtime Engine | Styling    |
|---------------|------------------|------------------|------------|
| React (Vite)  | Node.js + Express | Socket.IO        | Bootstrap 5 |
| HTML Canvas   | CORS Configured   | WebSocket Transport




ketchSync/
├── Frontend/
│ ├── src/
│ │ ├── Component/
│ │ │ ├── WhiteBoard.jsx
│ │ │ ├── ChatBar.jsx
│ │ │ └── Forms/
│ │ ├── pages/
│ │ │ └── RoomPage.jsx
│ │ └── App.jsx
│ └── index.html
├── Backend/
│ ├── server.js
│ └── utils/
│ └── user.js
└── README.md

yaml
Copy
Edit

