pipeline {
    // ...
    stages {
        // --- This entire stage should be removed ---
        stage('Checkout') {
            steps {
                git url: 'https://github.com/yassinekamouss/jurijob_backend.git', branch: 'main'
            }
        }
        // --- End of stage to be removed ---
        
        stage('Install Dependencies') {
            steps {
                echo 'Installation des dépendances avec pnpm...'
                sh 'pnpm install'
            }
        }
        // --- Étape 3: Build (si nécessaire) ---
        
        stage('Build') {
            steps {
                echo 'Build de l’application (si script présent dans package.json)...'
                sh 'pnpm run build || echo "Aucun build à effectuer"'
            }
        }

        // --- Étape 4: Démarrage de l'application Express ---
        stage('Run Application') {
            steps {
                script {
                    echo "Démarrage de l'application Express sur le port ${env.APP_PORT}..."
                    // On lance l'app en arrière-plan pour ne pas bloquer le pipeline
                    sh "pnpm start &"
                    echo "L'application est en cours d'exécution."
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline terminé.'
        }
    }
}
