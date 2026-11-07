# Professional Cloud Architect (PCA) — Guide Intensif de Préparation

## 1. Vue d'Ensemble & Stratégie

Le Professional Cloud Architect conçoit des solutions robustes, sécurisées, évolutives et hautement disponibles sur Google Cloud. L'examen teste la capacité à arbitrer entre contraintes métier, coûts, performances et exigences techniques.

## 2. Études de Cas Officielles (Case Studies)

- **EHR Healthcare** : Migration de dossiers médicaux critiques (HIPAA), connectivité hybride sécurisée via Cloud Interconnect et Cloud VPN, protection des données avec Cloud KMS et Cloud DLP.
- **Helicopter Racing League (HRL)** : Diffusion vidéo en direct à faible latence, inférence ML en temps réel (Cloud Vision, Vertex AI), mise en cache globale avec Cloud CDN.
- **Mountkirk Games** : Jeu mobile multijoueur mondial, traitement d'événements à très haut débit (Pub/Sub + Dataflow), base de données de profils de joueurs à latence sub-milliseconde (Cloud Spanner / Memorystore).
- **TerramEarth** : Télémétrie de véhicules agricoles connectés, ingestion de pétaoctets de données non structurées (IoT Core / Pub/Sub, Cloud Storage, BigQuery), entraînement de modèles prédictifs de maintenance.

## 3. Architecture d'Entreprise & Bonnes Pratiques

- **Topologie Réseau Multi-Projets** :
  - Shared VPC (VPC Partagé) avec projet hôte et projets de service.
  - VPC Network Peering pour l'interconnexion sans passerelle ni perte de débit.
  - Cloud Interconnect (Dedicated ou Partner) pour les liaisons 10Gbps/100Gbps privées.
- **Gouvernance et Sécurité** :
  - Organisation > Dossiers (Folders) > Projets.
  - Politiques d'organisation (Organization Policies) : restriction d'IP externes, désactivation de création de clés SA.
  - VPC Service Controls (VPC SC) pour isoler les données contre l'exfiltration.
  - BeyondCorp Enterprise pour l'accès Zero Trust aux applications d'entreprise sans VPN.
- **Conception Résiliente & Disaster Recovery** :
  - RTO (Recovery Time Objective) vs RPO (Recovery Point Objective).
  - Déploiement multi-régions avec Cloud Load Balancing mondial et basculement automatique sans interruption.
