<template>
  <div>
    <div class="buttons" v-on:click="getOpenProposals">Get Open Proposals</div>
    <hr>
    <table v-if="this.proposals.length != 0" id="Open Proposals">
      <thead>
        <tr>
          <th>Author</th>
          <th>Description</th>
          <th>Execution Date</th>
          <th>In Favor</th>
          <th id="vote">Vote</th>
          <th id="execute">Execute</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proposal in proposals" :key="proposal.idx">
          <td>{{proposal.author}}</td>
          <td>{{proposal.proposedFee}}</td>
          <td>{{proposal.executionDate}}</td>
          <td id="stance">
            <label>
              <input type="checkbox" :value="true" v-model="proposal.agrees">
            </label>
          </td>
          <td id="vote">
            <div v-if="proposal.executed">Was executed</div>
            <div v-else v-on:click="vote(proposal.id, proposal.agrees)" id="voteButton">Vote</div>
          </td>
          <td id="execute">
            <div v-if="!proposal.executed" v-on:click="execute(proposal)" id="executeButton">Execute</div>
            <div v-else>Was Executed</div>
          </td>
        </tr>
      </tbody>
    </table>
    <table v-if="this.proposals.length == 0" id="No Proposals">
      <thead>
        <tr>
          <th id="emptyPropHead">Proposals</th>
        </tr>
      </thead>
      <tbody>
        <td id="emptyPropCont">No Proposals loaded - Refresh</td>
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
export default {
  data() {
    return {
      proposals: [],
      openProposalsIndex: null
    }
  },
  methods: {
    openProposalsLength() {
      let length = new Promise((resolve, reject) => {
        this.$store.state
          .contractInstance()
          .getOpenProposalsLength.call(function(error, result) {
            if (error) {
              reject(error)
            } else {
              resolve(parseInt(result, 10))
            }
          })
      })
      return length
    },
    getProposalId() {
      let proposalId = new Promise((resolve, reject) => {
        this.$store.state
          .contractInstance()
          .openProposals.call(this.openProposalsIndex, (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(parseInt(result, 10))
            }
          })
      })
      return proposalId
    },
    async prepareIds() {
      this.openProposalsIndex = 0
      let length = await this.openProposalsLength.call()
      const results = []

      for (let i = 0; i < length; i++) {
        results.push(this.getProposalId.call())
        this.openProposalsIndex++
      }
      return Promise.all(results)
    },
    async getOpenProposals() {
      this.proposals = []
      let length = await this.openProposalsLength.call()
      this.prepareIds()
        .then(res => {
          for (let i = 0; i < length; i++) {
            this.$store.state
              .contractInstance()
              .proposals.call(res[i], (error, result) => {
                if (error) {
                  console.log(error)
                } else {
                  let _description = 'Change fee to '

                  if (parseInt(result[1], 10) === 1) {
                    _description = 'Add member '
                    _description = _description.concat(result[8])
                  } else if (parseInt(result[1], 10) === 2) {
                    _description = 'Remove member '
                    _description = _description.concat(result[8])
                  } else {
                    _description = _description.concat(
                      parseInt(result[7], 10) + ' wei'
                    )
                  }

                  let date = new Date(parseInt(result[4], 10) * 1000)
                  date = date.toLocaleTimeString()

                  let newProposal = {
                    author: result[0],
                    proposedFee: _description,
                    executionDate: date,
                    id: i,
                    executed: result[6],
                    agrees: false
                  }

                  this.proposals.push(newProposal)
                }
              })
          }
        })
        .catch(err => console.log(err))
    },
    execute(proposal) {
      let id = proposal.id
      console.log('executing proposal', id)
      console.log(proposal.agrees)
      this.$store.state
        .contractInstance()
        .executeProposal(
          id,
          { from: this.$store.state.web3.coinbase },
          (error, result) => {
            if (error) {
              console.log(error)
              // proposal.executed = false
            } else {
              // proposal.executed = true
            }
          }
        )
    },
    vote(id, agrees) {
      console.log('vote for proposal', id)
      console.log(agrees)
      this.$store.state
        .contractInstance()
        .vote(
          id,
          agrees,
          { from: this.$store.state.web3.coinbase },
          (error, result) => {
            if (error) {
              console.log(error)
            }
          }
        )
    }
  }
}
</script>

<style scoped>
table {
  font-family: 'Open Sans', sans-serif;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 1109px;
  border-collapse: collapse;
  border: 2px solid #034234;
}

table th {
  text-transform: uppercase;
  text-align: left;
  background: #0c0b0c;
  color: #fff;
  padding: 8px;
  min-width: 30px;
}

table td {
  text-align: left;
  padding: 12px;
  border-right: 2px solid #034234;
}
table td:last-child {
  border-right: none;
}
table tbody tr:nth-child(2n) td {
  background: #e4dfe4;
}
#stance {
  text-align: center;
}
#vote {
  text-align: center;
}
#execute {
  text-align: center;
}
#voteButton {
  cursor: pointer;
  margin: auto;
  width: 75px;
  padding: 5px;
  border: 2px solid #0c0b0c;
  box-shadow: 1px 1px #0c0b0c;
  border-radius: 10px;
}
#executeButton {
  cursor: pointer;
  margin: auto;
  width: 75px;
  padding: 5px;
  border: 2px solid #0c0b0c;
  box-shadow: 1px 1px #0c0b0c;
  border-radius: 10px;
}
.buttons {
  cursor: pointer;
  text-align: center;
  width: 200px;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 20px;
  border: 2px solid #034234;
  border-radius: 10px;
  color: #0f3242;
  box-shadow: 2px 2px #0c0b0c;
  width: 200px;
}
#emptyPropHead {
  text-align: center;
}
#emptyPropCont {
  text-align: center;
}
</style>
