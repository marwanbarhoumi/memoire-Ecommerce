pipeline {
  agent any

  stages {
    stage('gateway Pipeline') {
      steps {
        dir('backend/login') {
          echo '▶️ Démarrage du pipeline gateway Service'
          build job: 'gateway-pipeline'
        }
      }
    }

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

     stage('commande Service Pipeline') {
      steps {
        dir('backend/commende') {
          echo '▶️ Démarrage du pipeline commande'
          build job: 'commande-service-pipeline'
        }
      }
    }
  } // <-- Correction : Cette accolade fermante manquait

  post {
    success {
      echo '✅ Tous les pipelines ont été exécutés avec succès !'
    }
    failure {
      echo '❌ Une des étapes a échoué.'
    }
  }
}