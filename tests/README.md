# Multi-Agent Workflow Testing Framework

This comprehensive testing framework validates the multi-agent AI orchestration workflow for the StateX contact form system. It covers end-to-end workflow testing, performance analysis, and monitoring verification.

## Requirements Coverage

This testing framework covers the following requirements from the specification:

### End-to-End Testing (8.1-8.7)
- **8.1**: Automated testing of complete form-to-notification workflow
- **8.2**: Testing with various input combinations (text only, voice only, files only, mixed)
- **8.3**: Verification of AI agent coordination and result aggregation
- **8.4**: Testing error scenarios and recovery mechanisms
- **8.5**: Verification of notification delivery
- **8.6**: Real-time processing feedback testing
- **8.7**: Comprehensive test reporting

### Performance Testing (9.1-9.7)
- **9.1**: Single request performance baseline testing
- **9.2**: Concurrent form submissions testing
- **9.3**: AI agent processing time measurement
- **9.4**: System throughput testing
- **9.5**: Resource constraints testing
- **9.6**: Timeout handling testing
- **9.7**: Queue management testing

### Monitoring & Alerting (10.4-10.7)
- **10.4**: Prometheus metrics verification
- **10.5**: Grafana dashboards accessibility testing
- **10.6**: Alert rules configuration testing
- **10.7**: Logging and debugging verification

## Framework Structure

```
tests/
├── e2e/                          # End-to-end workflow tests
│   └── test_multi_agent_workflow.py
├── performance/                  # Performance and load tests
│   └── load_tester.py
├── monitoring/                   # Monitoring and alerting tests
│   └── monitoring_tester.py
├── test_runner.py               # Comprehensive test runner
├── pytest.ini                  # Pytest configuration
├── requirements.txt             # Testing dependencies
└── README.md                    # This file
```

## Installation

1. Install Python dependencies:
```bash
pip install -r tests/requirements.txt
```

2. Ensure all StateX services are running:
```bash
# Start the development environment
./dev-manage.sh start
```

## Usage

### Run All Tests
```bash
# Run comprehensive test suite
python tests/test_runner.py

# Or using pytest
pytest tests/ -v
```

### Run Specific Test Suites
```bash
# End-to-end tests only
python tests/test_runner.py --e2e-only

# Performance tests only
python tests/test_runner.py --performance-only

# Monitoring tests only
python tests/test_runner.py --monitoring-only
```

### Run Individual Test Modules
```bash
# End-to-end workflow tests
python tests/e2e/test_multi_agent_workflow.py

# Performance and load tests
python tests/performance/load_tester.py

# Monitoring and alerting tests
python tests/monitoring/monitoring_tester.py
```

### Pytest Commands
```bash
# Run with specific markers
pytest tests/ -m "e2e"           # End-to-end tests
pytest tests/ -m "performance"   # Performance tests
pytest tests/ -m "monitoring"    # Monitoring tests

# Run with coverage (if pytest-cov installed)
pytest tests/ --cov=tests --cov-report=html

# Run in parallel (if pytest-xdist installed)
pytest tests/ -n auto
```

## Test Scenarios

### End-to-End Test Scenarios
1. **Text Only**: Submit form with only text content
2. **Voice Only**: Submit form with only voice recording
3. **Files Only**: Submit form with only file uploads
4. **Mixed Input**: Submit form with text, voice, and files
5. **Error Recovery**: Test error handling and graceful degradation

### Performance Test Scenarios
1. **Baseline Performance**: Single request processing time
2. **Concurrent Load**: 2, 5, 10, 20 concurrent users
3. **Agent Performance**: Individual AI agent processing times
4. **System Throughput**: Maximum requests per second
5. **Resource Constraints**: High load system behavior
6. **Timeout Handling**: Short timeout scenarios
7. **Queue Management**: Rapid request submission

### Monitoring Test Scenarios
1. **Prometheus Metrics**: Verify metrics collection
2. **Grafana Dashboards**: Check dashboard accessibility
3. **Alert Rules**: Validate alert configuration
4. **Workflow Metrics**: Test metrics generation
5. **Agent Metrics**: Verify agent performance metrics
6. **Notification Metrics**: Check delivery metrics
7. **Logging**: Validate log aggregation

## Expected Services

The testing framework expects the following services to be running:

| Service | Port | Health Endpoint |
|---------|------|----------------|
| Website Frontend | 3000 | `/api/health` |
| Submission Service | 8002 | `/health` |
| AI Orchestrator | 8010 | `/health` |
| NLP Service | 8011 | `/health` |
| ASR Service | 8012 | `/health` |
| Document AI | 8013 | `/health` |
| Free AI Service | 8016 | `/health` |
| Notification Service | 8005 | `/health` |
| Prometheus | 9090 | `/-/healthy` |
| Grafana | 3002 | `/api/health` |

## Test Data

The framework uses realistic test data including:
- Business requirement descriptions
- Voice transcripts
- Document content
- Contact information
- Various input combinations

## Metrics and Reporting

### Test Metrics
- Success rates
- Processing times
- Error rates
- Resource usage
- Agent performance

### Reports Generated
- Comprehensive test report (JSON)
- Requirements coverage analysis
- System health assessment
- Performance benchmarks
- Recommendations and next steps

## Configuration

### Environment Variables
```bash
# Service URLs (optional, defaults to localhost)
AI_ORCHESTRATOR_URL=http://localhost:8010
NLP_SERVICE_URL=http://localhost:8011
NOTIFICATION_SERVICE_URL=http://localhost:8005
PROMETHEUS_URL=http://localhost:9090
GRAFANA_URL=http://localhost:3002

# Test configuration
TEST_TIMEOUT=300
CONCURRENT_USERS=5
PERFORMANCE_BASELINE_THRESHOLD=60
```

### Pytest Configuration
See `pytest.ini` for detailed pytest configuration including:
- Test discovery patterns
- Async support
- Markers
- Timeout settings
- Logging configuration

## Troubleshooting

### Common Issues

1. **Service Not Available**
   - Ensure all StateX services are running
   - Check service health endpoints
   - Verify port configurations

2. **Test Timeouts**
   - Increase timeout values in configuration
   - Check system resources
   - Verify AI service performance

3. **Permission Errors**
   - Ensure proper file permissions
   - Check network access to services
   - Verify authentication if required

4. **Performance Test Failures**
   - Check system resources
   - Reduce concurrent user count
   - Verify baseline performance first

### Debug Mode
```bash
# Run with verbose logging
python tests/test_runner.py --verbose

# Run single test for debugging
pytest tests/e2e/test_multi_agent_workflow.py::test_text_only_workflow -v -s
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use appropriate markers (`@pytest.mark.e2e`, etc.)
3. Include comprehensive error handling
4. Add proper logging and assertions
5. Update requirements coverage mapping
6. Document new test scenarios

## Integration with CI/CD

This testing framework is designed to integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Multi-Agent Workflow Tests
  run: |
    pip install -r tests/requirements.txt
    python tests/test_runner.py
  timeout-minutes: 30
```

## Performance Benchmarks

### Expected Performance Targets
- Single request: < 60 seconds
- Concurrent 5 users: > 80% success rate
- Agent processing: < 30 seconds average
- System throughput: > 1 request/second
- Error rate: < 10% under load

### Resource Usage Targets
- CPU usage: < 80% under load
- Memory usage: < 80% under load
- Response time P95: < 120 seconds
- Response time P99: < 180 seconds

## Monitoring Integration

The framework integrates with:
- **Prometheus**: Metrics collection and querying
- **Grafana**: Dashboard accessibility verification
- **Alert Manager**: Alert rule validation
- **Logging Systems**: Log aggregation verification

## Security Considerations

- Test data uses placeholder information
- No sensitive data in test configurations
- Service authentication handled via environment variables
- Network access limited to test environment