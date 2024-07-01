#!/bin/bash

# Defina o intervalo de tempo em segundos (por exemplo, 300 segundos = 5 minutos)
INTERVALO=300

while true
do
    # Adiciona todos os arquivos alterados ao stage
    git add .

    # Cria um commit com mensagem automática incluindo a data e hora
    git commit -m "Autocommit $(date)"

    # Envia as alterações para o repositório remoto (substitua 'main' pelo nome do seu branch principal se necessário)
    git push origin main

    # Aguarda o intervalo de tempo antes de realizar o próximo salvamento automático
    sleep $INTERVALO
done
