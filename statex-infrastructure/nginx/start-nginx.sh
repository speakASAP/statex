#!/bin/sh

echo "Starting nginx with environment variable substitution..."

# Check if template exists
if [ ! -f /etc/nginx/templates/api-gateway.conf.template ]; then
    echo "ERROR: Template file not found!"
    exit 1
fi

# Substitute environment variables in nginx config
echo "Substituting environment variables..."

# Set default values for variables that might not be set
export AI_ORCHESTRATOR_HOST=${AI_ORCHESTRATOR_HOST:-ai-orchestrator}
export AI_ORCHESTRATOR_PORT=${AI_ORCHESTRATOR_PORT:-8010}
export NOTIFICATION_SERVICE_HOST=${NOTIFICATION_SERVICE_HOST:-notification-service}
export NOTIFICATION_SERVICE_PORT=${NOTIFICATION_SERVICE_PORT:-8005}
export SUBMISSION_SERVICE_HOST=${SUBMISSION_SERVICE_HOST:-submission-service}
export SUBMISSION_SERVICE_PORT=${SUBMISSION_SERVICE_PORT:-8002}
export USER_PORTAL_HOST=${USER_PORTAL_HOST:-user-portal}
export USER_PORTAL_PORT=${USER_PORTAL_PORT:-8006}
export CONTENT_SERVICE_HOST=${CONTENT_SERVICE_HOST:-content-service}
export CONTENT_SERVICE_PORT=${CONTENT_SERVICE_PORT:-8009}
export NLP_SERVICE_HOST=${NLP_SERVICE_HOST:-nlp-service}
export NLP_SERVICE_PORT=${NLP_SERVICE_PORT:-8011}
export ASR_SERVICE_HOST=${ASR_SERVICE_HOST:-asr-service}
export ASR_SERVICE_PORT=${ASR_SERVICE_PORT:-8012}
export DOCUMENT_AI_HOST=${DOCUMENT_AI_HOST:-document-ai}
export DOCUMENT_AI_PORT=${DOCUMENT_AI_PORT:-8013}
export PROTOTYPE_GENERATOR_HOST=${PROTOTYPE_GENERATOR_HOST:-prototype-generator}
export PROTOTYPE_GENERATOR_PORT=${PROTOTYPE_GENERATOR_PORT:-8014}
export TEMPLATE_REPOSITORY_HOST=${TEMPLATE_REPOSITORY_HOST:-template-repository}
export TEMPLATE_REPOSITORY_PORT=${TEMPLATE_REPOSITORY_PORT:-8015}
export FREE_AI_SERVICE_HOST=${FREE_AI_SERVICE_HOST:-free-ai-service}
export FREE_AI_SERVICE_PORT=${FREE_AI_SERVICE_PORT:-8016}
export AI_WORKERS_HOST=${AI_WORKERS_HOST:-ai-workers}
export AI_WORKERS_PORT=${AI_WORKERS_PORT:-8017}

# Now substitute the variables (exclude nginx variables that start with $)
envsubst '${AI_ORCHESTRATOR_HOST} ${AI_ORCHESTRATOR_PORT} ${NOTIFICATION_SERVICE_HOST} ${NOTIFICATION_SERVICE_PORT} ${SUBMISSION_SERVICE_HOST} ${SUBMISSION_SERVICE_PORT} ${USER_PORTAL_HOST} ${USER_PORTAL_PORT} ${CONTENT_SERVICE_HOST} ${CONTENT_SERVICE_PORT} ${NLP_SERVICE_HOST} ${NLP_SERVICE_PORT} ${ASR_SERVICE_HOST} ${ASR_SERVICE_PORT} ${DOCUMENT_AI_HOST} ${DOCUMENT_AI_PORT} ${PROTOTYPE_GENERATOR_HOST} ${PROTOTYPE_GENERATOR_PORT} ${TEMPLATE_REPOSITORY_HOST} ${TEMPLATE_REPOSITORY_PORT} ${FREE_AI_SERVICE_HOST} ${FREE_AI_SERVICE_PORT} ${AI_WORKERS_HOST} ${AI_WORKERS_PORT}' < /etc/nginx/templates/api-gateway.conf.template > /etc/nginx/conf.d/default.conf

# Check if substitution worked
echo "Generated config:"
head -10 /etc/nginx/conf.d/default.conf

# Test nginx config
echo "Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration is valid, starting nginx..."
    exec nginx -g "daemon off;"
else
    echo "ERROR: Nginx configuration test failed!"
    exit 1
fi
