FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install ClamAV
RUN apt-get update && \
    apt-get install -y clamav clamav-daemon clamav-freshclam netcat && \
    rm -rf /var/lib/apt/lists/*

# Create required directories and set ownership
RUN mkdir -p /var/lib/clamav /var/run/clamav /var/log/clamav && \
    chown -R clamav:clamav /var/lib/clamav /var/run/clamav /var/log/clamav

# Copy configs
COPY clamd.conf /etc/clamav/clamd.conf
COPY freshclam.conf /etc/clamav/freshclam.conf

# Update virus database
RUN freshclam

# Run clamd in foreground
USER clamav
CMD ["clamd", "-c", "/etc/clamav/clamd.conf", "--foreground=yes"]
