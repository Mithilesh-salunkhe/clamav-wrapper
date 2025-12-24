# 🛡️ ClamAV Wrapper Service

A Docker-based ClamAV antivirus scanning service with a Node.js wrapper API that enables secure file scanning using ClamAV’s **INSTREAM** protocol.

This project is designed for **internal usage**, providing a controlled and isolated environment for malware scanning.

---

## 📌 Overview

This repository contains two Dockerized services:

### 1️⃣ clamav-service

- Runs ClamAV daemon (clamd)
- Listens on TCP port 3310
- Manages virus definition updates
- Performs internal health checks (PING → PONG)

### 2️⃣ wrapper-service

- Node.js (TypeScript) API
- Accepts file uploads
- Streams files to ClamAV using INSTREAM
- Exposes health check and scan endpoints
- Handles ClamAV unavailability gracefully

---

## 🧩 Documentation Reading Sequence (IMPORTANT)

To correctly deploy and use the service, read the documentation in the following order:

### ✅ Step 1: Target Machine Deployment Documentation

**Purpose:**  
Explains system requirements, Docker setup, folder usage, and how to run services on a machine.

**Reference PDF:**  
- [Target Machine Deployment Documentation](Documentation/ClamAV_Wrapper_Target_Machine_Deployment_Documentation_3.pdf)

👉 Read this before doing anything else

---

### ✅ Step 2: API Documentation

**Purpose:**  
Explains available endpoints:

- `/health`
- `/scan`

Includes request format, responses, and status codes.

**Reference PDF:**  
- [ClamAV Wrapper API Documentation](Documentation/Clam_Av_Wrapper_Api_Documentation.pdf)

👉 Read this after services are running

---

### ✅ Step 3: ClamAV Configuration Change Documentation

**Purpose:**  
Explains how to safely modify:

- File size limits
- Timeouts
- Concurrency
- ClamAV daemon limits

**Reference PDF:**  
- [ClamAV Configuration Manual](Documentation/clamav_config_manual_2.pdf)

👉 Read this only if configuration changes are required

---

## 🖥️ System Requirements

### Mandatory

- Docker Desktop
