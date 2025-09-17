#!/usr/bin/env python3
"""
Performance and Load Testing for Multi-Agent Workflow

This module implements performance testing for concurrent form submissions,
AI agent processing times, system throughput, and resource constraints.

Requirements covered: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
"""

import pytest
import asyncio
import aiohttp
import time
import uuid
import statistics
import psutil
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """Performance metrics for a single operation"""
    operation_id: str
    start_time: float
    end_time: float
    duration: float
    success: bool
    error_message: Optional[str] = None
    agent_timings: Dict[str, float] = None
    memory_usage: float = 0
    cpu_usage: float = 0

@dataclass
class LoadTestResult:
    """Results from a load test"""
    test_name: str
    concurrent_users: int
    total_requests: int
    successful_requests: int
    failed_requests: int
    avg_response_time: float
    min_response_time: float
    max_response_time: float
    p95_response_time: float
    p99_response_time: float
    throughput: float  # requests per second
    error_rate: float
    system_metrics: Dict[str, Any]

class SystemMonitor:
    """Monitor system resources during testing"""
    
    def __init__(self):
        self.monitoring = False
        self.metrics_history = []
    
    def start_monitoring(self):
        """Start system monitoring"""
        self.monitoring = True
        self.metrics_history = []
        asyncio.create_task(self._monitor_loop())
    
    def stop_monitoring(self):
        """Stop system monitoring"""
        self.monitoring = False
    
    async def _monitor_loop(self):
        """Monitor system resources in a loop"""
        while self.monitoring:
            try:
                metrics = {
                    "timestamp": time.time(),
                    "cpu_percent": psutil.cpu_percent(interval=1),
                    "memory_percent": psutil.virtual_memory().percent,
                    "memory_used_gb": psutil.virtual_memory().used / (1024**3),
                    "disk_io": psutil.disk_io_counters()._asdict() if psutil.disk_io_counters() else {},
                    "network_io": psutil.net_io_counters()._asdict() if psutil.net_io_counters() else {}
                }
                self.metrics_history.append(metrics)
                await asyncio.sleep(1)
            except Exception as e:
                logger.warning(f"Error monitoring system: {e}")
                await asyncio.sleep(1)
    
    def get_summary_metrics(self) -> Dict[str, Any]:
        """Get summary of system metrics"""
        if not self.metrics_history:
            return {}
        
        cpu_values = [m["cpu_percent"] for m in self.metrics_history]
        memory_values = [m["memory_percent"] for m in self.metrics_history]
        
        return {
            "avg_cpu_percent": statistics.mean(cpu_values),
            "max_cpu_percent": max(cpu_values),
            "avg_memory_percent": statistics.mean(memory_values),
            "max_memory_percent": max(memory_values),
            "max_memory_used_gb": max(m["memory_used_gb"] for m in self.metrics_history),
            "monitoring_duration": len(self.metrics_history),
            "samples_count": len(self.metrics_history)
        }

class PerformanceLoadTester:
    """Comprehensive performance and load tester"""
    
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.system_monitor = SystemMonitor()
        
        # Service endpoints
        self.services = {
            "ai_orchestrator": "http://localhost:8010",
            "nlp_service": "http://localhost:8011",
            "asr_service": "http://localhost:8012",
            "document_ai": "http://localhost:8013",
            "free_ai_service": "http://localhost:8016",
            "notification_service": "http://localhost:8005"
        }
        
        # Test data templates
        self.test_data_template = {
            "user_id": None,  # Will be set per request
            "submission_type": "mixed",
            "text_content": "Performance test submission for load testing. This is a comprehensive business analysis request that should trigger multiple AI agents including NLP analysis, business requirement processing, and notification delivery.",
            "voice_file_url": None,
            "file_urls": [],
            "requirements": "Comprehensive business analysis and solution recommendation",
            "contact_info": {
                "name": "Load Test User",
                "email": "loadtest@example.com",
                "telegram": "694579866"
            }
        }
    
    async def run_comprehensive_performance_tests(self) -> Dict[str, Any]:
        """Run all performance and load tests"""
        logger.info("🚀 Starting comprehensive performance and load tests")
        
        results = {}
        
        # Test 1: Single request baseline
        results["baseline"] = await self.test_single_request_baseline()
        
        # Test 2: Concurrent submissions
        results["concurrent_load"] = await s
        
        # Test 3: es
        results["a
        
        # Test 4: System throughput
        resuloughput()
     
        # Test 5: Resource constraints
        results["resource_constraints"] = await self.tets()
        
        # Test 6: Timeout handling
        results["tim)
   
        # Test 7: Queue management
        results["queue_management"] = await self.test_queue_management()
        
    
        results["summary"] = self.generate_peults)
        
 
    
    async def test_single_request_baseli
  ce"""
        logger.info("📊 Testing single request baseline performance")
        
        start_time = time.time()
        
        # Submuest
        test_d)
        test_data["user_id"] = f"baseline_{uuid.uuid4()}"
        
        try:
            async wion:
                async with session.post(
                    f"{self.services['ai_orchestrator']}/api/process-submission",
                    json=test_data,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    if response.status == 200:
                        result = await e.json()
            
        
                        # Wait for processing to complete
                        processing_time = await self.wait_for_completion(submissi
                        
                        total_time = time.time() - start_time
                        
                        return {
                            "s
                            "total_time": total_time,
    
       
                        }
                    else:
                        return {
                            "success": False,
                            "error,
                            "total_time": time.time() - start_time
                        }
        except Excep e:
            return {
                "success": False,
    ,
                "total_time": time.time() - start_time
            }
    
    async def testesult]:
        """Test concurrent form submissions with varying""
        logger.info("🔄 Testions")
        
        load_levels = [2, 5,
        results = {}
        
        for concurrent
            logger.info(f"Testing with {concurrent_users} concurrent users")
            
            # Start system monitoring
            self.system_moni
            
            # Create concurrent tasks
            tasks = []
            for i in range(concurrent_users):
                t.copy()
                test_data["user_id"] = f"}"
        )
                tasks.append(task)
            
            # Execute all tasks concurrently
     e()
            metrics_list = await asyncio.gather(*tasks, rons=True)
       rt_time
            
            # Stop monitoring
            self.system_monitor.sting()
            system_metrics = )
            
            # Process results
   ss]
    ]
            exception_count = len([m for m in metrception)])
            
            if successful_metrics:
                durations = [m.duratcs]
                avg_response_time = stas)
                min_response_time = min(d
                max_response_time = max(durations)
                p95_res[0]
                p99_response_time = statist
           
                avg_response_time = min_response_time = max_response_timeime = 0
            
            throughput = len(successful_metrics) / total else 0
            error_rate = (len(failed_metri
            
            results[f"{concurrent_users}_users"] = LoadTestResult(
                test_name=f"Concurrent Load - {concurresers",
                concurrent_users=concurrent_users,
                trs,
                succ),
                failed_requests=len(fat,
                avg_response_time=avg_response_time,
                min_response_time=min_response_time,
                max_response_time=max_response_time,
                p95_response_time=p95_response_time,
                p99_response_time=p99_responime,
                throughpu,
                error_rate=error_rate,
           
            )
            
            # Wait bels
            await asyncio.sleep(5)
        
        return results
    
    async def test_agent_processing_times(self) -> Dict[str, Any]:
        """Test individual AI agent processimes"""
        logger.info("🤖 Testing AI agent processing times")
        
        agent_tests = {
  : {
    ,
                "payload": {
                    "text_content": "Analyze this busin
                    "requirements": "Business analysis and technology recommendations"
         }
            ,
            "free_ai_service": {
                "endpoint": "/analyze"
                "payload": {
        ",
                  
                }
            }
        }
        
        results = {}
        
        for agent_name, test_config in agent_tests.items():
            if agent_name not in self.services:
              
            
            logger.info(f"Testing {agent_name} performance")
            
            # Run multiple
   
            successes = 0
            
            f
                start_time = time.time()
                
                try:

                        async with .post(
                            f"{self.services[agent_name]}{test_config['endpoint']}",
               ],
                            timeout=aiohttp.Client
                        ) as response:
         :
                                await response.json()  # Read response
                                duration = time.time() - s
                                timin
          1
                            lse:
  
                except Exception as e:
                   ")
            
            if tims:
                results[agent_name] = {
        (timings),
                    "min_processing_time": ),
                    "max_processing_time": max(timings),
                    "success_rate": successes / 5,
  5,
    
                }
            else:
                results[agent_name] = {
                    "avg_processing_time": 0,
                    "min_processing_time": 0,
                    "m 0,
              
                    "total_requests": 5,
                    "successful_requests": 0,
               "
       }
        
        return results
    
    async def test_system_throughput(self) -> Dict[st
        """Test maximum system t""
       
        
        # Test with increasing request rates
        request_rates = [1, 2,nd
        results = {}
        
        for rate in request_r:
            logger.info(f"Testing {rate} requests per second")
            
            duration = 30  # Test for 30ds
            total_requests = rate * duration
            
            # Start systeing
            self.system_monitor.start_monitoring()
            
            # Create requests with timing
            tasks = []
            start_time = time.time()
            
            for i in range(total_reqts):
                # Calculate when this request should be sent
                send_time = starrate)
                
                test_data = self.test_data_templ
                test_data["user_id"] = f"throughput_{rate}_{i}_{uuid.ud4()}"
                

                    self.submit_at_tit_{i}")
                )
                tasks.append(task)
            
            # Wait for all relete
        rue)
            actual_dume
            
         oring
            self.system_monitor.stop_monitoring()
            system_metrics = self.system_monitor.getrics()
            
            s
    
            failed_count = len(metrics_list) - len(successful_metrics)
            
            actual_throughput = le
            
            results[f"{rate}_rps"] = {
                "target_rate": rate,
                "actual_throughput": actuaut,
           s,
      
                "failed_requests": failed_count,
                "test_duration": actual_duration,
                "success_rate":quests,
      ics
            }
            
            # Wait between tests
            await a
        
        return results
    
    asny]:
        """Test system behavi"
        logger.info("💾 Testing resource constraints")
  
        # This test simulates high load to stress system resources
        high_load_users = 50
        
        # Start intensive monitoring
        self.system_monitor.start_monitoring()
        
        # Create high load
        tasks = []
        for i in range(high_load_users):
            test_data = self.test)
       "
            # Make requests more resource
            test_data["text_content"] = test_data[
            
            task = asyncio.create_task(self.submit_and_measure_{i}"))
            tasks.append(task)
        
    
        metrics_list = await )
       e
        
        # Stop monitoring
     oring()
        system_
        
        # Analyze results
        successful_metrics = [m for m in metrics_luccess]
        failed_count = len(metrics_list) - len(suc)
        
        return {
            "high_load_users": high_load_users,
            "successful_requests": len(sucics),
            "failed_requests":t,
            ,
            "total_duration": total_duration,
            "system_metr,
            "resource_stress_detected": system_metrics.get("max
        }
    
    async
        """Test timeout handling and queue management"""
        logger.info("⏱️ Testing timeout handling")
        
   
        timeout_tests = []
        
        for i in range(5):
            test_daate.copy()
            test_data["user
            
            start_time = time.time()
            
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post(
              n",
                        json=test_data,
                        timeout=aiohttp.ClientTimeout(total=5)  # 
                    ) as response:
              
                            result = a)
                      nd({
                                "succes
                   ime,
                                "submission_id"
                            })
            else:
                            timeout_tests.appe{
                                "success": False,
ime,
                                "error": f"HTTP {response.sta"
                            })
     utError:
                timend({
                    "success": False,
                    "duration": time.time,
             
                })
            except Exception as e:
                timeout_tests.append({
    lse,
                    "duration": tme,
         
           })
        
        successful_within_timeout = len([t )
        timeout_errors = len([t for t in t
        
        return {
            "total_tests": len(timeout_tests),
            "successful_within_timeout": 
            "timeout_errors": timeout_errors,
            "timeout_handts),
sts])
        }
    
    async def test_queue_management(self) -> Dict[str, A
        """Test queue management under load"""
        logger.info("📋 Testing queue management")
        
        # Submit many requests 
        queue_test_req
        
        tasks = []
        submission_times = []
        
        start_time = time.time()
        
        for i in range(queue_test_requests):
            test_data = self.test_data_template.copy()
            test_data["user_id"] = f"queue_test_{i}_{uuid.uuid4()}"
            
            submission_time = tim()
            submission_times.append(submission_time)
            
            task = asyncio.create_task(self.submit_and_measure(test_data, f"queu"))
            tasks.append(task)
        
        # Wait fete
        metrics
        total_duration = time.time(me
        
        # 
        successful_metrics = [m for m
        
        if successful_metrics:
      ics]
            queue_wait_times = [completion_times[i] - submission_times
            
            re
                "total_requests": queue_test_requests,
                "successful_requests": len(successful_metrics),
  imes),
                "max_ques),
              
       ,
          ration
            }
        else:
            return {
                "tota
                "successful_requests": 0,
                "error": "All s failed"
            }
    
    async def submit_and_measure(self, test_data: Dict[str, Any], operation_id: str) -> Pcs:
        """Submit request and measure performance"""
        start_time = time.time()
        
        try:
            async wit:
        .post(
                    f"{self.services['ai_orchestrator']}/api",
                    json=test_data,
                    timeout=aiohttp.ClientTimeout(total=120)
             esponse:
            :
    
                        submission_id =
                        
    )
                  
                        
                        end_time = )
                        
                        return PerformanceMetrics(
                            operation_id=operati_id,
                            start_time=
                            end_time=end_time,
                            duration=end_time - start_time,
                            success=True
                        )
                    else:
                        end_time = time.time()
                        return PerformanceMetrics(
                            operation_id=operation_id,
   e,
                            end_time=end_time,
                            duration=end_time - start_time,
      e,
                            error_message=f"HTTP {response.status}"
                    )
        except Exception as e:
            end_time = time.time()
            return PerformanceMetrics(
                operation_id=operation_id,
                start_time=start_time,
                end_time=end_time,
                duration=end_time - s
   s=False,
                error_message=str(e)
            )
    
    async def submit_at_time(self,ics:
    "
        # Wait until target time
        current_time = time.time()
        if target_time > curren
        
        
        return await self.submit_and_measure(test_data, operation_id)
    
    async def wait_for_completion(self, submissio:
        """Wai"
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                async with aiohttp.Cliession:
                    async withet(
                        f"{self.servic,
        0)
                    ) as response:
                        if response.status == 200:
            ()
                            status = status_data.get("status", "unknown")
                            
               led"]:
              time
                            
   
                        else:
                            await asyncio.sleep(2)
            except Exception:
    ep(2)
        
        return timeout  # Return timeout if not completed
    
    def generate_performance_summary(self
        """Generate compre
        summary = {
            "test_timestamp": dt(),
            "baseline_performance": results.get("baseline", {}),
            "load_test_summary": {},
            "agent_performance_summary": {},
            "throughput_analysis": {},
            "resource_usageis": {},
            "recs": []
        }
        
        # Analyze concurrent load results
        if "concurrent_load" in results:
            load_results = results["ad"]
            summary["
                "max_concurrent_users_tested": max([i
                "best_throughput": ues()]),
                "lowest_error_rate": min([r.error_rate for r in load_results.values()]
                "performance_degradation": self.anal
            }
        
        # Analyze agent performance
        if "agent_performance" in results:
            agent_results ="]
            summary["agent_performance_summary"] = {
                "fastest_agent": None,
                "slowest_agent": max(agent_results.items(), key=lambda x: x[1].get("avg_procee,
                "overall_agent_ 0
            }
        
     ions
        summary["recommendations"] = self.generate_performance_rsults)
        
        return summary
    
    def analyze_performance_degra
       """
        sorted_results = sorted(load_results.items(), key=lambda x: x[users)
        
        if len(sorted_results) < 2:

        
    ]
        peak_load = sorted_results[-1][1]
        
        response_ime * 100
        throughput_change = (peak_load.throughput - baseline.t
        error_rate_increase = peak_load.error_raror_rate
        
        return {
            "response_time_increase_percease,
          
            "error_rate_increase": error_rate_increase,
            "performance_stable":
 }
    
    def generate_performance_recommendations
   "
        recommendations = []
        
        e
        baseline = results.get("baseline", {})
        if baseline.get("total_time",  > 60:
            recoine")
        
        # Check concurrent load nce
        if "cons:
            lo
     
            if high_error_rates:
                recommendations.append("High error rates det
        
    ormance
      
            agent_resnce"]
            slow_agents = [name f]
            if slow_agents:
                recommendations.append(f"Slow sing")
        
        # Check resource usage
        if "resource_constrai:
            resource_r
            if resource_results.get("resource_stress_detected", False):
                recommendations.append("ture")
        
        if not recommendations:
            recommendations.ad")
        
       ions

if __name__ == "__main__":
    async def main():
        tester = PerformanceLoadTester()
        results = await tester.run_comprehensive_per
        
        print("\n" + "="*80)
        print("⚡ PERFLTS")
       )
        
        summary = results["summary"]
        
    e
        baseline = results.get("baseline", {})
        print(f"\n📊 Baseline Pe
")
        print(f.2f}s")
        print(f"   Processing Time: {baseline.get('proces")
        
        # Load test results
        if "concurrent_load" in results:
            print(f"\n🔄 Concurrent Load Test Results:")
            for test_name, result in results["ems():
                print(f"   {result.concurrent_users} users
                
        
                print(f"     Throughput: {result.throughput:.2f} req/s")
                print(f"     P95 Response: {result.p95_response_s")
    
        # Agent performance
        if "agent_performanc
            print(f"\n🤖 Agent Performance:")
            for agent, perf in results["agentems():
     t}:")
                print(f"     Succe
                print(f"     Avg Time: {perf.get('avg_processing_time', 0):
        
        # Recommendations
        print(f"\n💡 Performance Recommendations:")
        for rec in su]):
            print(f"   • {rec}")
        
        print("\n" + "="*80)
    
    asyncio.run(main())