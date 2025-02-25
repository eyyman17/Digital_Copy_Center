#!/bin/bash

# Build React app
cd frontend
npm run build

# Collect static files
cd ..
python manage.py collectstatic --noinput