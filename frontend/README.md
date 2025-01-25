# Web-Based SSH Terminal - Frontend  

This is the **frontend** part of the Web-Based SSH Terminal project, built using **Angular** and **xterm.js**. It provides an interactive terminal interface for executing commands on a remote server via SSH.  

## 🚀 Features  
- **Interactive Terminal**: A dynamic terminal UI built with `xterm.js`.  
- **Real-Time Communication**: Communicates with the backend using WebSockets.  
- **Custom Themes**: Styled to replicate a classic terminal interface.  
- **Command Output Display**: Outputs results of commands in real-time.  
- **Responsive Design**: Adjusts terminal size dynamically based on the window size.  

## 🛠️ Technologies  
- **Angular**: Framework for building the frontend.  
- **xterm.js**: Library for terminal emulation.  
- **WebSockets**: For real-time data transfer between frontend and backend.  

## 🏗️ Setup Instructions  

### Prerequisites  
- Node.js (v16 or later)  
- Angular CLI  

### Steps  
1. Clone the repository:  
   ```bash
   git clone <frontend-repo-link>
   cd frontend
   
2. Install dependencies:
  ```bash
  npm install

3. Start the development server:
  ```bash
  ng serve

#### The application will be accessible at http://localhost:4200.

##📁 Project Structure
- src/app/components: Contains UI components like terminal and input prompts.
- src/app/services: WebSocket service for real-time communication.
- src/assets: Static assets like styles and images.

## 🌟 Key Learnings
- Integrating xterm.js with Angular for a smooth terminal experience.
- Efficient handling of WebSocket events for real-time updates.
- Responsive design principles for terminal resizing.
