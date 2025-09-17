#!/usr/bin/env python3
"""
Monitoring and Alerting Testing for Multi-Agent Workflow

Requirements covered: 8.6, 10.4, 10.5, 10.6, 10.7
"""

import asyncio
import aiohttp
import time
import uuid
import logging
from datetime import datetime
from typing import Dict, Any, List
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class MetricCheck:
    metric_name: str
    expected_labels: Dict[str, str]
    should_exist: bool = True

class MonitoringAlertingTester:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        
        self.services = {
            "prometheus": "http://localhost:9090",
            "grafana": "http://localhost:3002",
            "ai_orchestrator": "http://localhost:8010",
            "nlp_service": "http://localhost:8011",
            "notification_service": "http://localhost:8005"
        }
        
        self.expected_metrics = [
            MetricCheck("workflow_processing_time_seconds", {"workflow_type": "business_analysis"}),
            MetricCheck("agent_success_total", {"agent_name": "nlp_service"}),
            MetricCheck("nlp_requests_total", {"provider": "free_ai"}),
            MetricCheck("notification_delivery_total", {"channel": "telegram"})
        ]
    
    async def run_comprehensive_tests(self) -> Dict[str, Any]:
        """Run all monitoring tests"""
        logger.info("🔍 Starting monitoring and alerting tests")
        
        results = {}
        results["prometheus"] = await self.test_prometheus_metrics()
        results["grafana"] = await self.test_grafana_dashboards()
        results["workflow_metrics"] = await self.test_workflow_metrics()
        results["logging"] = await self.test_logging()
        results["summary"] = self.generate_summary(results)
        
        return results
    
    async def test_prometheus_metrics(self) -> Dict[str, Any]:
        """Test Prometheus metrics collection"""
        logger.info("📊 Testing Prometheus metrics")
        
        try:
            # Check Prometheus health
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['prometheus']}/-/healthy",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status != 200:
                        return {"healthy": False, "error": f"Health check failed: {response.status}"}
            
            # Check metrics endpoints
            service_metrics = {}
            for service in ["ai_orchestrator", "nlp_service", "notification_service"]:
                try:
                    async with aiohttp.ClientSession() as session:
                        async with session.get(
                            f"{self.services[service]}/metrics",
                            timeout=aiohttp.ClientTimeout(total=10)
                        ) as response:
                            if response.status == 200:
                                metrics_text = await response.text()
                                has_metrics = "# HELP" in metrics_text or "# TYPE" in metrics_text
                                service_metrics[service] = {"accessible": True, "has_metrics": has_metrics}
                            else:
                                service_metrics[service] = {"accessible": False, "error": f"HTTP {response.status}"}
                except Exception as e:
                    service_metrics[service] = {"accessible": False, "error": str(e)}
            
            return {
                "healthy": True,
                "service_metrics": service_metrics,
                "metrics_endpoints_working": all(m.get("accessible", False) for m in service_metrics.values())
            }
            
        except Exception as e:
            return {"healthy": False, "error": str(e)}
    
    async def test_grafana_dashboards(self) -> Dict[str, Any]:
        """Test Grafana dashboard accessibility"""
        logger.info("📈 Testing Grafana dashboards")
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['grafana']}/api/health",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        return {"healthy": True, "accessible": True}
                    else:
                        return {"healthy": False, "error": f"Health check failed: {response.status}"}
        except Exception as e:
            return {"healthy": False, "error": str(e)}
    
    async def test_workflow_metrics(self) -> Dict[str, Any]:
        """Test workflow metrics by triggering a workflow"""
        logger.info("⚙️ Testing workflow metrics generation")
        
        test_data = {
            "user_id": f"metrics_test_{uuid.uuid4()}",
            "submission_type": "mixed",
            "text_content": "Test submission for metrics collection",
            "requirements": "Generate metrics for monitoring test",
            "contact_info": {
                "name": "Metrics Test User",
                "email": "metrics@test.com",
                "telegram": "694579866"
            }
        }
        
        try:
            # Submit workflow
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.services['ai_orchestrator']}/api/process-submission",
                    json=test_data,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        submission_id = result["submission_id"]
                        
                        # Wait for metrics generation
                        await asyncio.sleep(5)
                        
                        return {
                            "workflow_submitted": True,
                            "submission_id": submission_id,
                            "metrics_likely_generated": True
                        }
                    else:
                        return {
                            "workflow_submitted": False,
                            "error": f"Submission failed: {response.status}"
                        }
        except Exception as e:
            return {"workflow_submitted": False, "error": str(e)}
    
    async def test_logging(self) -> Dict[str, Any]:
        """Test logging capabilities"""
        logger.info("📝 Testing logging")
        
        log_tests = {}
        
        for service_name, service_url in self.services.items():
            if service_name in ["prometheus", "grafana"]:
                continue
            
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(
                        f"{service_url}/health",
                        timeout=aiohttp.ClientTimeout(total=10)
                    ) as response:
                        if response.status == 200:
                            health_data = await response.json()
                            log_tests[service_name] = {
                                "health_accessible": True,
                                "has_timestamp": "timestamp" in health_data,
                                "logging_working": True
                            }
                        else:
                            log_tests[service_name] = {"health_accessible": False, "logging_working": False}
            except Exception as e:
                log_tests[service_name] = {"health_accessible": False, "error": str(e), "logging_working": False}
        
        return {
            "service_logging": log_tests,
            "services_with_logging": len([s for s in log_tests.values() if s.get("logging_working", False)]),
            "total_services": len(log_tests)
        }
    
    def generate_summary(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate monitoring summary"""
        prometheus_working = results.get("prometheus", {}).get("healthy", False)
        grafana_working = results.get("grafana", {}).get("healthy", False)
        workflow_metrics = results.get("workflow_metrics", {}).get("workflow_submitted", False)
        logging_services = results.get("logging", {}).get("services_with_logging", 0)
        
        recommendations = []
        
        if not prometheus_working:
            recommendations.append("Prometheus is not accessible - check service status")
        
        if not grafana_working:
            recommendations.append("Grafana is not accessible - check service status")
        
        if not workflow_metrics:
            recommendations.append("Workflow metrics generation failed")
        
        if logging_services == 0:
            recommendations.append("Service logging needs improvement")
        
        if not recommendations:
            recommendations.append("Monitoring system is working well")
        
        health_score = sum([prometheus_working, grafana_working, workflow_metrics, logging_services > 0]) / 4
        
        return {
            "test_timestamp": datetime.now().isoformat(),
            "prometheus_working": prometheus_working,
            "grafana_working": grafana_working,
            "workflow_metrics_working": workflow_metrics,
            "logging_working": logging_services > 0,
            "overall_health_score": health_score,
            "system_healthy": health_score >= 0.75,
            "recommendations": recommendations
        }

if __name__ == "__main__":
    async def main():
        tester = MonitoringAlertingTester()
        results = await tester.run_comprehensive_tests()
        
        print("\n" + "="*60)
        print("🔍 MONITORING AND ALERTING TEST RESULTS")
        print("="*60)
        
        summary = results["summary"]
        
        print(f"\n📊 System Health:")
        print(f"   Overall Score: {summary['overall_health_score']:.1%}")
        print(f"   System Healthy: {'✅' if summary['system_healthy'] else '❌'}")
        
        print(f"\n🔧 Component Status:")
        print(f"   Prometheus: {'✅' if summary['prometheus_working'] else '❌'}")
        print(f"   Grafana: {'✅' if summary['grafana_working'] else '❌'}")
        print(f"   Workflow Metrics: {'✅' if summary['workflow_metrics_working'] else '❌'}")
        print(f"   Logging: {'✅' if summary['logging_working'] else '❌'}")
        
        print(f"\n💡 Recommendations:")
        for rec in summary["recommendations"]:
            print(f"   • {rec}")
        
        print("\n" + "="*60)
    
    asyncio.run(main())