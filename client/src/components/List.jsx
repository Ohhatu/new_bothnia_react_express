import React from "react"
//import List from "reactstrap"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

class List extends React.Component {
  render() {
    const styles = {
      uList: {
        paddingLeft: 0,
        listStyleType: "none",
      },
      listGroup: {
        margin: "5px 0",
        borderRadius: 5,
      },
      removeItem: {
        fontSize: 20,
        float: "left",
        position: "absolute",
        top: 12,
        left: 6,
        cursor: "pointer",
        color: "rgb(222, 79, 79)",
        border: "none",
        background: "none",
        padding: 0,
      },
      todoItem: {
        paddingLeft: 20,
        fontSize: 17,
      },
    }

    const listItems = this.props.items.map((item, index) => {
      return (
        /**
         * Not using a unique key that correlates
         * to the item will cause strange behaviour
         * when transitioning (visible on delete)
         *
         * try replacing key={item} with key={index}
         * to see what happens :)
         *
         * The point is - the key has to be unique for each
         * of the items to get the correct behaviour
         */
        <li key={item} className="list-group-item" style={styles.listGroup}>
          <button
            className="glyphicon glyphicon-remove"
            style={styles.removeItem}
            onClick={this.props.remove.bind(null, index)}
          />
          <span style={styles.todoItem}>{item}</span>
        </li>
      )
    })

    return (
      <ReactCSSTransitionGroup
        style={styles.uList}
        component="ul"
        transitionName="fade-in-out"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {listItems}
      </ReactCSSTransitionGroup>
    )
  }
}

module.exports = List
