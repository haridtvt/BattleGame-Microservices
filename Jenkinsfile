@Library('Master-Jenkins') _
pipeline {
    agent none
    environment {
        TAG="v${BUILD_NUMBER}"
        DOCKER_USER='haridtvt'
        POSTGRES_USER=credentials('BG-USER')
        POSTGRES_PASSWORD=credentials('BG-PASSWORD')
        POSTGRES_DB='game'
        S3_URL = "s3://devsecops-reports-haridtvt/bg-testing/${TAG}/"
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
        stage('Snyk scan: Check dependencies'){
            environment {
                SONAR_AUTH_TOKEN = credentials('Sonarqube_token')
                SNYK_TOKEN = credentials('Snyk_credentials')
                SONAR_URL = "http://localhost:9000"
            }
            agent { label 'Security_node' }
            steps {
                scanSnyk()
                pushandcleanReport(env.S3_URL)
            }
        }
        stage('Sonarqube scan: Check quality and code smell'){
            environment {
                SONAR_AUTH_TOKEN = credentials('Sonarqube_token')
                SNYK_TOKEN = credentials('Snyk_credentials')
                SONAR_URL = "http://localhost:9000"
            }
            agent { label 'Security_node' }
            steps {
                scanSonar(env.SONAR_URL, env.SONAR_AUTH_TOKEN, env.WORKSPACE)
            }
        }
        stage('Build and image scan'){
            agent { label 'Security_node'}
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Docker_credentials', usernameVariable: 'DOCKER_UNAME', passwordVariable: 'DOCKER_PASS')]) {
                        loginDocker(env.DOCKER_PASS, env.DOCKER_UNAME)
                        buildImage(env.API_IMAGE,env.WORKER_IMAGE, env.WEB_IMAGE)
                    }
                }
            }
        }
        stage('Trivy scan: Image scan'){
            agent { label 'Security_node'}
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Docker_credentials', usernameVariable: 'DOCKER_UNAME', passwordVariable: 'DOCKER_PASS')]) {
                        loginDocker(env.DOCKER_PASS, env.DOCKER_UNAME)
                        scanTrivy(env.API_IMAGE,env.WORKER_IMAGE, env.WEB_IMAGE)
                        pushandcleanReport(env.S3_URL)
                    }
                }
            }
        }
        stage('Push Image'){
            agent { label 'Security_node'}
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Docker_credentials', usernameVariable: 'DOCKER_UNAME', passwordVariable: 'DOCKER_PASS')]) {
                        loginDocker(env.DOCKER_PASS, env.DOCKER_UNAME)
                        pushImage(env.WEB_IMAGE, env.WEB_IMAGE, env.WEB_IMAGE)
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
                        sh 'export TAG=${TAG}'
                        pullanddeployImage(env.WEB_IMAGE, env.WEB_IMAGE, env.WEB_IMAGE)
                    }
                }
            }
        }
    }
}