# React YouTube Downloader

A **React-based YouTube Downloader** application powered by a Python backend. This project enables users to download YouTube videos seamlessly. You can utilize cookies for personalized downloads by adding them in the `cookies.txt` file.

---

## 🚀 Features
- **Download Videos:** Fetch and download YouTube videos directly.
- **React Frontend:** An intuitive and responsive user interface built with React.
- **Python Backend:** A robust backend handling video processing and requests.
- **Cookie Support:** Use `cookies.txt` for personalized downloads (e.g., restricted content).

---

## 📂 Project Structure
```
react-ytdl/
│
├── front/               # React frontend
│   ├── public/          # Static files
│   ├── src/             # React components
│   └── package.json     # Frontend dependencies
│
├── back/                # Python backend
│   ├── app.py           # Main backend application
│   └── cookies.txt      # Optional: Paste cookies here for personalized downloads
│
└── README.md            # Project documentation
```

---

## 🛠️ Prerequisites
Make sure you have the following installed on your system:
- **Node.js**: v14+ for the frontend.
- **Python**: v3.8+ for the backend.
- **Pip**: Python package manager for dependencies.

---

## 📦 Installation

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/DivyanshuxOP/react-ytdl.git
   cd react-ytdl
   ```

2. **Install Frontend Dependencies**  
   ```bash
   cd front
   npm install
   ```

3. **Install Backend Dependencies**  
   ```bash
   cd ../back
   pip install -r requirements.txt
   ```

---

## 🚀 Usage

1.**Start the Backend**  
   Open another terminal and run:  
   ```bash
   cd back
   python app.py
   ```

3. **Use Cookies (Optional)**  
   To use cookies, create a `cookies.txt` file in the `back/` directory and paste your cookies there.

4. **Access the Application**  
   Open your browser and go to: [http://localhost:5173]

---

## 🛡️ License
This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/DivyanshuxOP/react-ytdl/issues).

---

## ✨ Additional Information
- **Customization:**  
  You can modify the frontend and backend code to fit your requirements.  
- **Error Handling:**  
  Ensure your cookies are correctly formatted in `cookies.txt` if you encounter issues with restricted downloads.

---

## 🙌 Support
If you like this project, please consider giving it a ⭐ on [GitHub](https://github.com/DivyanshuxOP/react-ytdl/).

