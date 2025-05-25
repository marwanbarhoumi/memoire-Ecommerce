pipeline {
  agent any

  stages {
    stage('Login Service Pipeline') {
      steps {
        echo '▶️ Démarrage du pipeline Login Service'
        build job: 'login-service-pipeline', wait: false
      }
    }

    stage('User Service Pipeline') {
      steps {
        echo '▶️ Démarrage du pipeline User Service'
        build job: 'user-service-pipeline', wait: false
      }
    }

    stage('Product Service Pipeline') {
      steps {
        echo '▶️ Démarrage du pipeline Product Service'
        build job: 'product-service-pipeline', wait: false
      }
    }

    stage('Frontend Pipeline') {
      steps {
        echo '▶️ Démarrage du pipeline Frontend'
        build job: 'frontend-pipeline', wait: false
      }
    }
  }

  post {
    success {
      echo '✅ Tous les pipelines ont été déclenchés avec succès !'
      slackSend channel: '#deployments', 
                message: '🚀 Tous les microservices ont été déployés avec succès'
    }
    failure {
      echo '❌ Une des étapes a échoué'
      slackSend channel: '#alerts', 
                message: '⚠️ Échec du pipeline principal. Vérifier les sous-pipelines'
    }
  }
}