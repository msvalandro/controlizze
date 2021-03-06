import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../assets/css/simple-sidebar.css';

export default class SideBar extends Component {

	componentDidMount() {
		$("#wrapper").toggleClass("toggled");

		$('.sidebar-nav .clicavel').click(function() {
			$('.sidebar-nav li').removeClass('active');		

			if (!$(this).hasClass('active')) {
				let target = $(this).children().attr('href');				
				
				if ($(this).find('.fa-xs').hasClass('fa-chevron-right')) {
					$(this).find('.fa-xs').removeClass('fa-chevron-right');
					$(this).find('.fa-xs').addClass('fa-chevron-down');
					$(target).css('display', '');	
					$(this).siblings(target).addClass('collapse-selecionados');
				} else {
					setTimeout(() => {
						$(this).siblings(target).removeClass('collapse-selecionados');						
					}, 300);
					$(this).find('.fa-xs').addClass('fa-chevron-right');
					$(this).find('.fa-xs').removeClass('fa-chevron-down');
				}
				$(this).addClass('active');

				let arrayLinks = $('.clicavel');
				arrayLinks.each(function() {
					target = $(this).children('a').attr('href');
					if (!$(this).hasClass('active') && target !== '/') {
						if ($(this).find('.fa-xs').hasClass('fa-chevron-right')) {
							$(this).children('.fa-xs').removeClass('fa-chevron-right');
							$(this).children('.fa-xs').addClass('fa-chevron-down');
							//$(this).siblings(target).addClass('collapse-selecionados');
							//$(this).siblings(target).addClass('show');							
						} else {
							$(target).slideUp();
							$(target).removeClass('show');
							$(this).find('.fa-xs').addClass('fa-chevron-right');
							$(this).find('.fa-xs').removeClass('fa-chevron-down');
						}
					}
				});
			}
		});
	}

	render() {
		return(
			<div id="wrapper" style={{marginTop: '56px'}}>
				<div id="sidebar-wrapper">
					<ul className="sidebar-nav" style={{marginTop: '20px'}}>
						<li className="clicavel">
							<Link to={'/'}>
								<div className="row">
									<div style={{width: '5px'}}>
										<i className="fas fa-tachometer-alt"></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Dashboard
									</div>
								</div>
							</Link>
						</li>

						<li id="lancamentos-li" className="clicavel">
							<Link to={'#collapseLancamentos'} data-toggle="collapse">
								<div className="row">
									<div style={{width: '5px'}}>
										<i className="fas fa-dollar-sign" style={{paddingLeft: '5px'}}></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Lançamentos
									</div>
									<div style={{width: '40px', float: 'right', position: 'absolute', right: '40px'}}>
										<i className="fas fa-chevron-right fa-xs"></i>
									</div>
								</div>
							</Link>
						</li>
						<div id="collapseLancamentos" className="collapse">
							<ul className="collapse-listas">
								<li>
									<Link to={{pathname: '/lancamento', state: {id: 0}}}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-plus"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Novo
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/lancamentos'}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-list"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Lista
											</div>
										</div>
									</Link>
								</li>
							</ul>
						</div>
						<li className="clicavel">
							<Link to={'#collapseLembretes'} data-toggle="collapse">
								<div className="row">
									<div className="text-center" style={{width: '5px'}}>
										<i className="far fa-calendar-alt" style={{paddingLeft: '5px'}}></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Lembretes
									</div>
									<div style={{width: '40px', float: 'right', position: 'absolute', right: '40px'}}>
										<i className="fas fa-chevron-right fa-xs"></i>
									</div>
								</div>
							</Link>
						</li>
						<div id="collapseLembretes" className="collapse">
							<ul className="collapse-listas">
								<li>
									<Link to={{pathname: '/lembrete', state: {id: 0}}}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-plus"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Novo
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/lembretes'}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-list"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Lista
											</div>
										</div>
									</Link>
								</li>
							</ul>
						</div>
						<li className="clicavel">
							<Link to={'#collapseRelatorios'} data-toggle="collapse">
								<div className="row">
									<div className="text-center" style={{width: '5px'}}>
										<i className="far fa-clipboard" style={{paddingLeft: '5px'}}></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Relatórios
									</div>
									<div style={{width: '40px', float: 'right', position: 'absolute', right: '40px'}}>
										<i className="fas fa-chevron-right fa-xs"></i>
									</div>
								</div>
							</Link>
						</li>
						<div id="collapseRelatorios" className="collapse">
							<ul className="collapse-listas">
								<li>
									<Link to={'/declaracaoanual'}>
										<div className="row">
											<div style={{marginLeft: '25px'}}>
												Declaração Anual
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/resumomensal'}>
										<div className="row">
											<div style={{marginLeft: '25px'}}>
												Resumo Mensal
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/resumofinanceiro'}>
										<div className="row">
											<div style={{marginLeft: '25px'}}>
												Resumo Financeiro
											</div>
										</div>
									</Link>
								</li>
							</ul>
						</div>
						<li className="clicavel">
							<Link to={'#collapseGraficos'} data-toggle="collapse">
								<div className="row">
									<div className="text-center" style={{width: '5px'}}>
										<i className="fas fa-chart-line" style={{paddingLeft: '5px'}}></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Gráficos
									</div>
									<div style={{width: '40px', float: 'right', position: 'absolute', right: '40px'}}>
										<i className="fas fa-chevron-right fa-xs"></i>
									</div>
								</div>
							</Link>
						</li>
						<div id="collapseGraficos" className="collapse">
							<ul className="collapse-listas">
								<li>
									<Link to={'/faturamento'}>
										<div className="row">
											<div style={{marginLeft: '25px'}}>
												Faturamento p/ Mês
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/despesascategoria'}>
										<div className="row">
											<div style={{marginLeft: '25px'}}>
												Despesas p/ Categoria
											</div>
										</div>
									</Link>
								</li>
							</ul>
						</div>
						<li className="clicavel">
							<Link to={'#collapseConfiguracoes'} data-toggle="collapse">
								<div className="row">
									<div className="text-center" style={{width: '5px'}}>
										<i className="fas fa-wrench" style={{paddingLeft: '5px'}}></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Configurações
									</div>
									<div style={{width: '40px', float: 'right', position: 'absolute', right: '40px'}}>
										<i className="fas fa-chevron-right fa-xs"></i>
									</div>
								</div>
							</Link>
						</li>
						<div id="collapseConfiguracoes" className="collapse">
							<ul className="collapse-listas">
								<li>
									<Link to={'/perfil'}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-user"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Conta
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/empresa'}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-building"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Empresa
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/categoria'}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-list-alt"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Categorias
											</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={'/logout'}>
										<div className="row">
											<div style={{width: '5px'}}>
												<i className="fas fa-sign-out-alt"></i>
											</div>
											<div style={{marginLeft: '45px'}}>
												Sair
											</div>
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</ul>
				</div>
			</div>
		);
	}
}