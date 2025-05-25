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

    stage('Frontend Pipeline') {
      steps {
        dir('frontend') {
          echo '▶️ Démarrage du pipeline Frontend'
          build job: 'frontend-pipeline'
        }
      }
    }
  }
  stages {
    stage('product Service pipline') {
      steps {
        dir('backend/product') {
          echo '▶️ Démarrage du pipeline product Service'
          build job: 'product-service-pipline'
        }
      }
    }
    stages {
    stage('user Service pipeline') {
      steps {
        dir('backend/user') {
          echo '▶️ Démarrage du pipeline user Service'
          build job: 'user-service-pipeline'
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
