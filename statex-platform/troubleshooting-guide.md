# StateX Development Troubleshooting Guide

## Common Issues and Solutions

### Service Status Issues

#### 🟡 Warning Status - Service Running but Issues Detected

**Symptoms:**
- Service shows yellow warning indicator
- Container is running but health check fails
- Port is closed or not accessible
- Dependencies are missing

**Solutions:**
1. **Health Check Failed:**
   ```bash
   # Check service logs
   ./dev-manage.sh logs [service-name]
   
   # Restart specific service
   ./dev-manage.sh dev [service-name]
   
   # Check if service is responding
   curl http://localhost:[port]/health
   ```

2. **Port Not Accessible:**
   ```bash
   # Check if port is in use
   lsof -i :[port]
   
   # Kill process using the port
   kill -9 $(lsof -t -i:[port])
   
   # Restart service
   ./dev-manage.sh restart --fast
   ```

3. **Missing Dependencies:**
   ```bash
   # Check dependency status
   ./dev-manage.sh status
   
   # Start missing dependencies first
   ./dev-manage.sh dev [dependency-service]
   
   # Then start the dependent service
   ./dev-manage.sh dev [service-name]
   ```

#### 🔴 Error Status - Service Not Running

**Symptoms:**
- Service shows red error indicator
- Container not found or exited
- Service completely down

**Solutions:**
1. **Container Not Found:**
   ```bash
   # Check if container exists
   docker ps -a | grep [service-name]
   
   # Start the service
   ./dev-manage.sh dev [service-name]
   
   # If still failing, check Docker logs
   docker logs statex_[service-name]_dev
   ```

2. **Container Exited:**
   ```bash
   # Check exit reason
   docker logs statex_[service-name]_dev
   
   # Restart the service
   ./dev-manage.sh restart --fast
   
   # Check for resource issues
   docker stats
   ```

3. **Service Failed to Start:**
   ```bash
   # Check Docker status
   docker info
   
   # Check available resources
   docker system df
   
   # Clean up if needed
   ./dev-manage.sh clean --force
   ./dev-manage.sh start --fast
   ```

### Port Conflicts

**Symptoms:**
- "Port already in use" errors
- Services can't bind to ports
- Connection refused errors

**Solutions:**
1. **Find Process Using Port:**
   ```bash
   # Find process using specific port
   lsof -i :[port]
   
   # Find all StateX ports
   lsof -i :3000,8000,8001,8002,8005,8006,8007,8008,8009,8010,8011,8012,8013,8014,8015,8016,8017,9090,3002,3100,16686,9093,9100,8081,9115
   ```

2. **Kill Conflicting Processes:**
   ```bash
   # Kill specific process
   kill -9 $(lsof -t -i:[port])
   
   # Kill all StateX processes
   pkill -f statex
   ```

3. **Check for Other Docker Containers:**
   ```bash
   # List all running containers
   docker ps
   
   # Stop conflicting containers
   docker stop [container-name]
   ```

### Docker Issues

**Symptoms:**
- Docker commands fail
- Containers won't start
- Permission denied errors

**Solutions:**
1. **Docker Not Running:**
   ```bash
   # Start Docker Desktop
   open -a Docker
   
   # Or start Docker daemon
   sudo systemctl start docker
   ```

2. **Permission Issues:**
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Log out and back in
   # Or use newgrp
   newgrp docker
   ```

3. **Docker Resources:**
   ```bash
   # Check Docker resources
   docker system df
   
   # Clean up unused resources
   docker system prune -a
   
   # Check Docker logs
   docker logs [container-name]
   ```

### Network Issues

**Symptoms:**
- Services can't communicate
- Connection timeouts
- DNS resolution failures

**Solutions:**
1. **Check Docker Network:**
   ```bash
   # List Docker networks
   docker network ls
   
   # Check if statex_network exists
   docker network inspect statex_network
   
   # Recreate network if needed
   docker network rm statex_network
   docker network create statex_network --driver bridge
   ```

2. **Check Service Connectivity:**
   ```bash
   # Test internal connectivity
   docker exec statex_[service-name]_dev curl http://host.docker.internal:[port]
   
   # Check external connectivity
   curl http://localhost:[port]
   ```

### Database Issues

**Symptoms:**
- Database connection errors
- Migration failures
- Data corruption

**Solutions:**
1. **PostgreSQL Issues:**
   ```bash
   # Check PostgreSQL status
   docker logs statex_postgres_dev
   
   # Connect to database
   docker exec -it statex_postgres_dev psql -U statex -d statex
   
   # Reset database if needed
   docker restart statex_postgres_dev
   ```

2. **Redis Issues:**
   ```bash
   # Check Redis status
   docker logs statex_redis_dev
   
   # Connect to Redis
   docker exec -it statex_redis_dev redis-cli
   
   # Reset Redis if needed
   docker restart statex_redis_dev
   ```

### Performance Issues

**Symptoms:**
- Slow startup times
- High resource usage
- Timeout errors

**Solutions:**
1. **Resource Optimization:**
   ```bash
   # Check resource usage
   docker stats
   
   # Limit resource usage in docker-compose files
   # Add resource limits to services
   ```

2. **Startup Optimization:**
   ```bash
   # Use fast startup
   ./dev-manage.sh start --fast
   
   # Start only needed services
   ./dev-manage.sh dev [service-name]
   ```

### Environment Issues

**Symptoms:**
- Configuration errors
- Missing environment variables
- API key issues

**Solutions:**
1. **Check Environment Configuration:**
   ```bash
   # Check if .env.development exists
   ls -la .env.development
   
   # Copy template if missing
   cp env.development.template .env.development
   
   # Edit configuration
   nano .env.development
   ```

2. **Validate Configuration:**
   ```bash
   # Check environment variables
   ./dev-manage.sh status
   
   # Look for configuration errors in logs
   ./dev-manage.sh logs [service-name]
   ```

### Quick Fixes

**For Most Common Issues:**
```bash
# 1. Check status
./dev-manage.sh status

# 2. Diagnose issues
./dev-manage.sh diagnose

# 3. Try automatic fix
./dev-manage.sh fix

# 4. If still failing, restart everything
./dev-manage.sh restart --fast

# 5. If still failing, clean and restart
./dev-manage.sh clean --force
./dev-manage.sh start --fast
```

**For Specific Service Issues:**
```bash
# Check service logs
./dev-manage.sh logs [service-name]

# Restart specific service
./dev-manage.sh dev [service-name]

# Check service health
curl http://localhost:[port]/health
```

### Getting Help

**If issues persist:**
1. Check the comprehensive status: `./dev-manage.sh status`
2. Run health check: `./dev-manage.sh health`
3. Check service logs: `./dev-manage.sh logs [service-name]`
4. Try automatic fix: `./dev-manage.sh fix`
5. Check this troubleshooting guide for specific solutions

**For advanced debugging:**
- Check Docker logs: `docker logs [container-name]`
- Check system resources: `docker stats`
- Check network connectivity: `docker network inspect statex_network`
- Check port usage: `lsof -i :[port]`
