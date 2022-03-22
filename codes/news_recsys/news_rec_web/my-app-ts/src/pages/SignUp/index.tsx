import React, { Component } from 'react'
import { Button } from 'antd-mobile';

export default class SignUp extends Component {
	render() {
		return (
			<div>
				<button>点我</button>
				<Button color='primary'>Primary</Button>
        <Button color='success'>Success</Button>
        <Button color='danger'>Danger</Button>
        <Button color='warning'>Warning</Button>
			</div>
		)
	}
}
