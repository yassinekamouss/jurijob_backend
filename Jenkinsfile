pipeline {
    agent any

    environment {
        APP_PORT = 5000
    }

    stages {
        // The code is already in the workspace from the implicit checkout.
        // No need for an explicit checkout stage.

        stage('Install Dependencies') {
            steps {
                echo 'Installation des dépendances avec pnpm...'
                sh 'pnpm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Build de l’application (si script présent dans package.json)...'
                sh 'pnpm run build || echo "Aucun build à effectuer"'
            }
        }

        stage('Run Application') {
            steps {
                script {
                    echo "Démarrage de l'application Express sur le port ${env.APP_PORT}..."
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
