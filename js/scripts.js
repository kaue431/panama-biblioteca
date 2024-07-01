document.addEventListener('DOMContentLoaded', function() {
    const livros = [
        { id: 1, titulo: 'Dom Casmurro', genero: 'Romance', quantidade: 3, disponivel: true },
        { id: 2, titulo: 'Memórias Póstumas de Brás Cubas', genero: 'Romance', quantidade: 2, disponivel: true },
        { id: 3, titulo: 'O Cortiço', genero: 'Romance', quantidade: 1, disponivel: false },
        { id: 4, titulo: 'Vidas Secas', genero: 'Romance', quantidade: 4, disponivel: true },
        { id: 5, titulo: 'Grande Sertão: Veredas', genero: 'Romance', quantidade: 2, disponivel: true }
    ];

    let alugueis = [
        { livro: 'Dom Casmurro', nome: 'João', sala: 'Sala 1' },
        { livro: 'Memórias Póstumas de Brás Cubas', nome: 'Maria', sala: 'Sala 2' },
        { livro: 'Dom Casmurro', nome: 'José', sala: 'Sala 1' },
        { livro: 'Vidas Secas', nome: 'Ana', sala: 'Sala 3' },
        { livro: 'Grande Sertão: Veredas', nome: 'Pedro', sala: 'Sala 2' }
    ];

    // Inicializa o gráfico
    const ctx = document.getElementById('grafico').getContext('2d');
    let grafico;

    // Função para atualizar o gráfico
    function atualizarGrafico() {
        const dadosPorSala = {};

        // Inicializa o objeto com contagem de gêneros por sala
        livros.forEach(livro => {
            if (!dadosPorSala[livro.sala]) {
                dadosPorSala[livro.sala] = {};
            }
            if (!dadosPorSala[livro.sala][livro.genero]) {
                dadosPorSala[livro.sala][livro.genero] = 0;
            }
        });

        // Conta a quantidade de livros por gênero em cada sala
        alugueis.forEach(aluguel => {
            const livro = livros.find(livro => livro.titulo === aluguel.livro);
            if (livro && dadosPorSala[aluguel.sala]) {
                if (!dadosPorSala[aluguel.sala][livro.genero]) {
                    dadosPorSala[aluguel.sala][livro.genero] = 0;
                }
                dadosPorSala[aluguel.sala][livro.genero] += 1;
            }
        });

        // Prepara os dados para o gráfico
        const labels = Object.keys(dadosPorSala); // Salas
        const generos = Object.keys(livros.reduce((acc, livro) => {
            acc[livro.genero] = true;
            return acc;
        }, {})); // Todos os gêneros

        const datasets = generos.map(genero => ({
            label: genero,
            data: labels.map(sala => dadosPorSala[sala][genero] || 0),
            backgroundColor: randomColor(),
        }));

        // Atualiza o gráfico
        if (grafico) {
            grafico.data.labels = labels;
            grafico.data.datasets = datasets;
            grafico.update();
        } else {
            grafico = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{ stacked: true }],
                        yAxes: [{ stacked: true }]
                    }
                }
            });
        }
    }

    // Atualiza o gráfico inicialmente
    atualizarGrafico();

    // Função para gerar cores aleatórias
    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // Atualiza o gráfico a cada 10 segundos
    setInterval(atualizarGrafico, 10000); // Atualiza a cada 10 segundos (10000 milissegundos)
});
