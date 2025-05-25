pipeline {
    agent any

    stages {
        // Étape 1 : Login Service
        stage('Login Service') {
            steps {
                echo '▶️ Démarrage du pipeline Login Service'
                build job: 'login-service-pipeline', 
                      parameters: [string(name: 'ENVIRONMENT', value: 'production')],
                      wait: true
            }
        }

        // Étape 2 : User Service
        stage('User Service') {
            steps {
                echo '▶️ Démarrage du pipline User Service'
                build job: 'user-service-pipline',
                      parameters: [string(name: 'VERSION', value: env.BUILD_ID)],
                      wait: true
            }
        }

        // Étape 3 : Product Service
        stage('Product Service') {
            steps {
                echo '▶️ Démarrage du pipline Product Service'
                build job: 'product-service-pipline',
                      wait: true
            }
        }

        // Étape 4 : Frontend
        stage('Frontend') {
            steps {
                echo '▶️ Démarrage du pipeline Frontend'
                build job: 'frontend-pipeline',
                      parameters: [string(name: 'CACHE_BUST', value: new Date().getTime().toString())],
                      wait: true
            }
        }
    }

    post {
        always {
            echo '🔹 Nettoyage des ressources...'
            cleanWs()
        }
        success {
            echo '✅ Tous les pipelines ont été exécutés avec succès !'
            slackSend(color: 'good', message: "Déploiement réussi - Build ${env.BUILD_NUMBER}")
        }
        failure {
            echo '❌ Une des étapes a échoué.'
            slackSend(color: 'danger', message: "Échec du déploiement - Build ${env.BUILD_NUMBER}")
        }
    }
}