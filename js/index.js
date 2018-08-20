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

	body.addEventListener('click', apagarDespesaReceita)

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

			switch(tipo.value) {
				case 'despesa':
					criarElementos(despesas)
					break
				case 'receita':
					criarElementos(receitas)
					break
			}
		}
	}

	function hidden() {
		const qtdDespesas = getTrs(despesas).length
		const qtdReceitas = getTrs(receitas).length
		if(qtdReceitas > 1 || qtdDespesas > 1) {
			remove(despesas, 'desaparecer')
			remove(receitas, 'desaparecer')
		} else {
			add(despesas, 'desaparecer')
			add(receitas, 'desaparecer')
		}
	}

	function criarElementos(pai) {
		const fragment = document.createDocumentFragment()
		const tdDescricao = create('td')
		const tdDescricaoContent = createText(descricao.value)
		const tdValor = create('td')
		const tdValorContent = createText(`R$ ${Number(valor.value).toFixed(2).replace('.', ',')}`)
		const tr = create('tr')
		const tdApagar = create('td')
		const tdApagarBtn = create('button')
		const tdApagarContent = createText('Apagar')
		const data = create('td')
		const dataContent = createText(getData())

		append(tdDescricao, tdDescricaoContent)
		append(tdValor, tdValorContent)
		append(data, dataContent)
		add(tdApagarBtn, 'apagar')
		append(tdApagarBtn, tdApagarContent)
		append(tdApagar, tdApagarBtn)

		append(fragment, tdDescricao)
		append(fragment, tdValor)
		append(fragment, data)
		append(fragment, tdApagar)
		append(tr, fragment)
		append(pai.firstElementChild.firstElementChild, tr)

		hidden()
		limparCampos()
		atualizaSaldo()
	}

	hidden()

	function limparCampos() {
		descricao.value = ''
		valor.value = ''
		tipo.value = 'despesa'
		descricao.focus()
	}

	function atualizaSaldo() {
		const valorTotalDespesas = getValores(despesas)
		const valorTotalReceitas = getValores(receitas)
		const saldoAtual = valorTotalReceitas - valorTotalDespesas
		saldo.textContent = `Saldo atual: R$${saldoAtual.toFixed(2).replace('.', ',')}`
	}

	function getValores(tipoGasto) {
		const total = Array.from(getTrs(tipoGasto))
						.filter((tr, indice) => indice != 0)
						.map(elemento => elemento.firstElementChild.nextElementSibling)
						.map(td => Number(td.textContent.substring(3).replace(',', '.')))
						.reduce(function(acumulado, atual = 0) {
							return acumulado + atual
						}, 0)

		return total
	}

	function apagarDespesaReceita(event) {
		const btn = event.target
		const tr = btn.parentNode.parentNode
		const pai = tr.parentNode

		if(btn.classList.contains('apagar')) {
			pai.removeChild(tr)
			atualizaSaldo()
			hidden()
		}

	}

	function getTrs(elemento) {
		return elemento.querySelectorAll('tr')
	}

	function remove(elemento, classe) {
		elemento.classList.remove(classe)
	}

	function add(elemento, classe) {
		elemento.classList.add(classe)
	}

	const create = elemento => document.createElement(elemento)

	function append(elementoPai, elementoFilho) {
		elementoPai.appendChild(elementoFilho)
	}

	const createText = texto => document.createTextNode(texto)

	function getData() {
		const date = new Date()
		const ano = date.getFullYear()
		const mes = formataData(Number(date.getMonth()) + 1)
		const dia = formataData(date.getDate())
		return `${dia}/${mes}/${ano}`
	}

	const formataData = data => data < 10 ? `0${data}` : data

})()