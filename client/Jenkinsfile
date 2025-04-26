pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "marwanbarhoumi/site-ecommerce:${env.BUILD_NUMBER}"
        K8S_NAMESPACE = "ecommerce"
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/marwanbarhoumi/Site-Ecommerce.git', branch: 'main'
            }
        }
        stage('Build & Test') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
                sh 'npm test'  # Si vous avez des tests
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }
        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
                        docker.image(DOCKER_IMAGE).push()
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh """
                sed -i "s|image:.*|image: ${DOCKER_IMAGE}|g" k8s/deployment.yaml
                kubectl apply -f k8s/deployment.yaml -n ${K8S_NAMESPACE}
                kubectl apply -f k8s/service.yaml -n ${K8S_NAMESPACE}
                """
            }
        }
    }
}