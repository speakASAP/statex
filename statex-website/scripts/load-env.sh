#!/bin/bash
# Script to load environment variables from docker.env

# Load environment variables from docker.env
set -a
source docker.env
set +a

# Run the command passed as arguments
exec "$@"

