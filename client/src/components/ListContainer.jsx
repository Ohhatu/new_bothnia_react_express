const React = require("react")
const AddItem = require("./AddItem.jsx")
const List = require("./List.jsx")

class ListContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
    }
  }

  handleAddItem(newItem) {
    this.setState({
      list: this.state.list.concat([newItem]),
    })
  }

  handleRemoveItem(index) {
    let newList = this.state.list
    newList.splice(index, 1)

    this.setState({
      list: newList,
    })
  }

  render() {
    return (
      <div className="col-sm-6 col-md-offset-3">
        <div className="col-sm-12">
          <h3 className="text-center"> Todo List </h3>
          <AddItem add={this.handleAddItem.bind(this)} />
          <List
            items={this.state.list}
            remove={this.handleRemoveItem.bind(this)}
          />
        </div>
      </div>
    )
  }
}

module.exports = ListContainer
