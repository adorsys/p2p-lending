import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import baseContract from './BaseContract';

class App extends Component {
  state = {
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const lendingRequest = await baseContract.methods.lendingRequests(accounts[0]).call();
    this.setState({accounts, lendingRequest});
  }

  async handleSubmit() {
    await baseContract.methods.ask(this.state.form.lendingAmount, this.state.form.paybackAmount, this.state.form.purpose).send({from: this.state.accounts[0], gas: '500000'})
  }

  handleChange(event) {
    let fieldName = event.target.name;
    let fleldVal = event.target.value;
    this.setState({form: {...this.state.form, [fieldName]: fleldVal}})

    console.log(this.state);
  }


  render() {
    const block = this.state.lendingRequest ?
    <div className="App-intro">
      <h2>Verwendungszweck: {this.state.lendingRequest.purpose}</h2>
      <p>Asker: {this.state.lendingRequest.asker}</p>
    </div> : "";
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {block}

        <label htmlFor="lendingAmount">Lending Amount</label>
        <input name="lendingAmount" id="lendingAmount" value={this.state.lendingAmount} onChange={this.handleChange.bind(this)} type="number"/>

        <label htmlFor="paybackAmount">Payback Amount</label>
        <input name="paybackAmount" id="paybackAmount" value={this.state.paybackAmount} onChange={this.handleChange.bind(this)} type="number"/>

        <label htmlFor="purpose">Purpose</label>
        <input name="purpose" id="purpose" value={this.state.purpose} onChange={this.handleChange.bind(this)} type="text"/>

        <button onClick={() => this.handleSubmit()}>Submit</button>
      </div>
    );
  }
}

export default App;
