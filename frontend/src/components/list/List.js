import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import { title, expert } from '../../actions';
import './list.scss';
import Card from '../card/Card';

class List extends Component {
	state = {
		count: 0,
		experts: [],
		nextPageLink: null,
		getEdit: false
	};

	componentDidMount() {
		this.props.title('Talents List');
		this.getListItem();
	}

	getListItem = () => {
		axios.get(`api/`).then(({ data }) => {
			this.setState({
				count: data.count,
				experts: data.results,
				nextPageLink: data.next
			});
		});
	};

	getMoreBTN = () => {
		if (this.state.nextPageLink) {
			return (
				<div className="col-12 text-center">
					<button
						className="load-more"
						onClick={this.getNextPage}
						type="button"
					>
						load more
					</button>
				</div>
			);
		}
	};

	getNextPage = () => {
		if (this.state.nextPageLink) {
			axios.get(this.state.nextPageLink).then(({ data }) => {
				this.setState({
					experts: [...this.state.experts, ...data.results],
					nextPageLink: data.next
				});
			});
		}
	};

	getSortType = e => {
		const sort_type = e.target.value;
		axios.get(`api/?order_by=${sort_type}`).then(({ data }) => {
			this.setState({
				experts: data.results,
				nextPageLink: data.next
			});
			console.log(this.state);
		});
	};

	onDeleteHandl = id => {
		axios.defaults.xsrfCookieName = 'csrftoken';
		axios.defaults.xsrfHeaderName = 'X-CSRFToken';
		axios
			.delete(`api/${id}/`)
			.then(() => {
				this.getListItem();
			})
			.catch(error => console.log(error));
	};

	onEditHandl = person => {
		this.props.expert(person);
		this.setState({
			getEdit: true
		});
	};

	render() {
		return (
			<div className="col-9 card-list">
				<div className="row pb-5">
					<div className="col-6 total-resualt">
						<span>
							<b>{this.state.count} experts</b> matching your
							search
						</span>
					</div>
					<div className="col-auto ml-auto lien-under">
						<span>Sort By </span>
						<select
							className="custome-select"
							onChange={this.getSortType}
						>
							<option value="timestamp">Joined Date</option>
							<option value="rate">Popularity</option>
							<option value="name">Name</option>
						</select>
					</div>
					<div className="col-auto lien-under">
						<Link className="flaticon-plus add-new" to="/add" />
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						{this.state.experts.map(expert => (
							<Card
								key={expert.pk}
								person={expert}
								onDelete={this.onDeleteHandl}
								onEdit={this.onEditHandl}
							/>
						))}
					</div>
				</div>
				<div className="row pb-3">
					<div className="col-12 text-center count-info">
						<span>you have viewed </span>
						<span>
							{this.state.experts.length} of {this.state.count}{' '}
							experts
						</span>
					</div>
					{this.getMoreBTN()}
				</div>
				{this.state.getEdit && <Redirect to='/edit'/>}
			</div>
		);
	}
}

export default connect(
	null,
	{ title, expert }
)(List);
