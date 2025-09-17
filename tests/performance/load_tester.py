#!/usr/bin/env python3
"""
Performance and Load Testing for Multi-Agent Workflow

Requirements covered: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
"""

import asyncio
import aiohttp
import time
import uuid
import statistics
import logging
from datetime import datetime
from typing import Dict, Any, List
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    operation_id: str
    start_time: float
    end_time: float
    duration: float
    success: bool
    error_message: str = None

class PerformanceLoadTester:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.services = {
            "ai_orchestrator": "http://localhost:8010",
            "nlp_service": "http://localhost:8011",
            "free_ai_service": "http://localhost:8016"
        }
        
        self.test_data_template = {
            "user_id": None,
            "submission_type": "mixed",
            "text_content": "Performance test submission for load testing.",
            "requirements": "Business analysis and solution recommendation",
            "contact_info": {
                "name": "Load Test User",
                "email": "loadtest@example.com",
                "telegram": "694579866"
            }
        }
    
    async def run_comprehensive_tests(self) -> Dict[str, Any]:
        """Run all performance tests"""
        logger.info("🚀 Starting performance tests")
        
        results = {}
        results["baseline"] = await self.test_single_request()
        results["concurrent"] = await self.test_concurrent_submissions()
        results["agents"] = await self.test_agent_performance()
        results["summary"] = self.generate_summary(results)
        
        return results
    
    async def test_single_request(self) -> Dict[str, Any]:
        """Test single request baseline"""
        logger.info("📊 Testing single request baseline")
        
        test_data = self.test_data_template.copy()
        test_data["user_id"] = f"baseline_{uuid.uuid4()}"
        
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.services['ai_orchestrator']}/api/process-submission",
                    json=test_data,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        total_time = time.time() - start_time
                        
                        return {
                            "success": True,
                            "total_time": total_time,
                            "submission_id": result["submission_id"]
                        }
                    else:
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}",
                            "total_time": time.time() - start_time
                        }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "total_time": time.time() - start_time
            }
    
    async def test_concurrent_submissions(self) -> Dict[str, Any]:
        """Test concurrent submissions"""
        logger.info("🔄 Testing concurrent submissions")
        
        concurrent_users = 5
        tasks = []
        
        for i in range(concurrent_users):
            test_data = self.test_data_template.copy()
            test_data["user_id"] = f"concurrent_{i}_{uuid.uuid4()}"
            task = asyncio.create_task(self.submit_and_measure(test_data, f"concurrent_{i}"))
            tasks.append(task)
        
        start_time = time.time()
        metrics_list = await asyncio.gather(*tasks, return_exceptions=True)
        total_duration = time.time() - start_time
        
        successful_metrics = [m for m in metrics_list if isinstance(m, PerformanceMetrics) and m.success]
        failed_count = len(metrics_list) - len(successful_metrics)
        
        if successful_metrics:
            durations = [m.duration for m in successful_metrics]
            avg_response_time = statistics.mean(durations)
            max_response_time = max(durations)
        else:
            avg_response_time = max_response_time = 0
        
        return {
            "concurrent_users": concurrent_users,
            "successful_requests": len(successful_metrics),
            "failed_requests": failed_count,
            "avg_response_time": avg_response_time,
            "max_response_time": max_response_time,
            "total_duration": total_duration,
            "success_rate": len(successful_metrics) / concurrent_users
        }
    
    async def test_agent_performance(self) -> Dict[str, Any]:
        """Test individual agent performance"""
        logger.info("🤖 Testing agent performance")
        
        agent_tests = {
            "nlp_service": {
                "endpoint": "/api/analyze-text",
                "payload": {
                    "text_content": "Test business analysis request",
                    "requirements": "Business analysis"
                }
            },
            "free_ai_service": {
                "endpoint": "/analyze",
                "payload": {
                    "text_content": "Test analysis request",
                    "analysis_type": "business_analysis"
                }
            }
        }
        
        results = {}
        
        for agent_name, test_config in agent_tests.items():
            logger.info(f"Testing {agent_name}")
            
            timings = []
            successes = 0
            
            for i in range(3):  # 3 requests per agent
                start_time = time.time()
                
                try:
                    async with aiohttp.ClientSession() as session:
                        async with session.post(
                            f"{self.services[agent_name]}{test_config['endpoint']}",
                            json=test_config["payload"],
                            timeout=aiohttp.ClientTimeout(total=60)
                        ) as response:
                            if response.status == 200:
                                await response.json()
                                duration = time.time() - start_time
                                timings.append(duration)
                                successes += 1
                except Exception as e:
                    logger.warning(f"{agent_name} error: {e}")
            
            if timings:
                results[agent_name] = {
                    "avg_processing_time": statistics.mean(timings),
                    "max_processing_time": max(timings),
                    "success_rate": successes / 3,
                    "total_requests": 3
                }
            else:
                results[agent_name] = {
                    "avg_processing_time": 0,
                    "success_rate": 0,
                    "error": "All requests failed"
                }
        
        return results
    
    async def submit_and_measure(self, test_data: Dict[str, Any], operation_id: str) -> PerformanceMetrics:
        """Submit request and measure performance"""
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.services['ai_orchestrator']}/api/process-submission",
                    json=test_data,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    end_time = time.time()
                    
                    return PerformanceMetrics(
                        operation_id=operation_id,
                        start_time=start_time,
                        end_time=end_time,
                        duration=end_time - start_time,
                        success=response.status == 200,
                        error_message=None if response.status == 200 else f"HTTP {response.status}"
                    )
        except Exception as e:
            end_time = time.time()
            return PerformanceMetrics(
                operation_id=operation_id,
                start_time=start_time,
                end_time=end_time,
                duration=end_time - start_time,
                success=False,
                error_message=str(e)
            )
    
    def generate_summary(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate test summary"""
        baseline = results.get("baseline", {})
        concurrent = results.get("concurrent", {})
        agents = results.get("agents", {})
        
        recommendations = []
        
        if baseline.get("total_time", 0) > 60:
            recommendations.append("Baseline performance is slow - optimize processing")
        
        if concurrent.get("success_rate", 0) < 0.8:
            recommendations.append("Low success rate under concurrent load")
        
        if not recommendations:
            recommendations.append("Performance tests passed successfully")
        
        return {
            "test_timestamp": datetime.now().isoformat(),
            "baseline_success": baseline.get("success", False),
            "concurrent_success_rate": concurrent.get("success_rate", 0),
            "agent_count_tested": len(agents),
            "recommendations": recommendations
        }

if __name__ == "__main__":
    async def main():
        tester = PerformanceLoadTester()
        results = await tester.run_comprehensive_tests()
        
        print("\n" + "="*60)
        print("⚡ PERFORMANCE TEST RESULTS")
        print("="*60)
        
        baseline = results.get("baseline", {})
        print(f"\n📊 Baseline: {'✅' if baseline.get('success') else '❌'}")
        print(f"   Time: {baseline.get('total_time', 0):.2f}s")
        
        concurrent = results.get("concurrent", {})
        print(f"\n🔄 Concurrent ({concurrent.get('concurrent_users', 0)} users):")
        print(f"   Success Rate: {concurrent.get('success_rate', 0):.1%}")
        print(f"   Avg Response: {concurrent.get('avg_response_time', 0):.2f}s")
        
        agents = results.get("agents", {})
        print(f"\n🤖 Agent Performance:")
        for agent, perf in agents.items():
            print(f"   {agent}: {perf.get('success_rate', 0):.1%} success, {perf.get('avg_processing_time', 0):.2f}s avg")
        
        summary = results.get("summary", {})
        print(f"\n💡 Recommendations:")
        for rec in summary.get("recommendations", []):
            print(f"   • {rec}")
        
        print("\n" + "="*60)
    
    asyncio.run(main())