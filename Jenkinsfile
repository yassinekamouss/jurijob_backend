pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('yassinekamouss-dockerhub') 
        DOCKER_IMAGE = "yassinekamouss/jurijob_backend" // à adapter
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Récupération du code depuis GitHub..."
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                echo "Installation des dépendances avec pnpm..."
                sh 'pnpm install'
            }
        }

        stage('Build Docker image') {
            steps {
                echo "Construction de l'image Docker..."
                script {
                    def imageTag = "${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                    sh "docker build -t ${imageTag} ."
                    sh "docker tag ${imageTag} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Connexion et push de l'image sur Docker Hub..."
                script {
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline terminé avec succès !"
        }
        failure {
            echo "❌ Le pipeline a échoué."
        }
    }
}
