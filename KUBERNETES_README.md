# StateX Kubernetes Production Setup

## Overview

This guide provides a complete Kubernetes setup for deploying StateX in production using a microservices architecture with proper scaling, monitoring, and security configurations.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                       │
├─────────────────────────────────────────────────────────────┤
│  Namespace: statex-production                              │
├─────────────────────────────────────────────────────────────┤
│  Stateful Services (StatefulSets)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ PostgreSQL  │ │   Redis     │ │  RabbitMQ   │          │
│  │   (15GB)    │ │   (10GB)    │ │   (10GB)    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Application Services (Deployments)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ StateX      │ │ StateX AI   │ │ StateX      │          │
│  │ Platform    │ │ Services    │ │ Notification│          │
│  │ (5 replicas)│ │ (3 replicas)│ │ (3 replicas)│          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Frontend & API Services                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         StateX Website (5 replicas)                │    │
│  │  • Next.js Frontend (Port 3000)                    │    │
│  │  • Submission Service (Port 8002)                   │    │
│  │  • User Portal (Port 8006)                         │    │
│  │  • Content Service (Port 8009)                      │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure & Monitoring                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Nginx     │ │ Prometheus  │ │   Grafana   │          │
│  │  Ingress    │ │ (2 replicas)│ │ (2 replicas)│          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Storage & Networking                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Persistent  │ │   Services  │ │   Ingress   │          │
│  │  Volumes    │ │  & Load     │ │  Controller │          │
│  │ (Fast SSD)  │ │ Balancers   │ │  (Nginx)    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

### Required Tools
- **kubectl** (v1.27+)
- **kustomize** (v0.14+)
- **helm** (v3.12+) - Optional for package management

### Infrastructure Requirements
- **Kubernetes Cluster** (v1.27+)
  - Minimum: 3 nodes (t3.medium or equivalent)
  - Recommended: 5+ nodes with auto-scaling
- **Storage Class**: Fast SSD (e.g., `awsElasticBlockStore`, `azureDisk`, `gcePersistentDisk`)
- **Load Balancer**: For external access (AWS NLB, Azure Load Balancer, GCP Load Balancer)

### Domain & SSL
- **Domain**: statex.cz (configured)
- **SSL Certificate**: Let's Encrypt (automated via cert-manager)

## Quick Start

### 1. Prerequisites Setup

```bash
# Install required tools
brew install kubectl kustomize helm

# Configure kubectl (if not already done)
aws eks update-kubeconfig --region eu-central-1 --name statex-cluster
# OR
gcloud container clusters get-credentials statex-cluster --region europe-central2
# OR
az aks get-credentials --resource-group statex-rg --name statex-cluster
```

### 2. Deploy Infrastructure

```bash
# Make deployment script executable and run
chmod +x deploy-k8s.sh
./deploy-k8s.sh production
```

### 3. Verify Deployment

```bash
# Check all resources
kubectl get all,ingress,secrets,pvc -n statex-production

# Check logs if needed
kubectl logs -l app=statex-platform -n statex-production

# Check resource usage
kubectl top pods -n statex-production
```

### 4. Access Your Application

```bash
# Website
open https://statex.cz

# API Gateway
curl https://api.statex.cz/health

# Grafana Dashboard (admin/statex123)
open https://grafana.statex.cz
```

## Configuration

### Environment Variables

Create a `.env.production` file or set these environment variables:

```bash
# Database
DB_PASSWORD="your-secure-db-password"
DB_NAME="statex"

# Redis
REDIS_PASSWORD="your-redis-password"

# RabbitMQ
RABBITMQ_PASSWORD="your-rabbitmq-password"

# JWT & API Keys
JWT_SECRET="your-jwt-secret"
OPENAI_API_KEY="your-openai-key"

# SMTP
SMTP_PASSWORD="your-smtp-password"

# SSL (auto-managed by cert-manager)
SSL_EMAIL="admin@statex.cz"
```

### Secrets Management

```bash
# Create/update secrets
kubectl create secret generic statex-secrets \
  --namespace=statex-production \
  --from-literal=DB_PASSWORD="$DB_PASSWORD" \
  --from-literal=REDIS_PASSWORD="$REDIS_PASSWORD" \
  --from-literal=OPENAI_API_KEY="$OPENAI_API_KEY" \
  --dry-run=client -o yaml | kubectl apply -f -
```

## Scaling

### Manual Scaling

```bash
# Scale specific service
kubectl scale deployment statex-platform --replicas=10 -n statex-production

# Scale all services proportionally
kubectl scale deployment statex-platform statex-website --replicas=5 -n statex-production
```

### Auto-scaling (HPA)

```bash
# Enable horizontal pod autoscaler
kubectl autoscale deployment statex-platform --cpu-percent=70 --min=3 --max=10 -n statex-production

# Check HPA status
kubectl get hpa -n statex-production
```

### Vertical Scaling

```bash
# Update resource limits
kubectl patch deployment statex-ai -n statex-production --patch '{
  "spec": {
    "template": {
      "spec": {
        "containers": [{
          "name": "ai-orchestrator",
          "resources": {
            "requests": {"cpu": "2000m", "memory": "4Gi"},
            "limits": {"cpu": "4000m", "memory": "8Gi"}
          }
        }]
      }
    }
  }
}'
```

## Monitoring & Observability

### Dashboards

- **Grafana**: https://grafana.statex.cz
  - Platform metrics, AI performance, business KPIs
  - Default credentials: admin/statex123

- **Prometheus**: Direct access via kubectl port-forward
  ```bash
  kubectl port-forward svc/prometheus 9090:9090 -n statex-production
  ```

### Key Metrics to Monitor

1. **Application Metrics**
   - Request latency (P95, P99)
   - Error rates by service
   - AI processing time
   - Database query performance

2. **Infrastructure Metrics**
   - CPU/Memory usage per service
   - Pod restart counts
   - Network I/O
   - Storage utilization

3. **Business Metrics**
   - User submissions per hour
   - AI processing success rate
   - Notification delivery rates

### Custom Alerts

```bash
# High error rate alert
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-alerts
  namespace: statex-production
data:
  alerts.yml: |
    groups:
    - name: statex-alerts
      rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
EOF
```

## Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name> -n statex-production
   kubectl logs <pod-name> -n statex-production
   ```

2. **Services not accessible**
   ```bash
   kubectl get ingress -n statex-production
   kubectl describe ingress statex-ingress -n statex-production
   ```

3. **Database connection issues**
   ```bash
   kubectl exec -it deploy/postgres -n statex-production -- psql -U statex -d statex
   ```

4. **Certificate issues**
   ```bash
   kubectl get certificates -n statex-production
   kubectl describe certificate statex-tls-production -n statex-production
   ```

### Debug Commands

```bash
# Get all resources status
kubectl get all,ingress,pvc,secrets -n statex-production --show-labels

# Check resource usage
kubectl top nodes
kubectl top pods -n statex-production

# View logs for all services
kubectl logs -l app=statex-platform -n statex-production --tail=100

# Check service endpoints
kubectl get endpoints -n statex-production

# Port forward for local debugging
kubectl port-forward svc/statex-platform 8000:8000 -n statex-production
```

## Backup & Recovery

### Database Backup

```bash
# Create backup
kubectl exec deploy/postgres -n statex-production -- \
  pg_dump -U statex -d statex -F c -f /tmp/statex-backup.dump

# Copy backup to local
kubectl cp statex-production/postgres-0:/tmp/statex-backup.dump ./backup.dump
```

### Application Backup

```bash
# Backup Kubernetes resources
kubectl get all,ingress,configmap,secret,pvc -n statex-production -o yaml > statex-backup.yaml

# Backup persistent volumes (depends on your storage provider)
```

## Security

### Network Policies

The deployment includes network policies that:
- Allow internal communication within the namespace
- Restrict external access to necessary services only
- Block all external traffic by default

### SSL/TLS

- **cert-manager** automatically provisions Let's Encrypt certificates
- **mTLS** can be enabled for service-to-service communication
- **Security headers** configured via ingress annotations

### Secrets Management

- Secrets are base64 encoded in etcd
- Consider using external secret management (AWS Secrets Manager, Azure Key Vault, etc.)
- Regular rotation of sensitive credentials recommended

## Cost Optimization

### Right-sizing Resources

Monitor and adjust resource requests/limits based on actual usage:

```bash
# Check actual resource usage
kubectl top pods -n statex-production --containers

# Adjust based on findings
kubectl patch deployment statex-notification -n statex-production --patch '{
  "spec": {
    "template": {
      "spec": {
        "containers": [{
          "name": "notification-service",
          "resources": {
            "requests": {"cpu": "50m", "memory": "128Mi"}
          }
        }]
      }
    }
  }
}'
```

### Auto-scaling Configuration

```bash
# Set appropriate HPA targets
kubectl autoscale deployment statex-website --cpu-percent=50 --min=2 --max=10 -n statex-production
```

## Updates & Rollbacks

### Rolling Updates

```bash
# Update deployment image
kubectl set image deployment/statex-platform platform=statex/platform:v2.0.0 -n statex-production

# Check rollout status
kubectl rollout status deployment/statex-platform -n statex-production

# View rollout history
kubectl rollout history deployment/statex-platform -n statex-production
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/statex-platform -n statex-production

# Rollback to specific revision
kubectl rollout undo deployment/statex-platform --to-revision=2 -n statex-production
```

## Advanced Configuration

### Custom Storage Classes

```yaml
# For high-performance SSD storage
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs  # or appropriate provisioner
parameters:
  type: gp3
  fsType: ext4
  encrypted: "true"
allowVolumeExpansion: true
```

### Custom Ingress Configuration

For advanced ingress needs, modify the ingress annotations in `k8s/overlays/production/ingress-production.yaml`.

## Support

For issues or questions:

1. **Check logs**: `kubectl logs -l app=<service-name> -n statex-production`
2. **Check status**: `kubectl describe pod <pod-name> -n statex-production`
3. **Contact team**: <admin@statex.cz>

## Next Steps

After successful deployment:

1. **Set up monitoring alerts** for critical metrics
2. **Configure log aggregation** (Loki/Grafana stack included)
3. **Set up CI/CD pipeline** for automated deployments
4. **Configure backup schedules** for databases and persistent data
5. **Set up security scanning** for container images
6. **Implement blue-green or canary deployments** for zero-downtime updates

---

**Happy Deploying! 🚀**
