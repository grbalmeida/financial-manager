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

	const getTrsLength = tr => getTrs(tr).length
	const getTrs = elemento => elemento.querySelectorAll('tr')
	const remove = (elemento, classe) => elemento.classList.remove(classe)
	const add = (elemento, classe) => elemento.classList.add(classe)
	const formatNumber = number => number.toFixed(2).replace('.', ',')
	const create = elemento => document.createElement(elemento)
	const formataData = data => data < 10 ? `0${data}` : data
	const createText = texto => document.createTextNode(texto)
	const append = (elementoPai, elementoFilho) => elementoPai.appendChild(elementoFilho)

	btn.addEventListener('click', previnirAcaoPadrao)
	btn.addEventListener('click', validarValor)
	body.addEventListener('click', apagarDespesaReceita)

	valor.addEventListener('keydown', function(event) {
		if(event.keyCode == 13) {
			previnirAcaoPadrao()
			validarValor()
		}
		previnirTeclasNaoNumericas()
	})

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
		if(getTrsLength(receitas) > 1 || getTrsLength(despesas) > 1) {
			remove(despesas, 'desaparecer')
			remove(receitas, 'desaparecer')
		} else {
			add(despesas, 'desaparecer')
			add(receitas, 'desaparecer')
		}
	}

	function criarElementos(pai) {
		const fragment = document.createDocumentFragment()

		const tdApagarBtn = criarTagComConteudo('button', 'Apagar')
		const tdValor = criarTagComConteudo('td', `R$ ${formatNumber(Number(valor.value))}`)
		const data = criarTagComConteudo('td', getData())
		const tdDescricao = criarTagComConteudo('td', descricao.value)
		const tr = create('tr')
		const tdApagar = create('td')

		add(tdApagarBtn, 'apagar')

		append(tdApagar, tdApagarBtn)
		appendFragment(fragment, tdDescricao, tdValor, data, tdApagar)
		append(tr, fragment)
		append(pai.firstElementChild.firstElementChild, tr)

		hidden()
		limparCampos()
		atualizaSaldo()
	}

	hidden()

	function criarTagComConteudo(tag, conteudo) {
		const newTag = create(tag)
		newTag.appendChild(createText(conteudo))
		return newTag
	}

	function limparCampos() {
		descricao.value = ''
		valor.value = ''
		tipo.value = 'despesa'
		descricao.focus()
	}

	function atualizaSaldo() {
		const saldoAtual = getValores(receitas) - getValores(despesas)
		saldo.textContent = `Saldo atual: R$${formatNumber(saldoAtual)}`
	}

	function getValores(tipoGasto) {
		return Array.from(getTrs(tipoGasto))
					.filter((tr, indice) => indice != 0)
					.map(elemento => elemento.firstElementChild.nextElementSibling)
					.map(td => Number(td.textContent.substring(3).replace(',', '.')))
					.reduce((acumulado, atual = 0) => acumulado + atual, 0)
	}

	function apagarDespesaReceita(event) {
		const btn = event.target
		const tr = btn.parentNode.parentNode

		if(btn.classList.contains('apagar')) {
			tr.parentNode.removeChild(tr)
			atualizaSaldo()
			hidden()
		}

	}

	function getData() {
		const date = new Date()
		const ano = date.getFullYear()
		const mes = formataData(Number(date.getMonth()) + 1)
		const dia = formataData(date.getDate())
		return `${dia}/${mes}/${ano}`
	}

	function appendFragment(fragmento, ...params) {
		params.forEach(param => {
			append(fragmento, param)
		})
	}

})()