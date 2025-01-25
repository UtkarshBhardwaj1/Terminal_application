package com.terminal.ssh_terminal.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import com.jcraft.jsch.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class SshWebsocketHandler implements WebSocketHandler {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(SshWebsocketHandler.class);

    private final Map<String, Session> sshSessions = new ConcurrentHashMap<>();
    private final Map<String, Boolean> isAuthenticated = new ConcurrentHashMap<>();




    @Override
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {
        String payload = webSocketMessage.getPayload().toString().trim();
        payload = payload.replaceAll("^\"|\"$", "");
        logger.info("WebSocket message received: {}", payload);

        logger.info("Payload starts with: {}", payload.substring(0, Math.min(payload.length(), 12)));

//        for (char c : payload.toCharArray()) {
//            logger.info("Char: {} Code: {}", c, (int) c);
//        }



        try {
            if (payload.startsWith("credentials")) {
                handleCredentials(webSocketSession, payload.substring("credentials:".length()).trim());
            } else {
                Boolean authenticated = isAuthenticated.getOrDefault(webSocketSession.getId(), false);
                if (Boolean.TRUE.equals(authenticated)) {
                    executeCommand(webSocketSession, payload.trim());
                } else {
                    logger.warn("Session {} is not authenticated.", webSocketSession.getId());
                    webSocketSession.sendMessage(new TextMessage("Error: SSH not authenticated. Provide credentials first."));
                }
            }
        } catch (IOException | JSchException e) {
            logger.error("Error handling message for session {}: {}", webSocketSession.getId(), e.getMessage(), e);
            webSocketSession.sendMessage(new TextMessage("Error: " + e.getMessage()));
        }
    }

    private void handleCredentials(WebSocketSession webSocketSession, String credentials) throws IOException {
        logger.info("Processing credentials for session: {}", webSocketSession.getId());

        String[] parts = credentials.split(":");
        System.out.println("-------->"+credentials);
        if (parts.length != 3) {
            logger.warn("Invalid credentials format provided by session: {}", webSocketSession.getId());
            webSocketSession.sendMessage(new TextMessage("Error: Invalid credentials format. Expected format: host:username:password"));
            return;
        }

        String host = parts[0].trim();
        String username = parts[1].trim();
        String password = parts[2].trim();

        try {
            logger.info("Attempting SSH connection for session {}: host={}, username={}", webSocketSession.getId(), host, username);

            JSch jsch = new JSch();
            Session sshSession = jsch.getSession(username, host, 22);
            sshSession.setPassword(password);
            sshSession.setConfig("StrictHostKeyChecking", "no");
            sshSession.connect();

            logger.info("SSH session connected for session ID: {}", webSocketSession.getId());

            sshSessions.put(webSocketSession.getId(), sshSession);
            isAuthenticated.put(webSocketSession.getId(), true); // Mark as authenticated

            webSocketSession.sendMessage(new TextMessage("Info: SSH connection established."));
        } catch (JSchException e) {
            logger.error("SSH connection failed for session {}: {}", webSocketSession.getId(), e.getMessage(), e);
            webSocketSession.sendMessage(new TextMessage("Error: Failed to connect to SSH. Invalid credentials."));
        }
    }

    private void executeCommand(WebSocketSession webSocketSession, String command) throws Exception {
        if (command == null || command.trim().isEmpty()) {
            webSocketSession.sendMessage(new TextMessage("Error: Command cannot be empty."));
            return;
        }

        Session sshSession = sshSessions.get(webSocketSession.getId());
        if (sshSession == null || !sshSession.isConnected()) {
            webSocketSession.sendMessage(new TextMessage("Error: SSH session not connected."));
            return;
        }

        ChannelExec channel = null;
        try {
            channel = (ChannelExec) sshSession.openChannel("exec");
            channel.setCommand(command);

            InputStream inputStream = channel.getInputStream();
            InputStream errorStream = channel.getErrStream();

            channel.connect();

            // Reading command output
            StringBuilder output = new StringBuilder();
            byte[] buffer = new byte[1024];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                output.append(new String(buffer, 0, bytesRead, StandardCharsets.UTF_8));
            }

            // Reading error stream (if any)
            StringBuilder errorOutput = new StringBuilder();
            while ((bytesRead = errorStream.read(buffer)) != -1) {
                errorOutput.append(new String(buffer, 0, bytesRead, StandardCharsets.UTF_8));
            }

            // Send output back to the client
            if (output.length() > 0) {
                String commandOutput = output.toString().trim();
                webSocketSession.sendMessage(new TextMessage("Command output: " + output.toString().trim()));

            }

            if (errorOutput.length() > 0) {
                webSocketSession.sendMessage(new TextMessage("Command error: " + errorOutput.toString().replace("\n", "\\n")));
            }

        } catch (Exception e) {
            logger.error("Command execution failed for session {}: {}", webSocketSession.getId(), e.getMessage(), e);
            webSocketSession.sendMessage(new TextMessage("Error: Command execution failed: " + e.getMessage()));
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Session sshSession = sshSessions.remove(session.getId());
        isAuthenticated.remove(session.getId());
        if (sshSession != null) {
            sshSession.disconnect();
        }
        logger.info("WebSocket and SSH session closed for: {}", session.getId());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        logger.info("WebSocket connection established: {}", session.getId());
        isAuthenticated.put(session.getId(), false); // Default to unauthenticated
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        logger.error("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage(), exception);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}



