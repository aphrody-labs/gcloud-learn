# Guide de Contribution aux Dépôts Open Source Google

## 1. Vue d'Ensemble des Projets Majeurs

| Projet         | Référentiel Principal              | Système de Revue                            | Langages Clés                               |
| :------------- | :--------------------------------- | :------------------------------------------ | :------------------------------------------ |
| **Chromium**   | `chromium.googlesource.com`        | Gerrit (`chromium-review.googlesource.com`) | C++, Rust, Python, JavaScript               |
| **Flutter**    | `github.com/flutter/flutter`       | GitHub Pull Requests                        | Dart, C++, Java, Kotlin, Swift, Objective-C |
| **Angular**    | `github.com/angular/angular`       | GitHub Pull Requests                        | TypeScript, HTML                            |
| **AOSP**       | `android.googlesource.com`         | Gerrit (`android-review.googlesource.com`)  | C++, Java, Rust, Kotlin                     |
| **gVisor**     | `github.com/google/gvisor`         | GitHub PRs & Gerrit Sync                    | Go, C++                                     |
| **Go**         | `go.googlesource.com/go`           | Gerrit (`go-review.googlesource.com`)       | Go, Assembly                                |
| **Abseil**     | `github.com/abseil/abseil-cpp`     | GitHub Pull Requests                        | C++                                         |
| **TensorFlow** | `github.com/tensorflow/tensorflow` | GitHub Pull Requests                        | C++, Python                                 |

---

## 2. Protocole de Contribution Gerrit

De nombreux projets Google majeurs (Chromium, AOSP, Go) utilisent **Gerrit** plutôt que les Pull Requests GitHub traditionnelles.

### Étapes Fondamentales :

1. **Contrat de Contribution Google (CLA)** :
   - Signer le Google Individual Contributor License Agreement sur `https://cla.developers.google.com/`.
2. **Installation de `depot_tools`** (Chromium / AOSP) :
   ```bash
   git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
   export PATH="$PATH:/path/to/depot_tools"
   ```
3. **Création d'une Branche de Travail** :
   ```bash
   git checkout -b fix-memory-leak
   ```
4. **Validation Locale & Tests** :
   - Chromium : `autoninja -C out/Default unit_tests && out/Default/unit_tests`
   - Go : `./all.bash`
5. **Génération du Commit avec Change-Id** :
   Le hook `commit-msg` injecte automatiquement un identifiant unique `Change-Id`:
   ```bash
   git commit -m "Fix memory leak in buffer allocation

   Resolves issue with unreleased IPC handles.
   "
   ```
6. **Upload vers Gerrit via `git cl` ou `git-codereview`** :
   - Pour Chromium : `git cl upload`
   - Pour Go : `git codereview mail`

---

## 3. Normes et Exigences de Code (Google Style Guides)

- **C++ (Chromium, Abseil)** : Conformité stricte au Google C++ Style Guide (`cpplint.py`), interdiction de `new`/`delete` nus (utilisation de `std::unique_ptr` ou `scoped_refptr`), pas d'exceptions C++.
- **Dart (Flutter)** : `dart format`, `dart analyze`, respect scrupuleux de l'arbre de widgets immuables et de la gestion de l'état sans fuites d'abonnements.
- **Go (gVisor, Go)** : Formatage strict avec `gofmt`, pas de panics dans les bibliothèques, gestion explicite des erreurs et zero-allocation loops sur les chemins critiques.
