import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private socket$: WebSocketSubject<string> | null = null;
    private messageSubscription: Subscription | null = null;
    private isConnectionInitialized = false; // Prevent duplicate initialization
    private messageSubject = new Subject<string>();
    isConnected = false; // Tracks SSH connection status
    validCommandOutput = ''; // Stores the last valid command output

    constructor() { }

    /**
     * Initializes the WebSocket connection with provided credentials.
     */
    initializeConnection(credentials?: {
        host: string;
        username: string;
        password: string;
    }) {
        console.log('Initializing WebSocket connection...');
        if (!credentials || !credentials.host || !credentials.username || !credentials.password) {
            console.error('WebSocket connection cannot be initialized without valid credentials.');
            return;
        }

        // Prevent initializing multiple connections
        if (this.isConnected) {
            console.warn('WebSocket is already connected. Avoiding duplicate connections.');
            return;
        }

        console.log('Initializing WebSocket connection with credentials:', credentials);

        this.socket$ = new WebSocketSubject({
            url: 'ws://localhost:8080/ssh',
            deserializer: (event) => event.data, // Deserialize the raw string
        });

        this.socket$.subscribe({
            next: (message) => {
                console.log('Message received:', message);
                this.messageSubject.next(message); // Emit received message
            },
            error: (err) => {
                console.error('WebSocket error:', err);
                this.isConnected = false;
            },
            complete: () => {
                console.log('WebSocket connection closed.');
                this.isConnected = false;
            },
        });

        // Wait until WebSocket connection is open before sending credentials
        this.socket$.next(`credentials:${credentials.host}:${credentials.username}:${credentials.password}`);
        this.isConnected = true; // Mark connection as active
    }
    
    /**
   * Sends a message through the WebSocket connection.
   */
    sendMessage(message: string) {
        console.log('Sending message:', message);
        if (this.socket$ && this.isConnected) {
            this.socket$.next(message);
        } else {
            console.error(
                'WebSocket connection is not active. Please initialize the connection first.'
            );
        }
    }


    /**
     * Registers a callback to handle incoming WebSocket messages.
     */
    onMessage(callback: (message: string) => void) {
        console.log('Registering WebSocket message callback...');
        return this.messageSubject.asObservable().subscribe(callback);
    }


    /**
     * Closes the WebSocket connection and cleans up resources.
     */
    closeConnection() {
        if (this.socket$) {
            this.socket$.complete();
            this.cleanupConnection();
        }
    }

    /**
     * Cleans up WebSocket connection and resets state.
     */
    private cleanupConnection() {
        this.socket$ = null;
        this.messageSubscription?.unsubscribe();
        this.messageSubscription = null;
        this.isConnectionInitialized = false;
        this.isConnected = false;
    }
}
