pipeline {
  agent any

  stages {
    stage('Login Service Pipeline') {
      steps {
        dir('backend/login') {
          echo '▶️ Démarrage du pipeline Login Service'
          build job: 'login-service-pipeline'
        }
      }
    }

    stage('User Service Pipeline') {
      steps {
        dir('backend/user') {
          echo '▶️ Démarrage du pipeline User Service'
          build job: 'user-service-pipeline'
        }
      }
    }

    stage('Product Service Pipeline') {
      steps {
        dir('backend/product') {
          echo '▶️ Démarrage du pipeline Product Service'
          build job: 'product-service-pipeline'
        }
      }
    }

    stage('Frontend Pipeline') {
      steps {
        dir('frontend') {
          echo '▶️ Démarrage du pipeline Frontend'
          build job: 'frontend-pipeline'
        }
      }
    }
  }

  post {
    success {
      echo '✅ Tous les pipelines ont été exécutés avec succès !'
    }
    failure {
      echo '❌ Une des étapes a échoué.'
    }
  }
}