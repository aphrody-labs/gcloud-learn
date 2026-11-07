# Professional Data Engineer (PDE) — Guide Intensif de Préparation

## 1. Objectifs & Cadre

Le Professional Data Engineer conçoit, construit, opérationnalise, sécurise et surveille des systèmes de traitement de données pour l'analyse décisionnelle et le Machine Learning.

## 2. Technologies Clés & Décisions Architecturales

### A. Entrepôt de Données Serverless : BigQuery

- **Optimisation des Requêtes et des Coûts** :
  - Partitionnement par date de chargement (`_PARTITIONDATE`) ou par colonne timestamp/entier.
  - Clustering multi-colonnes pour optimiser les filtres et les agrégations sans surcoût.
  - Éviter `SELECT *`, filtrer au plus tôt, utiliser `LIMIT` avec discernement (ne réduit pas le scan).
  - Vues matérialisées et BigQuery BI Engine pour l'accélération en mémoire.
  - BigQuery Omni pour les requêtes multi-cloud (AWS S3, Azure Blob) sans déplacement de données.

### B. Pipelines de Données : Dataflow & Apache Beam

- **Modèle de Traitement Unifié** : Batch et Streaming avec le SDK Apache Beam.
- **Gestion du Temps et Fenêtrage** :
  - Event Time (heure de l'événement) vs Processing Time (heure de traitement).
  - Types de fenêtres : Fixed (Tumbling), Sliding (Hopping), Session windows.
  - Gestion des données en retard : Watermarks, Allowed Lateness, Triggers (early/late firings).
  - Exactement-une-fois (Exactly-once semantics) de bout en bout avec Pub/Sub et BigQuery.

### C. Streaming à Haute Échelle : Cloud Pub/Sub

- Messagerie distribuée mondiale asynchrone sans provisionnement de serveurs.
- Modes de réception : Pull (classique/streaming pull) vs Push (webhook HTTP).
- Ordonnancement des messages : Ordering Keys pour garantir l'ordre séquentiel par clé.
- Dead Letter Topics pour isoler les messages corrompus après un nombre défini de tentatives.

### D. Stockage NoSQL & Séries Temporelles : Cloud Bigtable

- Base de données NoSQL clé-valeur colonnaire à très haut débit et latence < 10 ms.
- Conception des clés de ligne (Row Keys) :
  - Éviter impérativement les clés séquentielles monotones (timestamps seuls) pour prévenir le hotspotting.
  - Salting, reverse timestamps, et préfixes composites pour répartir uniformément les écritures sur les nœuds.

### E. Moteur Hadoop & Spark : Dataproc

- Clusters éphémères Dataproc avec Cloud Storage (GCS connector) remplaçant HDFS pour découpler stockage et calcul.
- Dataproc Serverless pour exécuter des scripts PySpark sans administrer de clusters.
