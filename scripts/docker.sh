#!/bin/bash

show_help() {
    echo "Usage: $0 {dev|prod|stop|logs|status|ps|help}"
    echo ""
    echo "Commandes:"
    echo "  dev         - Lance les conteneurs en mode dev          - docker compose up --build (dev mode)"
    echo "  prod        - Lance les conteneurs en mode prod         - docker compose -f docker-compose.prod.yml up -d --build"
    echo "  stop        - Arrête les conteneurs du dossier          - docker compose down"
    echo "  logs        - Affiche les logs des conteneurs           - docker compose logs -f"
    echo "  status      - Affiche le status des conteneurs          - docker compose ps"
    echo "  help, -h    - Affiche l'aide du script                  - $0 help"
    exit 0
}

get_env_status() {
    local backend=$(docker compose ps -q backend 2>/dev/null)
    if [[ -n "$backend" ]]; then
        local node_env=$(docker inspect "$backend" --format='{{range .Config.Env}}{{if eq . "NODE_ENV=dev"}}dev{{else if eq . "NODE_ENV=production"}}prod{{end}}{{end}}' 2>/dev/null || echo "unknown")
        echo "ENV: $node_env"
    fi
}

case "$1" in
    "dev")
        docker compose --env-file .env.dev up --build
        ;;
    "prod")
        docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
        ;;
    "stop")
        docker compose --env-file .env.example down
        ;;
    "logs")
        docker compose --env-file .env.example logs -f
        ;;
    "status")
        docker compose --env-file .env.example ps
        echo "---"
        get_env_status
        ;;
    "help" | "-h" | "--help")
        show_help
        ;;
    *)
        echo "Erreur: commande '$1' inconnue"
        show_help
        ;;
esac