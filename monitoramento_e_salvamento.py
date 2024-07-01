import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(('.html', '.css', '.js')):
            print(f"Detected change in {event.src_path}. Saving changes...")
            # Aqui você pode adicionar lógica para salvar as alterações automaticamente

if __name__ == "__main__":
    path = "."  # Diretório atual
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=True)
    observer.start()
    
    try:
        print(f"Monitoramento iniciado em {path}. Pressione Ctrl+C para encerrar.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("Monitoramento encerrado.")
    
    observer.join()
