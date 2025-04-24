import { exec } from 'child_process';
import { platform } from 'os';

const isWindows = platform() === 'win32';

console.log('🚀 Starting MediSmart development environment...');

// Kill any existing processes on the development ports
const killPortCommands = {
  win32: {
    backend: 'FOR /F "tokens=5" %P IN (\'netstat -ano ^| findstr :5000 ^| findstr LISTENING\') DO taskkill /F /PID %P',
    frontend: 'FOR /F "tokens=5" %P IN (\'netstat -ano ^| findstr :5173 ^| findstr LISTENING\') DO taskkill /F /PID %P'
  },
  other: {
    backend: "lsof -ti:5000 | xargs kill -9",
    frontend: "lsof -ti:5173 | xargs kill -9"
  }
};

const commands = isWindows ? killPortCommands.win32 : killPortCommands.other;

// Function to execute a command and handle errors
const executeCommand = (command, errorMessage) => {
  return new Promise((resolve) => {
    exec(command, (error) => {
      // We don't care about errors here as the process might not exist
      resolve();
    });
  });
};

// Kill existing processes
const killProcesses = async () => {
  console.log('🔄 Closing any existing server processes...');
  
  try {
    await executeCommand(commands.backend);
    await executeCommand(commands.frontend);
    console.log('✅ Closed existing processes');
  } catch (error) {
    console.log('⚠️ Note: No existing processes found or unable to close them');
  }
};

// Start the backend server
const startBackend = () => {
  console.log('🔄 Starting backend server...');
  
  const backendProcess = exec('node server/index.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Backend Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`❌ Backend Error: ${stderr}`);
      return;
    }
  });
  
  backendProcess.stdout.on('data', (data) => {
    console.log(`🖥️  Backend: ${data.trim()}`);
  });
  
  backendProcess.stderr.on('data', (data) => {
    console.error(`❌ Backend Error: ${data.trim()}`);
  });
  
  return backendProcess;
};

// Start the frontend server
const startFrontend = () => {
  console.log('🔄 Starting frontend server...');
  
  const frontendProcess = exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Frontend Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`❌ Frontend Error: ${stderr}`);
      return;
    }
  });
  
  frontendProcess.stdout.on('data', (data) => {
    console.log(`🌐 Frontend: ${data.trim()}`);
  });
  
  frontendProcess.stderr.on('data', (data) => {
    console.error(`❌ Frontend Error: ${data.trim()}`);
  });
  
  return frontendProcess;
};

// Handle graceful shutdown
const handleShutdown = (backendProcess, frontendProcess) => {
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down development servers...');
    
    if (backendProcess) backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();
    
    console.log('👋 Development servers stopped. Goodbye!');
    process.exit(0);
  });
};

// Main function to run everything
const main = async () => {
  try {
    // Kill any existing processes
    await killProcesses();
    
    // Start backend and frontend servers
    const backendProcess = startBackend();
    
    // Wait a bit for the backend to start before starting the frontend
    setTimeout(() => {
      const frontendProcess = startFrontend();
      
      // Setup graceful shutdown
      handleShutdown(backendProcess, frontendProcess);
      
      console.log('\n✨ Development environment is ready!');
      console.log('📊 Backend running on: http://localhost:5000');
      console.log('🌐 Frontend running on: http://localhost:5173');
      console.log('⚡ Press Ctrl+C to stop both servers');
    }, 2000);
  } catch (error) {
    console.error('❌ Error starting development environment:', error);
  }
};

// Run the main function
main();
