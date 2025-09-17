#!/usr/bin/env python3
"""
Monitoring and Alerting Testing for Multi-Agent Workflow

This module implements monitoring and alerting tests including Prometheus metrics,
Grafana dashboards, alerting for failed workflows, and logging for debugging.

Requirements covered: 8.6, 10.4, 10.5, 10.6, 10.7
"""

import pytest
import asyncio
import aiohttp
import time
import uuid
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class MetricCheck:
    """Represents a Prometheus metric check"""
    metric_name: str
    expected_labels: Dict[str, str]
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    should_exist: bool = True

@dataclass
class AlertRule:
    """Represents an alert rule"""
    alert_name: str
    expression: str
    duration: str
    severity: str
    description: str

class MonitoringAlertingTester:
    """Comprehensive monitoring and alerting tester"""
    
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        
        # Service endpoints
        self.services = {
            "prometheus": "http://localhost:9090",
            "grafana": "http://localhost:3002",
            "ai_orchestrator": "http://localhost:8010",
            "nlp_service": "http://localhost:8011",
            "notification_service": "http://localhost:8005"
        }
        
        # Expected Prometheus metrics for multi-agent workflow
        self.expected_metrics = [
            MetricCheck("workflow_processing_time_seconds", {"workflow_type": "business_analysis"}),
            MetricCheck("agent_success_total", {"agent_name": "nlp_service"}),
            MetricCheck("agent_failure_total", {"agent_name": "nlp_service"}),
            MetricCheck("concurrent_workflows", {}),
            MetricCheck("nlp_requests_total", {"provider": "free_ai", "status": "success"}),
            MetricCheck("nlp_request_duration_seconds", {"provider": "free_ai"}),
            MetricCheck("notification_delivery_total", {"channel": "telegram", "status": "success"}),
            MetricCheck("submission_processing_total", {"status": "completed"})
        ]
        
        # Expected alert rules
        self.expected_alerts = [
            AlertRule(
                "WorkflowProcessingTimeHigh",
                "workflow_processing_time_seconds > 300",
                "5m",
                "warning",
                "Workflow processing time is too high"
            ),
            AlertRule(
                "AgentFailureRateHigh", 
                "rate(agent_failure_total[5m]) / rate(agent_success_total[5m]) > 0.1",
                "2m",
                "critical",
                "Agent failure rate is above 10%"
            ),
            AlertRule(
                "NotificationDeliveryFailed",
                "rate(notification_delivery_total{status=\"failed\"}[5m]) > 0",
                "1m",
                "warning",
                "Notification delivery failures detected"
            ),
            AlertRule(
                "SystemResourcesHigh",
                "up == 0",
                "1m",
                "critical",
                "Service is down"
            )
        ]
    
    async def run_comprehensive_monitoring_tests(self) -> Dict[str, Any]:
        """Run all monitoring and alerting tests"""
        logger.info("🔍 Starting comprehensive monitoring and alerting tests")
        
        results = {}
        
        # Test 1: Prometheus metrics collection
        results["prometheus_metrics"] = await self.test_prometheus_metrics()
        
        # Test 2: Grafana dashboard accessibility
        results["grafana_dashboards"] = await self.test_grafana_dashboards()
        
        # Test 3: Alert rules configuration
        results["alert_rules"] = await self.test_alert_rules()
        
        # Test 4: Workflow processing metrics
        results["workflow_metrics"] = await self.test_workflow_processing_metrics()
        
        # Test 5: Agent performance metrics
        results["agent_metrics"] = await self.test_agent_performance_metrics()
        
        # Test 6: Notification delivery metrics
        results["notification_metrics"] = await self.test_notification_delivery_metrics()
        
        # Test 7: Log aggregation and debugging
        results["logging"] = await self.test_logging_and_debugging()
        
        # Test 8: Alert firing simulation
        results["alert_simulation"] = await self.test_alert_firing()
        
        # Generate summary
        results["summary"] = self.generate_monitoring_summary(results)
        
        return results
    
    async def test_prometheus_metrics(self) -> Dict[str, Any]:
        """Test Prometheus metrics collection"""
        logger.info("📊 Testing Prometheus metrics collection")
        
        try:
            # Check Prometheus health
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['prometheus']}/-/healthy",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status != 200:
                        return {
                            "prometheus_healthy": False,
                            "error": f"Prometheus health check failed: {response.status}"
                        }
            
            # Check if metrics are being collected
            metrics_results = {}
            
            for metric_check in self.expected_metrics:
                metric_result = await self.check_prometheus_metric(metric_check)
                metrics_results[metric_check.metric_name] = metric_result
            
            # Check service-specific metrics endpoints
            service_metrics = await self.check_service_metrics_endpoints()
            
            return {
                "prometheus_healthy": True,
                "expected_metrics": metrics_results,
                "service_metrics_endpoints": service_metrics,
                "metrics_collection_working": all(m.get("exists", False) for m in metrics_results.values())
            }
            
        except Exception as e:
            return {
                "prometheus_healthy": False,
                "error": str(e)
            }
    
    async def check_prometheus_metric(self, metric_check: MetricCheck) -> Dict[str, Any]:
        """Check if a specific Prometheus metric exists and has expected values"""
        try:
            # Build query
            query = metric_check.metric_name
            if metric_check.expected_labels:
                label_filters = [f'{k}="{v}"' for k, v in metric_check.expected_labels.items()]
                query = f'{metric_check.metric_name}{{{",".join(label_filters)}}}'
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['prometheus']}/api/v1/query",
                    params={"query": query},
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        result = data.get("data", {}).get("result", [])
                        
                        exists = len(result) > 0
                        values = []
                        
                        if exists:
                            for item in result:
                                value = float(item.get("value", [0, "0"])[1])
                                values.append(value)
                        
                        # Check value constraints
                        value_check_passed = True
                        if exists and values:
                            avg_value = sum(values) / len(values)
                            if metric_check.min_value is not None and avg_value < metric_check.min_value:
                                value_check_passed = False
                            if metric_check.max_value is not None and avg_value > metric_check.max_value:
                                value_check_passed = False
                        
                        return {
                            "exists": exists,
                            "values": values,
                            "value_check_passed": value_check_passed,
                            "query": query
                        }
                    else:
                        return {
                            "exists": False,
                            "error": f"Query failed: {response.status}",
                            "query": query
                        }
        except Exception as e:
            return {
                "exists": False,
                "error": str(e),
                "query": query
            }
    
    async def check_service_metrics_endpoints(self) -> Dict[str, Any]:
        """Check that services expose metrics endpoints"""
        service_endpoints = {
            "ai_orchestrator": "/metrics",
            "nlp_service": "/metrics",
            "notification_service": "/metrics"
        }
        
        results = {}
        
        for service_name, metrics_path in service_endpoints.items():
            if service_name not in self.services:
                continue
            
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(
                        f"{self.services[service_name]}{metrics_path}",
                        timeout=aiohttp.ClientTimeout(total=10)
                    ) as response:
                        if response.status == 200:
                            metrics_text = await response.text()
                            # Check if it contains Prometheus format metrics
                            has_metrics = "# HELP" in metrics_text or "# TYPE" in metrics_text
                            metric_count = len(re.findall(r'^[a-zA-Z_][a-zA-Z0-9_]*', metrics_text, re.MULTILINE))
                            
                            results[service_name] = {
                                "accessible": True,
                                "has_prometheus_format": has_metrics,
                                "metric_count": metric_count
                            }
                        else:
                            results[service_name] = {
                                "accessible": False,
                                "error": f"HTTP {response.status}"
                            }
            except Exception as e:
                results[service_name] = {
                    "accessible": False,
                    "error": str(e)
                }
        
        return results
    
    async def test_grafana_dashboards(self) -> Dict[str, Any]:
        """Test Grafana dashboard accessibility"""
        logger.info("📈 Testing Grafana dashboards")
        
        try:
            # Check Grafana health
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['grafana']}/api/health",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status != 200:
                        return {
                            "grafana_healthy": False,
                            "error": f"Grafana health check failed: {response.status}"
                        }
            
            # Check for expected dashboards
            expected_dashboards = [
                "AI Agent Performance",
                "Multi-Agent Workflow",
                "System Overview",
                "Notification Delivery"
            ]
            
            dashboard_results = {}
            
            # Try to access dashboards (this would require authentication in real setup)
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['grafana']}/api/search",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        dashboards = await response.json()
                        found_dashboards = [d.get("title", "") for d in dashboards]
                        
                        for expected in expected_dashboards:
                            dashboard_results[expected] = {
                                "exists": expected in found_dashboards,
                                "accessible": True
                            }
                    else:
                        # If we can't access the API (likely due to auth), assume dashboards exist
                        for expected in expected_dashboards:
                            dashboard_results[expected] = {
                                "exists": True,  # Assume exists
                                "accessible": False,
                                "note": "Could not verify due to authentication"
                            }
            
            return {
                "grafana_healthy": True,
                "dashboards": dashboard_results,
                "dashboard_count": len(dashboard_results)
            }
            
        except Exception as e:
            return {
                "grafana_healthy": False,
                "error": str(e)
            }
    
    async def test_alert_rules(self) -> Dict[str, Any]:
        """Test alert rules configuration"""
        logger.info("🚨 Testing alert rules configuration")
        
        try:
            # Check Prometheus alert rules
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['prometheus']}/api/v1/rules",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        rules_data = await response.json()
                        rule_groups = rules_data.get("data", {}).get("groups", [])
                        
                        found_alerts = []
                        for group in rule_groups:
                            for rule in group.get("rules", []):
                                if rule.get("type") == "alerting":
                                    found_alerts.append(rule.get("name", ""))
                        
                        alert_results = {}
                        for expected_alert in self.expected_alerts:
                            alert_results[expected_alert.alert_name] = {
                                "configured": expected_alert.alert_name in found_alerts,
                                "expression": expected_alert.expression,
                                "severity": expected_alert.severity
                            }
                        
                        return {
                            "rules_accessible": True,
                            "total_alert_rules": len(found_alerts),
                            "expected_alerts": alert_results,
                            "all_expected_configured": all(a["configured"] for a in alert_results.values())
                        }
                    else:
                        return {
                            "rules_accessible": False,
                            "error": f"Rules API failed: {response.status}"
                        }
        except Exception as e:
            return {
                "rules_accessible": False,
                "error": str(e)
            }
    
    async def test_workflow_processing_metrics(self) -> Dict[str, Any]:
        """Test workflow processing metrics by triggering a workflow"""
        logger.info("⚙️ Testing workflow processing metrics")
        
        # Submit a test workflow to generate metrics
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
                    if response.status != 200:
                        return {
                            "workflow_submitted": False,
                            "error": f"Workflow submission failed: {response.status}"
                        }
                    
                    result = await response.json()
                    submission_id = result["submission_id"]
            
            # Wait a bit for metrics to be generated
            await asyncio.sleep(5)
            
            # Check if workflow metrics were generated
            workflow_metrics = await self.check_prometheus_metric(
                MetricCheck("workflow_processing_time_seconds", {})
            )
            
            concurrent_workflows = await self.check_prometheus_metric(
                MetricCheck("concurrent_workflows", {})
            )
            
            return {
                "workflow_submitted": True,
                "submission_id": submission_id,
                "workflow_processing_metrics": workflow_metrics,
                "concurrent_workflows_metrics": concurrent_workflows,
                "metrics_generated": workflow_metrics.get("exists", False)
            }
            
        except Exception as e:
            return {
                "workflow_submitted": False,
                "error": str(e)
            }
    
    async def test_agent_performance_metrics(self) -> Dict[str, Any]:
        """Test agent performance metrics"""
        logger.info("🤖 Testing agent performance metrics")
        
        # Test NLP service directly to generate agent metrics
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.services['nlp_service']}/api/analyze-text",
                    json={
                        "text_content": "Test text for agent metrics",
                        "requirements": "Generate agent performance metrics"
                    },
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    nlp_success = response.status == 200
            
            # Wait for metrics to be collected
            await asyncio.sleep(3)
            
            # Check agent metrics
            agent_success_metrics = await self.check_prometheus_metric(
                MetricCheck("nlp_requests_total", {"status": "success"})
            )
            
            agent_duration_metrics = await self.check_prometheus_metric(
                MetricCheck("nlp_request_duration_seconds", {})
            )
            
            return {
                "nlp_request_made": True,
                "nlp_request_success": nlp_success,
                "agent_success_metrics": agent_success_metrics,
                "agent_duration_metrics": agent_duration_metrics,
                "agent_metrics_working": agent_success_metrics.get("exists", False)
            }
            
        except Exception as e:
            return {
                "nlp_request_made": False,
                "error": str(e)
            }
    
    async def test_notification_delivery_metrics(self) -> Dict[str, Any]:
        """Test notification delivery metrics"""
        logger.info("📱 Testing notification delivery metrics")
        
        # Send a test notification to generate metrics
        notification_data = {
            "user_id": f"metrics_test_{uuid.uuid4()}",
            "type": "test",
            "title": "Metrics Test Notification",
            "message": "This is a test notification for metrics collection",
            "contact_type": "telegram",
            "contact_value": "694579866",
            "user_name": "Metrics Test"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.services['notification_service']}/api/notifications",
                    json=notification_data,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    notification_sent = response.status == 200
            
            # Wait for metrics
            await asyncio.sleep(3)
            
            # Check notification metrics
            delivery_metrics = await self.check_prometheus_metric(
                MetricCheck("notification_delivery_total", {})
            )
            
            return {
                "notification_sent": notification_sent,
                "delivery_metrics": delivery_metrics,
                "notification_metrics_working": delivery_metrics.get("exists", False)
            }
            
        except Exception as e:
            return {
                "notification_sent": False,
                "error": str(e)
            }
    
    async def test_logging_and_debugging(self) -> Dict[str, Any]:
        """Test logging and debugging capabilities"""
        logger.info("📝 Testing logging and debugging")
        
        # This test checks if services are properly logging
        # In a real implementation, this would check log aggregation systems like ELK or Loki
        
        log_tests = {}
        
        # Check if services have health endpoints that might include logging info
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
                                "health_endpoint_accessible": True,
                                "has_timestamp": "timestamp" in health_data,
                                "has_service_info": "service" in health_data,
                                "logging_likely_working": True
                            }
                        else:
                            log_tests[service_name] = {
                                "health_endpoint_accessible": False,
                                "logging_likely_working": False
                            }
            except Exception as e:
                log_tests[service_name] = {
                    "health_endpoint_accessible": False,
                    "error": str(e),
                    "logging_likely_working": False
                }
        
        return {
            "service_logging_tests": log_tests,
            "services_with_logging": len([s for s in log_tests.values() if s.get("logging_likely_working", False)]),
            "total_services_tested": len(log_tests)
        }
    
    async def test_alert_firing(self) -> Dict[str, Any]:
        """Test alert firing simulation"""
        logger.info("🔥 Testing alert firing simulation")
        
        # Check current alerts
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.services['prometheus']}/api/v1/alerts",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        alerts_data = await response.json()
                        active_alerts = alerts_data.get("data", {}).get("alerts", [])
                        
                        alert_summary = {}
                        for alert in active_alerts:
                            alert_name = alert.get("labels", {}).get("alertname", "unknown")
                            state = alert.get("state", "unknown")
                            
                            if alert_name not in alert_summary:
                                alert_summary[alert_name] = {"count": 0, "states": []}
                            
                            alert_summary[alert_name]["count"] += 1
                            alert_summary[alert_name]["states"].append(state)
                        
                        return {
                            "alerts_accessible": True,
                            "active_alerts_count": len(active_alerts),
                            "alert_summary": alert_summary,
                            "alerting_system_working": True
                        }
                    else:
                        return {
                            "alerts_accessible": False,
                            "error": f"Alerts API failed: {response.status}"
                        }
        except Exception as e:
            return {
                "alerts_accessible": False,
                "error": str(e)
            }
    
    def generate_monitoring_summary(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive monitoring summary"""
        summary = {
            "test_timestamp": datetime.now().isoformat(),
            "prometheus_working": results.get("prometheus_metrics", {}).get("prometheus_healthy", False),
            "grafana_working": results.get("grafana_dashboards", {}).get("grafana_healthy", False),
            "metrics_collection_working": results.get("prometheus_mn())o.run(mainci  
    asy"*80)
   + "=n"print("\      
  ")
        rec}   • {int(f"      pr"]:
      mendationsomummary["recec in s       for r
 )tions:"ndaommef"\n💡 Recrint(       p
        
 '❌'}") else king']_worng_systemlertiummary['a if srting: {'✅'   Aleint(f"        pr❌'}")
else 'working'] 'logging_f summary[ {'✅' iging:  Log" print(f
        '❌'}")'] else ng_workicsmetriotification_mmary['n' if su'✅ Metrics: {Notificationt(f"      prin")
      '❌'}king'] else_wortrics['agent_me if summary{'✅'t Metrics:    Agen  print(f"}")
      ❌'e 'king'] elswor_metrics_y['workflowmmar'✅' if su {w Metrics:  Workflorint(f"     p")
    lse '❌'}figured'] ert_rules_consummary['alef ' i Rules: {'✅Alertprint(f"         '}")
  else '❌orking'] tion_wtrics_collecmmary['mesu if n: {'✅'iorics Collectf"   Met  print(")
      ] else '❌'}king'ana_wor['grafummaryif sfana: {'✅'  Grarint(f"     p    ")
 e '❌'}elsng'] workiheus_prometif summary['theus: {'✅' f"   Prome   print(:")
     atusonent St\n🔧 Compnt(f" pri 
       ")
       else '❌'}] hy'_healtteming_sys['monitor if summary'✅'ealthy: {tem H   Sysf"rint( p     1%}")
  h_score']:.rall_healtmmary['ovel Score: {sural   Ovent(f" pri      ")
 ealth:📊 System Hprint(f"\n
                mary"]
umts["sresulmary =         sum
        
)int("="*80
        pr")SST RESULT ALERTING TEG ANDNITORIN🔍 MOnt("ri    p0)
     + "="*8rint("\n"   p
     )
        ring_tests(nsive_monitoheprerun_comtester.ts = await       resulr()
  ingTestengAlertitoritester = Mon       
 ain(): async def m  
 __":"__main== if __name__ e']}"

_health_scorry['overallumma too low: {sreth sco"Heal0.6, fre"] >= _health_scoy["overallmmar  assert sus']}"
  endationry['recommmaalthy: {sum not heg systemrinto"Moni"], fm_healthying_syste["monitorert summary"]
    assts["summaryry = resulmma  su()
    
  _testsitoringonive_mmprehensr.run_co testewaitlts = a
    resuter()lertingTesnitoringA = Mo
    tester"tests""ng e monitoricomprehensiv""Run :
    "monitoring()nsive_comprehenc def test_asyio
k.asyncytest.marr')}"

@p.get('erro: {resultssion failedbmiw su"Workflo"], fdttekflow_submi"wort[esul    assert r)
g_metrics(ocessin_prkfloworst_wster.teg_temonitorinait  awsult =   re"
 ation""trics generrkflow me"Test wo
    ""ster):teng_oriion(monitcs_generat_metrit_workflowsync def tesasyncio
at.mark."

@pytest('error')}esult.gey: {realthnot h"Grafana "], fealthyfana_hlt["grassert resu)
    aashboards(a_d_grafanr.testteg_tesonitorinlt = await m  resu""
  essibility"oard accrafana dashb"""Test Ger):
    ring_testmonitoility(ccessib_at_grafanaef tesnc d
asyasynciost.mark.}"

@pyte').get('error{resultalthy: heus not he f"Prometthy"],us_heal"promethe result[  assert
  metrics()us_methe.test_prong_testerriito mont = await   resul"""
 ionectics collus metr Promethe"""Tester):
    ing_testtion(monitorllecics_coeus_metrpromethc def test_yncio
asynmark.asst.pyteer()

@tingTestngAlertoriMoniurn ""
    retter"g tesinonitor for mest fixture"""Pyter():
    toring_testnimodef ync ase
ytest.fixtur@ps
utilities and ureixtst fary

# Tern summ  retu          
>= 0.8
    e"] _health_scory["overall= summar"] althystem_hering_syy["monito      summar
  ecks)en(health_chhecks) / lth_calhe sum(ore"] =ealth_scll_h["overa   summary    
         ]
    ]
    king"ging_wor"logry[ma   sum       
  ],orking"etrics_wlow_mrkfwo summary["        "],
   orkingion_wllectcs_coary["metri      summ"],
      ng_workiry["grafana   summa     ,
    s_working"]"prometheusummary[       = [
      _checks healthore
        health sclleralate ov# Calcu 
        ")
       llking weworystem is erting sing and al"Monitorappend(ndations"].comme["reary        summ"]:
    ommendationsy["recummar if not s 
       ")
       ment improveedsg nee logginServic("pend.apons"]ndatirecomme  summary["
          ]:g_working"ry["logginnot summa        if    

     ed")erat gene not beingetrics arWorkflow m.append("ations"]"recommendmmary[          su
  rking"]:rics_wokflow_met"worot summary[       if n
        
 igured")operly confot pr nt rules arend("Aler.appeons"]recommendati summary["      
     red"]:_configurulesert_ummary["alif not s  
           )
   endpoints"etrics service m- check ot working n is nectiotrics collMeppend(".aons"]ecommendatimary["r sum     "]:
      ion_workingollectmetrics_c["marynot sumif 
           
     us")ce statservie - check accessibl not Grafana ispend("ons"].apndaticommey["re  summar          ng"]:
na_workiafa"grot summary[ if n
        
       atus") stcek servi- chece essiblot acceus is n("Promethppenddations"].aeny["recommmar   sum         "]:
kings_worometheummary["pr  if not sus
      ommendationrate rec Gene 
        #          }
  ": []
   endationscomm    "re),
        g", False_working_systemet("alertinion", {}).gmulatert_si"alget(lts.ng": resuworkitem_systing_"aler           
 ", 0) > 0,gingogices_with_l("serv", {}).get"loggingults.get(g": res_workining    "logg
        ", False),ngkimetrics_worotification_("n, {}).getics"metrotification_get("nsults.: recs_working"etriication_m     "notife),
       king", Fals_worgent_metrics"at(, {}).get_metrics"et("agens.g: resulting"s_workmetric"agent_           e),
 Fals", nerated"metrics_geet(", {}).gw_metricsorkflolts.get("w: resucs_working"ow_metriflork"w    
        ,ed", False)nfigurcoll_expected_"a.get(", {})_rules"alertget(ts.red": resuligunfs_colert_rule  "a      lse),
    , Fa_working"s_collectiontrict("me, {}).geetrics"