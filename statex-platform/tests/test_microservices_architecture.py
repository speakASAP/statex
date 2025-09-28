#!/usr/bin/env python3
"""
StateX Microservices Architecture Test Script
Tests the complete microservices architecture and inter-service communication
"""

import asyncio
import aiohttp
import json
import time
from typing import Dict, Any, List
import sys
import os

# Add the platform shared directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'shared'))

from http_clients import AIServiceClient, NotificationServiceClient

class MicroservicesArchitectureTester:
    """Test suite for StateX microservices architecture"""
    
    def __init__(self):
        self.base_url = "http://localhost"
        self.services = {
            "api_gateway": {"port": 8001, "path": "/health", "manager": "platform"},
            "submission_service": {"port": 8002, "path": "/health", "manager": "website"},
            "ai_orchestrator": {"port": 8010, "path": "/health", "manager": "platform"},
            "nlp_service": {"port": 8011, "path": "/health", "manager": "platform"},
            "asr_service": {"port": 8012, "path": "/health", "manager": "platform"},
            "document_ai": {"port": 8013, "path": "/health", "manager": "platform"},
            "prototype_generator": {"port": 8014, "path": "/health", "manager": "platform"},
            "template_repository": {"port": 8015, "path": "/health", "manager": "platform"},
            "free_ai_service": {"port": 8016, "path": "/health", "manager": "platform"},
            "ai_workers": {"port": 8017, "path": "/health", "manager": "platform"},
            "notification_service": {"port": 8005, "path": "/health", "manager": "platform"},
            "monitoring_service": {"port": 8007, "path": "/health", "manager": "platform"},
            "logging_service": {"port": 8008, "path": "/health", "manager": "platform"}
        }
        self.results = {}
        
    async def test_service_health(self, service_name: str, port: int, path: str) -> Dict[str, Any]:
        """Test individual service health"""
        url = f"{self.base_url}:{port}{path}"
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=5) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "status": "healthy",
                            "response_time": response.headers.get('X-Response-Time', 'N/A'),
                            "data": data
                        }
                    else:
                        return {
                            "status": "unhealthy",
                            "error": f"HTTP {response.status}"
                        }
        except asyncio.TimeoutError:
            return {"status": "timeout", "error": "Request timeout"}
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    async def test_all_services(self) -> Dict[str, Any]:
        """Test all microservices health"""
        print("🔍 Testing all microservices health...")
        
        tasks = []
        for service_name, config in self.services.items():
            task = self.test_service_health(service_name, config["port"], config["path"])
            tasks.append((service_name, task))
        
        results = {}
        for service_name, task in tasks:
            result = await task
            results[service_name] = result
            status_icon = "✅" if result["status"] == "healthy" else "❌"
            print(f"  {status_icon} {service_name}: {result['status']}")
        
        return results
    
    async def test_inter_service_communication(self) -> Dict[str, Any]:
        """Test communication between services"""
        print("\n🔗 Testing inter-service communication...")
        
        # Test API Gateway routing
        api_tests = [
            ("/api/users/health", "user_portal"),
            ("/api/submissions/health", "submission_service"),
            ("/api/ai/health", "ai_orchestrator"),
            ("/api/notifications/health", "notification_service"),
            ("/api/content/health", "content_service"),
            ("/api/monitoring/health", "monitoring_service"),
            ("/api/logging/health", "logging_service")
        ]
        
        results = {}
        for path, expected_service in api_tests:
            try:
                url = f"{self.base_url}:8000{path}"
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, timeout=5) as response:
                        if response.status == 200:
                            results[path] = {"status": "success", "service": expected_service}
                            print(f"  ✅ {path} -> {expected_service}")
                        else:
                            results[path] = {"status": "failed", "error": f"HTTP {response.status}"}
                            print(f"  ❌ {path} -> HTTP {response.status}")
            except Exception as e:
                results[path] = {"status": "error", "error": str(e)}
                print(f"  ❌ {path} -> {str(e)}")
        
        return results
    
    async def test_ai_services_integration(self) -> Dict[str, Any]:
        """Test AI services integration"""
        print("\n🤖 Testing AI services integration...")
        
        try:
            # Test AI Service Client
            ai_client = AIServiceClient()
            
            # Test notification service
            notification_client = NotificationServiceClient()
            
            results = {
                "ai_client": "initialized",
                "notification_client": "initialized"
            }
            
            print("  ✅ AI Service Client initialized")
            print("  ✅ Notification Service Client initialized")
            
            return results
            
        except Exception as e:
            print(f"  ❌ AI services integration failed: {str(e)}")
            return {"error": str(e)}
    
    async def test_database_connections(self) -> Dict[str, Any]:
        """Test database connections through services"""
        print("\n🗄️ Testing database connections...")
        
        # Test through API Gateway
        db_tests = [
            "/api/users/db-health",
            "/api/submissions/db-health",
            "/api/content/db-health",
            "/api/monitoring/db-health",
            "/api/logging/db-health"
        ]
        
        results = {}
        for path in db_tests:
            try:
                url = f"{self.base_url}:8000{path}"
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, timeout=5) as response:
                        if response.status == 200:
                            results[path] = {"status": "connected"}
                            print(f"  ✅ {path}: Database connected")
                        else:
                            results[path] = {"status": "failed", "error": f"HTTP {response.status}"}
                            print(f"  ❌ {path}: HTTP {response.status}")
            except Exception as e:
                results[path] = {"status": "error", "error": str(e)}
                print(f"  ❌ {path}: {str(e)}")
        
        return results
    
    async def run_comprehensive_test(self) -> Dict[str, Any]:
        """Run comprehensive architecture test"""
        print("🚀 Starting StateX Microservices Architecture Test")
        print("=" * 60)
        
        start_time = time.time()
        
        # Run all tests
        health_results = await self.test_all_services()
        communication_results = await self.test_inter_service_communication()
        ai_results = await self.test_ai_services_integration()
        db_results = await self.test_database_connections()
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Compile results
        results = {
            "test_duration": total_time,
            "health_check": health_results,
            "inter_service_communication": communication_results,
            "ai_services_integration": ai_results,
            "database_connections": db_results
        }
        
        # Calculate success rate
        total_tests = len(health_results) + len(communication_results) + len(ai_results) + len(db_results)
        successful_tests = sum(1 for result in health_results.values() if result["status"] == "healthy")
        successful_tests += sum(1 for result in communication_results.values() if result["status"] == "success")
        successful_tests += sum(1 for result in ai_results.values() if "error" not in result)
        successful_tests += sum(1 for result in db_results.values() if result["status"] == "connected")
        
        success_rate = (successful_tests / total_tests) * 100 if total_tests > 0 else 0
        
        results["success_rate"] = success_rate
        results["total_tests"] = total_tests
        results["successful_tests"] = successful_tests
        
        return results
    
    def print_summary(self, results: Dict[str, Any]):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        print(f"⏱️  Total test duration: {results['test_duration']:.2f} seconds")
        print(f"📈 Success rate: {results['success_rate']:.1f}%")
        print(f"✅ Successful tests: {results['successful_tests']}/{results['total_tests']}")
        
        print("\n🔍 Service Health Status:")
        for service, result in results["health_check"].items():
            status_icon = "✅" if result["status"] == "healthy" else "❌"
            print(f"  {status_icon} {service}: {result['status']}")
        
        print("\n🔗 Inter-Service Communication:")
        for path, result in results["inter_service_communication"].items():
            status_icon = "✅" if result["status"] == "success" else "❌"
            print(f"  {status_icon} {path}: {result['status']}")
        
        print("\n🤖 AI Services Integration:")
        for test, result in results["ai_services_integration"].items():
            status_icon = "✅" if "error" not in result else "❌"
            print(f"  {status_icon} {test}: {result}")
        
        print("\n🗄️ Database Connections:")
        for path, result in results["database_connections"].items():
            status_icon = "✅" if result["status"] == "connected" else "❌"
            print(f"  {status_icon} {path}: {result['status']}")
        
        if results["success_rate"] >= 80:
            print("\n🎉 Architecture test PASSED! System is ready for production.")
        elif results["success_rate"] >= 60:
            print("\n⚠️  Architecture test PARTIALLY PASSED. Some issues need attention.")
        else:
            print("\n❌ Architecture test FAILED. Major issues detected.")

async def main():
    """Main test function"""
    tester = MicroservicesArchitectureTester()
    results = await tester.run_comprehensive_test()
    tester.print_summary(results)
    
    # Save results to file
    with open("microservices_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: microservices_test_results.json")
    
    # Exit with appropriate code
    if results["success_rate"] >= 80:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
