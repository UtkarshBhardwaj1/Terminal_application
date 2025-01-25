//WORKING till 25-01-25 11:06AM
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Terminal } from 'xterm';
// import { WebSocketService } from '../services/WebsocketService.service';

// @Component({
//   selector: 'app-terminal',
//   templateUrl: './terminal.component.html',
//   styleUrls: ['./terminal.component.css'],
// })

// export class TerminalComponent implements OnInit, OnDestroy {
//   terminal!: Terminal;
//   private currentUser = ''; // Empty until connected
//   private currentDirectory = ''; // Empty until connected
//   private inputBuffer = ''; // Collects user input
//   private credentials = { host: '', username: '', password: '' };
//   private stage: 'host' | 'username' | 'password' | 'command' = 'host';

//   constructor(private webSocketService: WebSocketService) {}

//   ngOnInit() {
//     // this.webSocketService.initializeConnection();
//     this.initializeTerminal();
//     // Ensure WebSocket connection is initialized
//   if (!this.webSocketService.isConnected) {
//     this.webSocketService.initializeConnection();
//   }
//     this.subscribeToWebSocketMessages();

//     // Initial prompt
//     this.promptInline('Enter Host: ');

//     // Handle terminal input
//     this.terminal.onData((data) => this.handleTerminalInput(data));
//   }

//   // private initializeTerminal() {
//   //   const terminalContainer = document.getElementById('terminal-container');

//   //   if (!terminalContainer) {
//   //     console.error('Terminal container not found');
//   //     return;
//   //   }

//   //   this.terminal = new Terminal({
//   //     cursorBlink: true,
//   //     theme: {
//   //       background: '#000000',
//   //       foreground: '#FFFFFF',
//   //     },
//   //   });

//   //   this.terminal.open(terminalContainer);
//   //   this.adjustTerminalDimensions();

//   //   // Handle terminal resizing
//   //   window.addEventListener('resize', () => this.adjustTerminalDimensions());
//   // }


//   private initializeTerminal() {
//     const terminalContainer = document.getElementById('terminal-container');

//     if (!terminalContainer) {
//       console.error('Terminal container not found');
//       return;
//     }

//     this.terminal = new Terminal({
//       cursorBlink: true,
//       fontFamily: '"Fira Code", monospace',
//       fontSize: 14,
//       theme: {
//         background: '#1e1e1e', // Dark gray background
//         foreground: '#d4d4d4', // Light gray text
//         cursor: '#00ff00', // Green cursor
//       },
//       // rendererType: 'canvas', // Improves performance
//       scrollback: 1000, // Allows scrolling through 1000 lines
//       tabStopWidth: 8,
//     });

//     this.terminal.open(terminalContainer);
//     this.adjustTerminalDimensions();

//     // Add title to the terminal
//     const titleElement = document.createElement('div');
//     titleElement.innerHTML = 'Terminal';
//     titleElement.style.color = '#ffffff';
//     titleElement.style.background = '#333';
//     titleElement.style.padding = '8px 12px';
//     titleElement.style.fontFamily = '"Fira Code", monospace';
//     titleElement.style.fontSize = '16px';
//     titleElement.style.borderBottom = '2px solid #333';
//     terminalContainer.insertBefore(titleElement, terminalContainer.firstChild);

//     // Handle terminal resizing
//     window.addEventListener('resize', () => this.adjustTerminalDimensions());
//   }



//   private adjustTerminalDimensions() {
//     const terminalContainer = document.getElementById('terminal-container');
//     if (terminalContainer) {
//       const charWidth = 10; // Approximate character width
//       const charHeight = 18; // Approximate character height
//       const cols = Math.floor(terminalContainer.offsetWidth / charWidth);
//       const rows = Math.floor(terminalContainer.offsetHeight / charHeight);

//       this.terminal.resize(cols, rows);
//     }
//   }

//   private handleTerminalInput(data: string) {
//     if (data === '\r') {
//       // Process input when Enter is pressed
//       this.processInput();
//     } else if (data === '\u007f') {
//       // Handle backspace
//       if (this.inputBuffer.length > 0) {
//         this.inputBuffer = this.inputBuffer.slice(0, -1);
//         this.terminal.write('\b \b');
//       }
//     } else {
//       // Collect input and echo it
//       this.inputBuffer += data;
//       this.terminal.write(data);
//     }
//   }

//   // private processInput() {
//   //   const input = this.inputBuffer.trim();
//   //   this.inputBuffer = ''; // Clear the buffer

//   //   if (this.stage === 'host') {
//   //     if (!input) {
//   //       this.terminal.write('\x1b[31mHost cannot be empty. Please enter a valid host.\x1b[0m');
//   //       this.promptInline('Enter Host: ');
//   //     } else {
//   //       this.credentials.host = input;
//   //       this.stage = 'username';
//   //       this.promptInline('Enter Username: ');
//   //     }
//   //   } else if (this.stage === 'username') {
//   //     if (!input) {
//   //       this.terminal.write('\x1b[31mUsername cannot be empty. Please enter a valid username.\x1b[0m');
//   //       this.promptInline('Enter Username: ');
//   //     } else {
//   //       this.credentials.username = input;
//   //       this.stage = 'password';
//   //       this.promptInline('Enter Password: ');
//   //     }
//   //   } else if (this.stage === 'password') {
//   //     if (!input) {
//   //       this.terminal.write('\x1b[31mPassword cannot be empty. Please enter a valid password.\x1b[0m');
//   //       this.promptInline('Enter Password: ');
//   //     } else {
//   //       this.credentials.password = input;
//   //       this.stage = 'command';

//   //       // Send credentials to the server
//   //       this.webSocketService.sendMessage(
//   //         `credentials:${this.credentials.host}:${this.credentials.username}:${this.credentials.password}`
//   //       );

//   //       // Listen for connection success or failure
//   //       this.webSocketService.onMessage((message) => {
//   //         if (message.includes('Info: SSH connection established.')) {
//   //           this.currentUser = this.credentials.username;
//   //           this.currentDirectory = '~';
//   //           this.prompt();
//   //         } else if (message.includes('Error: Failed to connect to SSH')) {
//   //           this.terminal.write('\r\n\x1b[31mFailed to establish SSH session. Check credentials.\x1b[0m\r\n');
//   //           this.stage = 'host';
//   //           this.promptInline('Enter Host: ');
//   //         }
//   //       });
//   //     }
//   //   } else if (this.stage === 'command') {
//   //     if (input) {
//   //       this.terminal.write(`\r\n`);
//   //       this.webSocketService.sendMessage(input);
//   //     }
//   //     this.prompt();
//   //   }
//   // }


//   private processInput() {
//     const input = this.inputBuffer.trim();
//     this.inputBuffer = ''; // Clear the buffer

//     if (this.stage === 'host') {
//       if (!input) {
//         this.terminal.write('\x1b[31mHost cannot be empty. Please enter a valid host.\x1b[0m');
//         this.promptInline('Enter Host: ');
//       } else {
//         this.credentials.host = input;
//         this.stage = 'username';
//         this.promptInline('\r\nEnter Username: ');
//       }
//     } else if (this.stage === 'username') {
//       if (!input) {
//         this.terminal.write('\x1b[31mUsername cannot be empty. Please enter a valid username.\x1b[0m');
//         this.promptInline('\r\nEnter Username: ');
//       } else {
//         this.credentials.username = input;
//         this.stage = 'password';
//         this.promptInline('\r\nEnter Password: ');
//       }
//     } else if (this.stage === 'password') {
//       if (!input) {
//         this.terminal.write('\x1b[31mPassword cannot be empty. Please enter a valid password.\x1b[0m');
//         this.promptInline('\r\nEnter Password: ');
//       } else {
//         this.credentials.password = input;
//         this.stage = 'command';

//         // Ensure WebSocket connection is initialized only after credentials are provided
//         if (!this.webSocketService.isConnected) {
//           this.webSocketService.initializeConnection(this.credentials);
//         }

//         // Send credentials to the server
//         // this.webSocketService.sendMessage(
//         //   `credentials:${this.credentials.host}:${this.credentials.username}:${this.credentials.password}`
//         // );

//         // Listen for connection success or failure
//         this.webSocketService.onMessage((message) => {
//           if (message.includes('Info: SSH connection established.')) {
//             this.currentUser = this.credentials.username;
//             this.currentDirectory = '~';
//             this.prompt(); // Show prompt with user and directory
//           } else if (message.includes('Error: Failed to connect to SSH')) {
//             this.terminal.write('\r\n\x1b[31mFailed to establish SSH session. Check credentials.\x1b[0m\r\n');
//             this.stage = 'host';
//             this.promptInline('\r\nEnter Host: ');
//           }
//         });
//       }
//     } else if (this.stage === 'command') {
//       console.log('input', input);
//       if (input) {
//         this.terminal.write(`\r\n`);
//         this.webSocketService.sendMessage(input);
//       }
//       this.prompt();
//       this.subscribeToWebSocketMessages();
//     }
//   }

//    writeToTerminal(output: string) {
//     if (!this.terminal) {
//       console.error('Terminal is not initialized.');
//       return;
//     }
//   console.log('output', output);
//     // Clean up the output (e.g., normalize newlines)
//     const formattedOutput = output.replace(/\r?\n/g, '\r\n');

//     // Write the formatted output to the terminal
//     this.terminal.write(`\r\n${formattedOutput}\r\n`);
//   }

//   private subscribeToWebSocketMessages() {
//     // console.log('Subscribing to WebSocket messages');
//     this.webSocketService.onMessage((message: string) => {
//       // console.log('Received WebSocket message:', message);
//       const cleanedMessage = message.replace(/\r?\n/g, '\r\n');
//     // Extract data after the colon
//     const colonIndex = message.indexOf(':');
//     let data = colonIndex !== -1 ? message.substring(colonIndex + 1).trim() : message;
// data = data.replace(/\r?\n/g, '\r\n');
//     if (this.terminal) {
//       this.terminal.write(`\r\n${data}`);
//       this.prompt();
//     } else {
//       console.error('Terminal is not initialized.');
//     }
//     // if (this.terminal) {
//     //   this.terminal.write(`\r\n${cleanedMessage}`);
//     // } else {
//     //     console.error('Terminal is not initialized.');
//     //   }
//     });
//   }


//   private promptInline(message: string = '') {
//     this.terminal.write(message);  }

//   private prompt(message: string = '') {
//     if (message) {
//       this.terminal.write(message);
//     }
//     if (this.currentUser && this.currentDirectory) {
//       this.terminal.write(`\r\n${this.currentUser}@${this.currentDirectory}$ `);
//     } else {
//       this.terminal.write('\r\n$ ');
//     }
//   }

//   ngOnDestroy() {
//     this.webSocketService.closeConnection();
//   }
// }









import { Component, OnInit, OnDestroy } from '@angular/core';
import { Terminal } from 'xterm';
import { WebSocketService } from '../services/WebsocketService.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})

export class TerminalComponent implements OnInit, OnDestroy {
  terminal!: Terminal;
  private currentUser = ''; // Empty until connected
  private currentDirectory = ''; // Empty until connected
  private inputBuffer = ''; // Collects user input
  private credentials = { host: '', username: '', password: '' };
  private stage: 'host' | 'username' | 'password' | 'command' = 'host';

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    // this.webSocketService.initializeConnection();
    this.initializeTerminal();
    // Ensure WebSocket connection is initialized
    if (!this.webSocketService.isConnected) {
      this.webSocketService.initializeConnection();
    }
    this.subscribeToWebSocketMessages();

    // Initial prompt
    this.promptInline('Enter Host: ');

    // Handle terminal input
    this.terminal.onData((data) => this.handleTerminalInput(data));
  }

  private initializeTerminal() {
    const terminalContainer = document.getElementById('terminal-container');

    if (!terminalContainer) {
      console.error('Terminal container not found');
      return;
    }

    this.terminal = new Terminal({
      cursorBlink: true,
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: '#1e1e1e', // Dark gray background
        foreground: '#d4d4d4', // Light gray text
        cursor: '#00ff00', // Green cursor
      },
      // rendererType: 'canvas', // Improves performance
      scrollback: 1000, // Allows scrolling through 1000 lines
      tabStopWidth: 8,
    });

    this.terminal.open(terminalContainer);
    this.adjustTerminalDimensions();

    // Add title to the terminal
    const titleElement = document.createElement('div');
    titleElement.innerHTML = 'Terminal';
    titleElement.style.color = '#ffffff';
    titleElement.style.background = '#333';
    titleElement.style.padding = '8px 12px';
    titleElement.style.fontFamily = '"Fira Code", monospace';
    titleElement.style.fontSize = '16px';
    titleElement.style.borderBottom = '2px solid #333';
    terminalContainer.insertBefore(titleElement, terminalContainer.firstChild);

    // Handle terminal resizing
    window.addEventListener('resize', () => this.adjustTerminalDimensions());
  }

  private adjustTerminalDimensions() {
    const terminalContainer = document.getElementById('terminal-container');
    if (terminalContainer) {
      const charWidth = 10; // Approximate character width
      const charHeight = 18; // Approximate character height
      const cols = Math.floor(terminalContainer.offsetWidth / charWidth);
      const rows = Math.floor(terminalContainer.offsetHeight / charHeight);

      this.terminal.resize(cols, rows);
    }
  }

  private handleTerminalInput(data: string) {
    if (data === '\r') {
      // Process input when Enter is pressed
      this.processInput();
    } else if (data === '\u007f') {
      // Handle backspace
      if (this.inputBuffer.length > 0) {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.terminal.write('\b \b');
      }
    } else if (/^[\x20-\x7E]$/.test(data)) {
      // Only allow printable characters (ASCII range 32-126)
      this.inputBuffer += data;
      this.terminal.write(data);
    } else {
      // Ignore non-printable characters and escape sequences
      console.log('Ignored input:', JSON.stringify(data));
    }
  }

  private processInput() {
    const input = this.inputBuffer.trim();
    this.inputBuffer = ''; // Clear the buffer

    if (this.stage === 'host') {
      if (!input) {
        this.terminal.write('\x1b[31mHost cannot be empty. Please enter a valid host.\x1b[0m');
        this.promptInline('Enter Host: ');
      } else {
        this.credentials.host = input;
        this.stage = 'username';
        this.promptInline('\r\nEnter Username: ');
      }
    } else if (this.stage === 'username') {
      if (!input) {
        this.terminal.write('\x1b[31mUsername cannot be empty. Please enter a valid username.\x1b[0m');
        this.promptInline('\r\nEnter Username: ');
      } else {
        this.credentials.username = input;
        this.stage = 'password';
        this.promptInline('\r\nEnter Password: ');
      }
    } else if (this.stage === 'password') {
      if (!input) {
        this.terminal.write('\x1b[31mPassword cannot be empty. Please enter a valid password.\x1b[0m');
        this.promptInline('\r\nEnter Password: ');
      } else {
        this.credentials.password = input;
        this.stage = 'command';

        // Ensure WebSocket connection is initialized only after credentials are provided
        if (!this.webSocketService.isConnected) {
          this.webSocketService.initializeConnection(this.credentials);
        }

        // Listen for connection success or failure
        this.webSocketService.onMessage((message) => {
          if (message.includes('Info: SSH connection established.')) {
            this.currentUser = this.credentials.username;
            this.currentDirectory = '~';
            this.prompt(); // Show prompt with user and directory
          } else if (message.includes('Error: Failed to connect to SSH')) {
            this.terminal.write('\r\n\x1b[31mFailed to establish SSH session. Check credentials.\x1b[0m\r\n');
            this.stage = 'host';
            this.promptInline('\r\nEnter Host: ');
          }
        });
      }
    } else if (this.stage === 'command' && input) {
      // Send the command to the WebSocket
      this.webSocketService.sendMessage(input);
    } else {
      // Handle other stages (host, username, password)
      this.prompt();
      console.error(`Invalid stage: ${this.stage}`);
    }
  }

  private subscribeToWebSocketMessages() {
    console.log('Subscribing to WebSocket messages');
    this.webSocketService.onMessage((message: string) => {
         // Extract data after the colon
      const colonIndex = message.indexOf(':');
      let data = colonIndex !== -1 ? message.substring(colonIndex + 1).trim() : message;
      data = data.replace(/\r?\n/g, '\r\n');
      if (this.terminal) {
        if (data) {
          this.terminal.write(`\r\n${data}`);
        }
        this.prompt(); // Re-display the prompt
      }
    });
  }

  private promptInline(message: string = '') {
    this.terminal.write(message);
  }

  private prompt(message: string = '') {
    if (message) {
      this.terminal.write(message);
    }
    if (this.currentUser && this.currentDirectory) {
      const colorizedUser = `\x1b[94m${this.currentUser}\x1b[0m`; // Bright blue for username
      const colorizedDirectory = `\x1b[96m${this.currentDirectory}\x1b[0m`; // Bright cyan for directory
      this.terminal.write(`\r\n[${colorizedUser}@${colorizedDirectory}$ ]`);
    } else {
      this.terminal.write('\r\n$ ');
    }
  }

  ngOnDestroy() {
    this.webSocketService.closeConnection();
  }
}
