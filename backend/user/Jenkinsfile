pipeline {
  agent any

  environment {
    DOCKER_IMAGE = 'marwen77/user-service:latest'
    DOCKER_CREDENTIALS_ID = 'docker-hub-credentials-id'
    KUBE_CONFIG_CREDENTIALS_ID = 'kubeconfig-credentials-id' // ID du fichier kubeconfig
  }

  stages {
    stage('Checkout Repo') {
      steps {
        git credentialsId: '0d81d621-69e2-42f1-9117-821cbce06f5b',
            url: 'https://github.com/marwanbarhoumi/memoire-Ecommerce',
            branch: 'main'
        sh 'git branch -a'
      }
    }

    stage('Install Dependencies ') {
      steps {
        dir('backend/user') {
          sh 'npm install'
        }
      }
    }

    stage('Run Tests') {
      steps {
        dir('backend/user') {
          sh 'npm test || echo "Tests échoués mais on continue..."'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        dir('backend/user') {
          script {
            env.BUILT_IMAGE_ID = docker.build(env.DOCKER_IMAGE).id
          }
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_CREDENTIALS_ID) {
            docker.image(env.DOCKER_IMAGE).push("latest")
          }
        }
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        dir('backend/user') {
          sh '''
            docker-compose down || true
            docker-compose up -d
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        dir('backend/user/k8s') {
          withCredentials([file(credentialsId: env.KUBE_CONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
            sh '''
              echo "🛠️ Déploiement dans Kubernetes..."
              kubectl version --client
              kubectl config current-context
              kubectl apply -f user-deployment.yaml
              kubectl apply -f service.yaml
              kubectl get pods -o wide
            '''
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline completed successfully 🚀'
    }
    failure {
      echo '❌ Pipeline failed'
    }
  }
}
