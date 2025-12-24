FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install ClamAV
RUN apt-get update && \
    apt-get install -y clamav clamav-daemon clamav-freshclam netcat dos2unix && \
    rm -rf /var/lib/apt/lists/*

# Create required directories and set ownership
RUN mkdir -p /var/lib/clamav /var/run/clamav /var/log/clamav && \
    chown -R clamav:clamav /var/lib/clamav /var/run/clamav /var/log/clamav

# Copy your runtime freshclam.conf and clamd.conf
COPY freshclam.conf /etc/clamav/freshclam.conf
COPY clamd.conf /etc/clamav/clamd.conf

# Fix line endings to avoid Windows CRLF issues
RUN dos2unix /etc/clamav/freshclam.conf

# Temporarily override problematic lines for build-time DB update
RUN sed -i 's/^DatabaseOwner/#DatabaseOwner/' /etc/clamav/freshclam.conf && \
    sed -i 's/^NotifyClamd/#NotifyClamd/' /etc/clamav/freshclam.conf

# Update virus database during build
RUN freshclam

# Restore runtime freshclam.conf (optional if you keep original lines in repo)
RUN sed -i 's/^#DatabaseOwner/DatabaseOwner/' /etc/clamav/freshclam.conf && \
    sed -i 's/^#NotifyClamd/NotifyClamd/' /etc/clamav/freshclam.conf

# Run clamd in foreground as clamav user
USER clamav
CMD ["clamd", "-c", "/etc/clamav/clamd.conf", "--foreground=yes"]
