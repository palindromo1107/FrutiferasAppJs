// Função para gerar um ID único usando timestamp atual
let ID = () => {
    return Date.now();
};

// Calcula a idade da planta em meses a partir da data do plantio até hoje
let calcularIdade = (dataPlantio) => {
    const plantio = new Date(dataPlantio);
    const hoje = new Date();

    let anos = hoje.getFullYear() - plantio.getFullYear();
    let meses = hoje.getMonth() - plantio.getMonth();

    if (meses < 0) {
        anos--;
        meses += 12;
    }

    return anos * 12 + meses;
};

// Recupera a lista de plantas do localStorage, ou retorna array vazio se não existir
let getPlantas = () => {
    const data = localStorage.getItem('plantas');
    return data ? JSON.parse(data) : [];
};

// Salva a lista de plantas no localStorage
let salvarPlantas = (plantas) => {
    localStorage.setItem('plantas', JSON.stringify(plantas));
}

// Prepara e exibe os cards das plantas na tela
let prepararCards = () => {
    const lista = document.getElementById('cartoes');
    lista.innerHTML = '';

    const plantas = getPlantas();

    if (plantas.length === 0) {
        lista.innerHTML = `<p class="text-center">Nenhuma planta cadastrada.</p>`;
        return;
    }

    plantas.forEach(item => {
        const idade = calcularIdade(item.plantio);

        const card = document.createElement('div');
        card.className = 'col-md-4';
        
// Estrutura do cartão
        card.innerHTML = `
        <div class="card h-100 shadow-sm">
            <div class="card-body">
            <h5 class="card-title">${item.nomePopular}</h5>
            <h6 class="card-subtitle mb-2 text-muted"><em>${item.nomeCientifico}</em></h6>
            <p class="card-text"><strong>Produção média:</strong> ${item.producaoMedia} Kg</p>
            <p class="card-text"><strong>Data do plantio:</strong> ${new Date(item.plantio).toLocaleDateString('pt-BR')}</p>
            <p class="card-text"><strong>Idade:</strong> ${idade} mês(es)</p>
            <p class="card-text"><strong>ID:</strong> ${item.id}</p> <!-- Corrigido para mostrar o ID correto da planta -->
            </div>
        </div>
        `;

        lista.appendChild(card);
    });
}

// Evento para tratar o envio do formulário de cadastro
document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault();

    // Verifica a validade dos campos do formulário
    if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    // Cria um novo objeto planta com dados do formulário e ID único
    const novaPlanta = {
        id: ID(),
        nomePopular: document.getElementById('nomePopular').value.trim(),
        nomeCientifico: document.getElementById('nomeCientifico').value.trim(),
        producaoMedia: parseFloat(document.getElementById('producaoMedia').value),
        plantio: document.getElementById('dataPlantio').value,
    };

    // Busca plantas salvas, adiciona a nova e salva novamente
    const plantas = getPlantas();
    plantas.push(novaPlanta);
    salvarPlantas(plantas);

    // Reseta formulário e remove validação visual
    this.reset();
    this.classList.remove('was-validated');

    // Fecha o modal de cadastro usando Bootstrap JS
    const modalEl = document.getElementById('modalCadastro');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // Atualiza a lista de cards na tela
    prepararCards();

});

// Quando a página carregar, já prepara os cards
document.addEventListener('DOMContentLoaded', prepararCards);
