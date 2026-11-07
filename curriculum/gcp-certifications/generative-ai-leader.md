# Generative AI Leader — Guide Intensif de Préparation

## 1. Vision Stratégique & Écosystème Google AI

Comprendre les opportunités d'affaires, la faisabilité technique et la mise en œuvre responsable des technologies d'IA générative dans l'entreprise.

## 2. Modèles Fondamentaux Google (Foundation Models)

- **Famille Gemini** :
  - **Gemini 1.5 Pro** : Fenêtre de contexte de 2 millions de tokens, capacités multimodales avancées (texte, code, audio, vidéo, PDF).
  - **Gemini 1.5 Flash** : Modèle ultra-rapide et économique, optimisé pour les tâches à haut débit et faible latence.
  - **Gemma / Gemma 2** : Modèles de poids ouverts (open weights) développés par Google DeepMind, exécutables localement ou sur infrastructure dédiée.
  - **Imagen 3 & Veo** : Génération d'images photoréalistes et de vidéos cinématiques.

## 3. Plateforme Vertex AI

- **Model Garden** : Catalogue de plus de 150 modèles propriétaires (Google) et open source (Hugging Face, Llama, Mistral).
- **Prompt Engineering & Systèmes de RAG (Retrieval-Augmented Generation)** :
  - In-context learning, Few-shot prompting, Chain-of-Thought (CoT).
  - Vertex AI Search & Conversation : Moteur de recherche d'entreprise avec ancrage (grounding) sur documents privés ou Google Search.
  - Vertex AI Vector Search : Recherche de similarité vectorielle à très haute échelle (ScANN algorithm).
- **Grounding (Ancrage) & Atténuation des Hallucinations** :
  - Ancrage sur les données d'entreprise via Cloud Storage ou BigQuery.
  - Métriques d'évaluation : Exact Match, ROUGE, BLEU, et métriques d'évaluation basées sur des modèles (LLM-as-a-judge).

## 4. IA Responsable & Sécurité

- Principes de l'IA Google (Google AI Principles) : Utilité sociale, prévention des biais, confidentialité, responsabilité.
- Filtres de modération et seuils de blocage configurables dans Vertex AI (Hate Speech, Harassment, Sexual Content, Dangerous Content).
- Protection contre l'injection de prompts (Prompt Injection) et l'exfiltration de données d'entraînement.
