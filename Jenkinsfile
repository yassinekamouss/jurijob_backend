pipeline {
    // Définit l'environnement d'exécution.
    // Ici, on utilise un conteneur Docker léger avec Node.js v18.
    agent { docker { image 'node:18-alpine' } }

    stages {
        // --- Étape 1: Récupération du code ---
        stage('Checkout') {
            steps {
                // Remplacez l'URL par celle de votre dépôt Git.
                git url: 'https://github.com/yasssinekamouss/jurijob_backend.git', branch: 'main'
            }
        }

        // --- Étape 2: Installation des dépendances ---
        stage('Install Dependencies') {
            steps {
                echo 'Installation des dépendances npm...'
                // Exécute la commande "npm install" à l'intérieur du conteneur Node.js
                sh 'npm install -g pnpm && pnpm install'
            }
        }

        // --- Étape 4: Démarrage de l'application ---
        stage('Run Application') {
            steps {
                script {
                    echo "Démarrage de l'application..."
                    // La commande "npm start" doit être définie dans votre package.json
                    // On lance l'application en arrière-plan (&) pour ne pas bloquer le pipeline
                    sh 'pnpm start &'
                    
                    echo "L'application a été lancée en arrière-plan dans le conteneur."
                    // Note : L'application s'arrêtera à la fin du pipeline.
                }
            }
        }
    }

    post {
        // Cette section s'exécute toujours à la fin, que le pipeline réussisse ou échoue.
        always {
            echo 'Pipeline terminé.'
        }
    }
}
