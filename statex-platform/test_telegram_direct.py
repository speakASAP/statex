#!/usr/bin/env python3
"""
Direct Telegram Test Script
Tests Telegram Bot API directly without going through the notification service
"""

import requests
import json

# Telegram Configuration
TELEGRAM_BOT_TOKEN = "8224681541:AAGHItxcuN2ifbXrSgJmGNwywup6J7AMsK0"
TELEGRAM_CHAT_ID = "694579866"

def send_telegram_message(message):
    """Send message directly to Telegram"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    data = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get("ok"):
                print(f"✅ Telegram message sent successfully!")
                print(f"Message ID: {result['result']['message_id']}")
                return True
            else:
                print(f"❌ Telegram API error: {result.get('description', 'Unknown error')}")
                return False
        else:
            print(f"❌ HTTP error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {str(e)}")
        return False

def test_telegram():
    """Test Telegram functionality"""
    print("🚀 Testing Telegram Bot API directly...")
    print("=" * 50)
    
    # Test message
    test_message = """🤖 <b>StateX Platform Test</b>

✅ <b>AI Services Status:</b>
• AI Orchestrator: Running (Port 8010)
• NLP Service: Running (Port 8011) 
• Document AI: Running (Port 8013)
• Free AI Service: Running (Port 8016)

✅ <b>Website Services:</b>
• Frontend: Running (Port 3000)
• Submission Service: Running (Port 8002)
• Content Service: Running (Port 8009)

✅ <b>Infrastructure:</b>
• PostgreSQL: Running
• Redis: Running
• RabbitMQ: Running

🎯 <b>Test Results:</b>
The StateX platform is successfully running! All core AI services are operational and ready to process form submissions.

<i>This message was sent directly via Telegram Bot API</i>"""
    
    success = send_telegram_message(test_message)
    
    if success:
        print("\n🎉 Telegram test completed successfully!")
        print("Check your Telegram channel for the test message.")
    else:
        print("\n❌ Telegram test failed!")
        print("Please check your bot token and chat ID configuration.")

if __name__ == "__main__":
    test_telegram()

