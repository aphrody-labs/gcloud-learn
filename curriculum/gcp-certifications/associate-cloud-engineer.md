# Associate Cloud Engineer (ACE) — Guide Intensif de Préparation

## 1. Objectifs de l'Examen

L'Associate Cloud Engineer déploie des applications, surveille des opérations et gère des solutions d'entreprise sur Google Cloud. Il est capable d'utiliser la console Google Cloud et l'interface de ligne de commande `gcloud`.

## 2. Piliers Fondamentaux

### A. Configuration de l'Environnement Cloud

- **Gestion des Projets et Comptes de Facturation** :
  ```bash
  gcloud projects create my-project-id --name="My Project"
  gcloud beta billing projects link my-project-id --billing-account=0X0X0X-0X0X0X-0X0X0X
  ```
- **IAM et Rôles** :
  - Rôles primitifs : `Viewer`, `Editor`, `Owner` (à éviter en production).
  - Rôles prédéfinis : `roles/resourcemanager.organizationAdmin`, `roles/storage.objectViewer`.
  - Rôles personnalisés (Custom Roles).
  - Comptes de service (Service Accounts) et Clés vs Impersonation (`gcloud config set auth/impersonate_service_account`).

### B. Planification et Configuration de la Solution

- **Calcul (Compute)** :
  - **Compute Engine** : Séries E2, N2, C3. Instances préemptibles vs Spot VMs. Groupes d'instances gérés (MIG) avec autoscaling et auto-healing.
  - **Google Kubernetes Engine (GKE)** : Mode Autopilot vs Standard. Node pools, Cluster Autoscaler, Ingress Controller.
  - **Cloud Run** : Conteneurs serverless sans état, scaling de 0 à N, concurrency et CPU boost.
  - **Cloud Functions (2nd gen)** : Basé sur Eventarc et Cloud Run, support des événements Cloud Storage, Pub/Sub.

### C. Réseau (VPC & Hybridation)

- VPC mondial unique par projet avec sous-réseaux régionaux.
- Routes, règles de pare-feu (Firewall Rules) avec tags réseau et service accounts.
- Cloud NAT pour l'accès Internet sortant des instances sans IP publique.
- Cloud Load Balancing : Global External Application Load Balancer (HTTP/HTTPS), Regional Load Balancer, Network Load Balancer (TCP/UDP).

### D. Stockage et Données

- **Cloud Storage** : Classes Standard, Nearline, Coldline, Archive. Object Lifecycle Management, Retention Policies, Immutabilité.
- **Cloud SQL** : MySQL, PostgreSQL, SQL Server avec High Availability (failover automatique) et réplicas de lecture.
- **Cloud Spanner** : SGBDR mondiallement distribué, cohérence forte (Strong Consistency), haute disponibilité 99.999%.
- **Firestore** : Base NoSQL orientée documents en temps réel, mode Datastore vs mode Native.
- **BigQuery** : Entrepôt de données serverless, requêtes SQL analytiques, partitionnement et clustering de tables.

## 3. Scénarios Types d'Examen

1. **Scénario Autoscaling GKE** : Une charge imprévisible avec montée brutale nécessite l'utilisation de GKE Autopilot ou d'un MIG avec politique d'autoscaling basée sur CPU ou métriques Cloud Monitoring.
2. **Scénario Sécurité IAM** : Donner l'accès temporaire à un bucket sans partager de clés d'API : privilégier les URL signées (`gsutil signurl` / Cloud Storage signed URLs) ou l'impersonation de compte de service.
3. **Scénario Disaster Recovery (DR)** : RTO et RPO bas sur Cloud SQL nécessitent l'activation de la haute disponibilité régionale (HA) et des sauvegardes automatiques avec réplication inter-régionale.
