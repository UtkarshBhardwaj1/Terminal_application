

### README for Backend:  

# Web-Based SSH Terminal - Backend  

This is the **backend** part of the Web-Based SSH Terminal project, built using **Spring Boot** and **JSch**. It manages SSH connections, executes commands on remote servers, and streams the output to the frontend in real-time.  

## 🚀 Features  
- **SSH Authentication**: Connect securely using username, password, and host.  
- **Command Execution**: Supports shell commands like `ls`, `mkdir`, `cat`, etc.  
- **Real-Time Updates**: Uses WebSockets to send command output to the client.  
- **Error Handling**: Handles invalid credentials, unsupported commands, and session timeouts.  

## 🛠️ Technologies  
- **Spring Boot**: Backend framework for handling REST and WebSocket communication.  
- **JSch**: Java library for establishing SSH connections.  
- **WebSockets**: Enables real-time communication between client and server.  

## 🏗️ Setup Instructions  

### Prerequisites  
- Java 11 or later  
- Maven  

### Steps  
1. Clone the repository:  
   ```bash
   git clone <backend-repo-link>
   cd backend

2. Build the project:

```bash
  mvn clean install

3. Run the application:

```bash
  java -jar target/ssh-terminal-backend.jar


The backend will start on http://localhost:8080.
```

## 📁 Project Structure
- src/main/java: Contains application logic and WebSocket handlers.

- src/main/resources: Configuration files (e.g., application.properties).

- logs/: Log files for debugging and monitoring.

## 🌟 Key Learnings

- Establishing secure SSH connections using JSch.

- Real-time data transfer via WebSockets.

- Managing concurrent SSH sessions for multiple clients.
