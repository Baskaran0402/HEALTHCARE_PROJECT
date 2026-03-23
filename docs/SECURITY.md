# 🛡️ Institutional Security & Infrastructure Lattice

## 1. Identity & Access Management (IAM)

AruviAI implements a **Tri-Layer Identity Lattice** to ensure zero-trust clinical data access:

-   **JWT Bearer Authentication**: All subsequent requests after institutional uplink require a RS256-signed JSON Web Token.
-   **Role-Based Access Control (RBAC)**: Strict separation of concerns between `Patient`, `Clinician`, and `Institutional Operator`.
-   **Identity Provider Integration**: Supports Google Identity Services (GIS) with domain-restricted enforcement (e.g., SVCE.ac.in).

## 2. Data Privacy & Encryption

### In-Transit Security (TLS)
All institutional nodes communicate over **HTTPS (TLS 1.3)** with mandatory SSL/TLS certificate verification. WebSocket connections are similarly secured via `wss://` protocols.

### Data at Rest
PostgreSQL persistence is hardened using the following principles:
1.  **Disk-Level Encryption**: Recommendation of BitLocker (Windows) or LUKS (Linux) on the underlying storage volume.
2.  **Field-Level Anonymization**: PII (Personally Identifiable Information) is isolated. The `patient_id` serves as a synthetic key throughout the neural stratification process.
3.  **Encrypted PDF Synthesis**: Clinical transcripts generate secured PDF buffers using AES-256 equivalent logic in the generation pipeline.

## 3. Resilience & Disaster Recovery

### High-Frequency Backups
-   **RPO (Recovery Point Objective)**: 24 hours.
-   **RTO (Recovery Time Objective)**: < 2 hours.
-   **Automation**: Scheduled PowerShell scripts perform daily database dumps and log rotations.

### Infrastructure Monitoring (APM)
AruviAI integrates **Prometheus** and **Grafana** for real-time telemetry:
-   **Metrics Exposure**: `/metrics` endpoint via `prometheus-fastapi-instrumentator`.
-   **Telemetry Vectors**: Request Latency (P99), Error Density, and Neural Node Throughput.

## 4. Compliance Framework

The AruviAI architecture is designed with **Foundational HIPAA/GDPR Principles**:
-   **Audit Persistence**: All diagnostic assessments and administrative logins are logged to the PostgreSQL lattice for institutional compliance review.
-   **Data Portability**: Patients can request full diagnostic history exports via the Clinical Transcript engine.
-   **Revocation**: Institutional administrators can revoke clinician access nodes immediately in the Master Control console.

---
*For critical security incidents, contact the lead researcher at baskarseenu2005@gmail.com*
