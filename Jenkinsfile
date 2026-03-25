@Library('Master-Jenkins') _
pipeline {
    agent none
    environment {
        TAG="v${BUILD_NUMBER}"
        DOCKER_USER='haridtvt'
        S3_URL = "s3://devsecops-reports-haridtvt/${JOB_NAME}/${TAG}/"
        API_IMAGE="${DOCKER_USER}/bg-api:${TAG}"
        WORKER_IMAGE="${DOCKER_USER}/bg-worker:${TAG}"
        WEB_IMAGE="${DOCKER_USER}/bg-web:${TAG}"
    }
    stages {
        stage ('Check out') {
        agent { label 'Security_node || Application_node' }
            steps {
                checkout scm
            }
        }
        stage('Scan SAST'){
            environment {
                SONAR_AUTH_TOKEN = credentials('Sonarqube_token')
                SNYK_TOKEN = credentials('Snyk_credentials')
                SONAR_URL = "http://localhost:9000"
            }
            agent { label 'Security_node' }
            steps {
                scanSnyk()
                scanSonar(env.SONAR_URL, env.SONAR_AUTH_TOKEN, env.WORKSPACE)
                pushandcleanReport(env.S3_URL)
            }
        }
        stage('Build and image scan'){
            agent { label 'Security_node'}
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Docker_credentials', usernameVariable: 'DOCKER_UNAME', passwordVariable: 'DOCKER_PASS')]) {
                        loginDocker(env.DOCKER_PASS, env.DOCKER_UNAME)
                        buildImage(env.API_IMAGE,env.WORKER_IMAGE, env.WEB_IMAGE)
                        scanTrivy(env.API_IMAGE,env.WORKER_IMAGE, env.WEB_IMAGE)
                        pushImage(env.WEB_IMAGE, env.WEB_IMAGE, env.WEB_IMAGE)
                        pushandcleanReport(env.S3_URL)
                    }
                }
            }
        }
        stage('Deploy') {
            agent {
                label 'Application_node'
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Docker_credentials', usernameVariable: 'DOCKER_UNAME', passwordVariable: 'DOCKER_PASS')]) {
                        loginDocker(env.DOCKER_PASS, env.DOCKER_UNAME)
                        sh 'export POSTGRES_USER=${POSTGRES_USER}'
                        sh 'export POSTGRES_PASSWORD=${POSTGRES_PASSWORD}'
                        sh 'export POSTGRES_DB=${POSTGRES_DB}'
                        sh 'export REDIS_URL=${REDIS_URL}'
                        sh 'export DATABASE_URL=${DATABASE_URL}'
                        pullanddeployImage(env.WEB_IMAGE, env.WEB_IMAGE, env.WEB_IMAGE)
                    }
                }
            }
        }
    }
}