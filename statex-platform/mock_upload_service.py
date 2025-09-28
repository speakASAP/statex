#!/usr/bin/env python3
"""
Simple mock upload service for StateX form submission testing
This provides a basic endpoint that mimics the upload-files functionality
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import uuid
from urllib.parse import urlparse, parse_qs
import os

class MockUploadHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "status": "healthy",
                "service": "mock-upload-service",
                "message": "Mock upload service is running"
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/api/forms/upload-files':
            self.handle_upload_files()
        elif self.path == '/api/forms/upload-voice':
            self.handle_upload_voice()
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

    def handle_upload_files(self):
        """Mock file upload handler"""
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))
            
            # Read the multipart data (simplified)
            data = self.rfile.read(content_length)
            
            # Generate mock response
            file_id = str(uuid.uuid4())
            session_id = f"temp_{uuid.uuid4().hex[:8]}"
            
            response = {
                "success": True,
                "message": "File uploaded successfully (mock)",
                "fileId": f"{file_id}.mock",
                "originalName": "mock_file.txt",
                "fileSize": len(data),
                "tempSessionId": session_id
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {
                "success": False,
                "error": f"Mock upload failed: {str(e)}"
            }
            self.wfile.write(json.dumps(error_response).encode())

    def handle_upload_voice(self):
        """Mock voice upload handler"""
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))
            
            # Read the multipart data (simplified)
            data = self.rfile.read(content_length)
            
            # Generate mock response
            file_id = str(uuid.uuid4())
            session_id = f"temp_{uuid.uuid4().hex[:8]}"
            
            response = {
                "success": True,
                "message": "Voice recording uploaded successfully (mock)",
                "fileId": f"{file_id}.wav",
                "originalName": "voice_recording.wav",
                "fileSize": len(data),
                "recordingTime": 5.0,
                "tempSessionId": session_id
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {
                "success": False,
                "error": f"Mock voice upload failed: {str(e)}"
            }
            self.wfile.write(json.dumps(error_response).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """Override to reduce logging noise"""
        pass

def run_server(port=8002):
    """Run the mock upload server"""
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, MockUploadHandler)
    print(f"Mock upload service running on port {port}")
    print(f"Health check: http://localhost:{port}/health")
    print(f"Upload endpoint: http://localhost:{port}/api/forms/upload-files")
    print(f"Voice endpoint: http://localhost:{port}/api/forms/upload-voice")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down mock upload service...")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
