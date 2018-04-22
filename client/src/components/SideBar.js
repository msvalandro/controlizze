import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../assets/css/simple-sidebar.css';

export default class SideBar extends Component {

	componentDidMount() {
		$("#wrapper").toggleClass("toggled");

		$('.sidebar-nav li').click(function() {
			$('.sidebar-nav li').removeClass('active');

			if (!$(this).hasClass('active')) {
				if ($(this).find('.fa-xs').hasClass('fa-chevron-down')) {
					$(this).find('.fa-xs').removeClass('fa-chevron-down');
					$(this).find('.fa-xs').addClass('fa-chevron-up');
				} else {
					$(this).find('.fa-xs').addClass('fa-chevron-down');
					$(this).find('.fa-xs').removeClass('fa-chevron-up');
				}
				$(this).addClass('active');
			}
		});
	}

	render() {
		return(
			<div id="wrapper" style={{marginTop: '56px'}}>
				<div id="sidebar-wrapper">
					<ul className="sidebar-nav" style={{marginTop: '20px'}}>
						<li>
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
						<li>
							<Link to={'#collapseLancamentos'} data-toggle="collapse">
								<div className="row">
									<div style={{width: '5px'}}>
										<i className="fas fa-dollar-sign" style={{paddingLeft: '5px'}}></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Lançamentos
									</div>
									<div style={{width: '5px'}}>
										<i className="fas fa-chevron-down fa-xs" style={{paddingLeft: '30px'}}></i>
									</div>
								</div>
							</Link>
						</li>
						<div id="collapseLancamentos" className="collapse">
							<ul className="collapse-listas">
								<li>
									<Link to={'/lancamento'}>
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
						<li>
							<Link to={'/'}>
								<div className="row">
									<div className="text-center" style={{width: '5px'}}>
										<i className="far fa-clipboard" style={{paddingLeft: '5px'}}></i>
									</div>
									<div style={{marginLeft: '45px'}}>
										Relatórios
									</div>
								</div>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}