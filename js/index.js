(function(){

	'use strict'

	const tipo = document.querySelector('[data-tipo]')
	const descricao = document.querySelector('[data-descricao]')
	const valor = document.querySelector('[data-valor]')
	const btn = document.querySelector('[data-btn]')
	const despesas = document.querySelector('[data-despesas]')
	const receitas = document.querySelector('[data-receitas]')
	const despesasReceitas = document.querySelector('#despesas-receitas')
	const saldo = document.querySelector('[data-saldo]')
	const body = document.querySelector('body')

	btn.addEventListener('click', previnirAcaoPadrao)
	btn.addEventListener('click', validarValor)

	valor.addEventListener('keydown', function(event) {
		if(event.keyCode == 13) {
			previnirAcaoPadrao()
			validarValor()
		}
		previnirTeclasNaoNumericas()
	})

	body.addEventListener('click', apagarTarefa)

	function previnirAcaoPadrao() {
		event.preventDefault()
	}

	function previnirTeclasNaoNumericas() {
		const teclasPermitidas = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 190, 37, 39]
		if(teclasPermitidas.indexOf(event.keyCode) == -1) {
			previnirAcaoPadrao()
		}
	}

	function validarValor() {
		if(valor.value && descricao.value && Number(valor.value) > 0) {
			const newValor = Number(valor.value)

			switch(tipo.value) {
				case 'despesa':
					adicionarDespesa()
					break
				case 'receita':
					adicionarReceita()
					break
			}
		}
	}

	function adicionarDespesa() {
		criarElementos(despesas)
	}

	function adicionarReceita() {
		criarElementos(receitas)
	}

	function hidden() {
		const qtdDespesas = despesas.querySelectorAll('tr').length
		const qtdReceitas = receitas.querySelectorAll('tr').length
		if(qtdReceitas > 1 || qtdDespesas > 1) {
			despesas.classList.remove('desaparecer')
			receitas.classList.remove('desaparecer')
		} else {
			despesas.classList.add('desaparecer')
			receitas.classList.add('desaparecer')
		}
	}

	function criarElementos(pai) {
		const tdDescricao = document.createElement('td')
		const tdDescricaoContent = document.createTextNode(descricao.value)
		const tdValor = document.createElement('td')
		const tdValorContent = document.createTextNode(valor.value)
		const tr = document.createElement('tr')
		const tdApagar = document.createElement('td')
		const tdApagarBtn = document.createElement('button')
		const tdApagarContent = document.createTextNode('Apagar')

		tdDescricao.appendChild(tdDescricaoContent)
		tdValor.appendChild(tdValorContent)
		tdApagarBtn.classList.add('apagar')
		tdApagarBtn.appendChild(tdApagarContent)
		tdApagar.appendChild(tdApagarBtn)

		tr.appendChild(tdDescricao)
		tr.appendChild(tdValor)
		tr.appendChild(tdApagar)

		pai.firstElementChild.firstElementChild.appendChild(tr)

		hidden()

		limparCampos()
		atualizaSaldo()
	}

	hidden()

	function limparCampos() {
		descricao.value = ''
		valor.value = ''
		descricao.focus()
	}

	function atualizaSaldo() {
		const valorTotalDespesas = getValores(despesas)
		const valorTotalReceitas = getValores(receitas)
		const saldoAtual = valorTotalReceitas - valorTotalDespesas
		saldo.textContent = `Saldo atual: R$${saldoAtual.toFixed(2).replace('.', ',')}`
	}

	function getValores(tipoGasto) {
		const total = Array.from(tipoGasto.querySelectorAll('tr'))
						.filter((tr, indice) => indice != 0)
						.map(elemento => elemento.firstElementChild.nextElementSibling)
						.map(td => Number(td.textContent))
						.reduce(function(acumulado, atual = 0) {
							return acumulado + atual
						}, 0)

		return total
	}

	function apagarTarefa(event) {
		const btn = event.target
		const tr = btn.parentNode.parentNode
		const pai = tr.parentNode

		if(btn.classList.contains('apagar')) {
			pai.removeChild(tr)
			atualizaSaldo()
			hidden()
		}

	}

})()