#!/bin/bash
# docker/scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_CONTAINER="driving-school-db"

echo "Starting backup at $DATE"

# Database backup
PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
  -h postgres \
  -U postgres \
  -d driving_school \
  --no-owner \
  --no-acl \
  | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"

# Optional: Upload to S3
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-backup-bucket/