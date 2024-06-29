import os
import time
import base64
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configurações do GitHub
GITHUB_TOKEN = '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'
OWNER = 'kaue431'
REPO = 'panama-biblioteca'

# Caminho para monitorar (onde estão os arquivos HTML, CSS e JS)
WATCH_PATH = os.path.join(os.path.dirname(__file__), 'html-css-js')

# Cabeçalhos da solicitação
headers = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return

        # Apenas arquivos HTML, CSS e JS
        if event.src_path.endswith(('.html', '.css', '.js')):
            self.commit_changes(event.src_path)

    def commit_changes(self, file_path):
        # Caminho relativo do arquivo no repositório
        repo_path = os.path.relpath(file_path, WATCH_PATH)

        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Converter o conteúdo do arquivo para base64
        encoded_content = base64.b64encode(content.encode('utf-8')).decode('utf-8')

        # URL da API para criar ou atualizar um arquivo
        url = f'https://api.github.com/repos/{OWNER}/{REPO}/contents/{repo_path}'

        # Verificar se o arquivo já existe para obter o sha
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            # Arquivo existe, pegar o sha
            sha = response.json()['sha']
            data = {
                'message': f'Atualizando {repo_path}',
                'content': encoded_content,
                'sha': sha
            }
        else:
            # Arquivo não existe
            data = {
                'message': f'Adicionando {repo_path}',
                'content': encoded_content
            }

        # Fazer a solicitação para criar ou atualizar o arquivo
        response = requests.put(url, headers=headers, json=data)

        # Verificar o resultado
        if response.status_code in [200, 201]:
            print(f'Arquivo {repo_path} salvo com sucesso.')
        else:
            print(f'Falha ao salvar o arquivo {repo_path}.')
            print(response.json())

if __name__ == "__main__":
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=WATCH_PATH, recursive=True)
    observer.start()

    print(f'Monitorando alterações em {WATCH_PATH}...')

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
