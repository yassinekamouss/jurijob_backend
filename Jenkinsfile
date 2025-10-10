pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yassinekamouss/jurijob_backend"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
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
                sh '''
                    docker build -t $DOCKER_IMAGE:3 .
                    docker tag $DOCKER_IMAGE:$IMAGE_TAG $DOCKER_IMAGE:latest
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Connexion et push de l'image sur Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'yassinekamouss-dockerhub',
                                                 usernameVariable: 'DOCKER_USER',
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_IMAGE:$IMAGE_TAG
                        docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo "❌ Le pipeline a échoué."
        }
        success {
            echo "✅ Pipeline terminé avec succès !"
        }
    }
}
